import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiResponse } from 'src/common/interfaces/api.response.interface';
import { CookieService } from '../../common/providers/cookie.service';
import { TokenService } from '../../common/providers/token.service';
import { generateExpirationDate } from '../../common/utils/generate-expiration-date';
import { MFAService } from '../mfa/mfa.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RequestForgotPasswordDto } from './dtos/request-forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignUpDto } from './dtos/signup.dto';
import { ActivationService } from './providers/account-activation.service';
import { Argon2Service } from './providers/argon2.service';
import { RefreshTokenService } from './providers/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly argon2Service: Argon2Service,
    private readonly activationService: ActivationService,
    private readonly mfaService: MFAService,
    private readonly cookieService: CookieService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Handle the logic for user registration.
   * Validates input data, hashes the password, and create a new user in the database
   * @param signUpDto DTO contains user registration details
   * @returns A promise thant resolve when the user is created sucessfully
   */
  async signUp(signUpDto: SignUpDto): Promise<void> {
    // Retrieves the necessary user data from the provide DTO.
    const { username, password, email, phone } = signUpDto;

    // Ensures that no exists a user with same username or email
    const user = await this.usersService.findUser({
      where: [{ username: username }, { email: email }],
    });

    // If a user with same username or email exists, then throw exception
    if (user) {
      throw new ConflictException(
        `${username} the account is already register`,
      );
    }

    // Ensures that the password isn't committed
    await this.usersService.isPasswordPwned(password);

    // Hashing the password with the Argon2 algorithm
    const hashedPassword = await this.argon2Service.hash(password);

    // Creates a new user in the data base
    const newUser = await this.usersService.createUser({
      username: username,
      password: hashedPassword,
      email: email,
      phone: phone,
    });

    // Create a new token for account activation to the user
    const token = this.tokenService.generate(newUser);

    // Generates the expiration date to validate the token
    const expiresAt = generateExpirationDate(15);

    // Sends an account activation email to the user
    return await this.activationService.send(email, token, expiresAt);
  }

  // TODO Implementar bloqueo temporal de usuario
  /**
   * Metodo para autenticar un cliente
   * @param loginDto Contiene informacion sobre el cliente
   * @param res Respuesta que se envia al cliente
   * @returns Respuesta al cliente (Cookie jwt)
   */
  async login(
    loginDto: LoginDto,
    res: Response,
    req: Request,
  ): Promise<{ status: number; message: string; MFA: string; fromTo: string }> {
    // Obtener credenciales del usuario
    const { username, password } = loginDto;

    // Buscamos el usuarios y lo obtenemos
    const user = await this.usersService.findUser({
      where: {
        username: username,
      },
    });

    // Si el usuario no existe, Enviamos un excepcion NotFoundException
    if (!user) {
      throw new ConflictException(
        `El usuario "${username}" no se encuentra registrado, Por favor registrese`,
      );
    }

    // Verificamos si el usuario esta verificado
    await this.usersService.userIsVerified(user.id);

    // Verificamos si el usuario es valido para iniciar sesion
    if (!user.isActivated) {
      throw new ForbiddenException(
        'Por favor, active su cuenta para habilitar el acceso a los servicios.',
      );
    }

    // Comprobamos si las contraseña concuerdan con las del usuari
    const isPasswordMatching = await this.argon2Service.compare(
      user.password,
      password,
    );

    // Si las contraseñas no coinciden
    if (!isPasswordMatching) {
      throw new ConflictException('Nombre de usuario o contraseña incorrecta');
    }

    // Creamos y enviamos un token de autenticacion al usuario
    const token = this.tokenService.generate(user);

    // Enviamos el token con el cliente
    this.tokenService.send(res, token);

    // Creamos el token de refresco de autenticacion al usuario
    const refreshToken = await this.refreshTokenService.createOne(
      user,
      req.ip,
      req.get('user-agent') || '',
    );

    // Enviamos el token con el cliente
    this.refreshTokenService.send(res, refreshToken);

    // await this.mfaService.send(user.email, "LOGIN");

    // Regresamos respuesta al usuario
    return {
      status: HttpStatus.OK,
      message: `Bienvenido ${user.username}, necesitamos que verfique que es usted, se ha enviado un codigo a su correo electronico asociado`,
      MFA: 'pending',
      fromTo: 'LOGIN',
    };
  }

  /**
   * Metodo para cerrar la sesion de un usuario
   * @param res
   * @returns
   */
  async logout(res: Response): Promise<void> {
    this.cookieService.delete(res, 'accessToken');
    this.cookieService.delete(res, 'refreshAccessToken');
  }

  /**
   * Metodo que permite iniciar el proceso de recuperacion de contraseña
   * @param requestForgotPasswordDto
   * @returns
   */
  async requestForgotPassword(
    requestForgotPasswordDto: RequestForgotPasswordDto,
  ): Promise<{ status: number; message: string; MFA: string; fromTo: string }> {
    const { email } = requestForgotPasswordDto;

    await this.mfaService.send(email, 'FORGOT_PASSWORD');

    return {
      status: HttpStatus.OK,
      message:
        'Se ha iniciado el proceso de recuperacion de contraseña. Por favor revise su correo hemos enviado un codigo OTP',
      MFA: 'pending',
      fromTo: 'FORGOT_PASSWORD',
    };
  }

  /**
   * Metodo que permite restablecer y finalizar la recuperacion de contraseña
   * @param resetPasswordDto
   * @returns
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<IApiResponse> {
    const { email, newPassword } = resetPasswordDto;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new ConflictException('El usuario no existe');
    }

    const hashedNewPassword = await this.argon2Service.hash(newPassword);

    await this.usersService.updateUser(user.id, {
      password: hashedNewPassword,
    });

    return {
      status: HttpStatus.OK,
      message: 'Se ha restablecido la contraseña exitosamente',
    };
  }

  /**
   * Handles the logic for user account activation
   * @param userId Unique Identification of the user
   * @returns A promise that resolves when user account is successfully activated
   */
  async activate(token: string): Promise<void> {
    const jwtPayLoad = await this.tokenService.verify(token);
    
    await this.activationService.activate(jwtPayLoad.id);
  }

  async checkSession(req: Request): Promise<boolean> {
    const accessToken = this.cookieService.get(req, 'accessToken');

    if (!accessToken) {
      throw new UnauthorizedException('Token de acceso no encontrado');
    }

    try {
      const jwtPayload = this.tokenService.verify(accessToken);
      if (!jwtPayload) {
        throw new UnauthorizedException('Token inválido o expirado');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async refreshToken(req: Request, res: Response): Promise<boolean> {
    const refreshAccessToken = this.cookieService.get(
      req,
      'refreshAccessToken',
    );

    if (!refreshAccessToken) {
      throw new UnauthorizedException('Token para refrescar no encontrado');
    }

    const user = await this.refreshTokenService.verify(refreshAccessToken);
    await this.refreshTokenService.revokeRefreshToken(refreshAccessToken);

    const newAccessToken = this.tokenService.generate(user);
    const newRefreshAccessToken = await this.refreshTokenService.createOne(
      user,
      req.ip,
      req.get('user-agent') || '',
    );
    this.tokenService.send(res, newAccessToken);
    this.refreshTokenService.send(res, newRefreshAccessToken);

    return true;
  }
}
