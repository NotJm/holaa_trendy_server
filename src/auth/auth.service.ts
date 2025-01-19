import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { MFAService } from '../mfa/mfa.service';
import { UsersService } from '../users/users.service';
import { AccountActivationDto } from './dtos/activation.dto';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AccountActivationService } from './providers/account-activation.service';
import { Argon2Service } from './providers/argon2.service';
import { TokenService } from '../common/providers/token.service';
import { RequestForgotPasswordDto } from './dtos/request-forgot-password.dto';
import { ApiResponse } from '../common/interfaces/api.response.interface';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly argon2Service: Argon2Service,
    private readonly accountActivationService: AccountActivationService,
    private readonly mfaService: MFAService,
    
  ) {}

  /**
   * Metodo para registrar a un usuario en la base de datos
   * @param signUpDto
   * @returns Regresa el codigo de la respuesta a si como el mensaje de la peticion
   */
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ status: number; message: string; account_activation: string }> {
    // Obtenemos los datos necesarios para crear un usuario
    const { username, password, email, phone } = signUpDto;

    // Nos aseguramos que no exista un usuario con el mismo nombre de usuario o correo
    const existsUser = await this.usersService.findUser({
      where: [ 
          { username: username },
          { email: email },
      ],
    });

    // Si existe algun usuario con el mismo nombre de usuario o correo, entonces lanzamos una excepcion
    try {
      if (existsUser) {
        throw new ConflictException(
          `El usuario "${username}" ya tiene una cuenta registrada`,
        );
      }

      // Nos aseguramos que la contraseña no haya sido comprometida
      await this.usersService.isPasswordPwned(password);

      // Hasheamos la contraseña
      const hashedPassword = await this.argon2Service.hash(password);

      // Creamos al usuario
      await this.usersService.createUser({
        username: username,
        password: hashedPassword,
        email: email,
        phone: phone
      });
      
      // Enviamos un correo de activacion de cuenta
      await this.accountActivationService.send(email);

      return {
        status: HttpStatus.CREATED,
        message: `Gracias por registrarse ${username}, hemos enviado un codigo de activación de cuenta a su correo`,
        account_activation: 'pending',
      };

    } catch (err) {

      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error al registrar el usuario: ${err.message}`,
      });
    }
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
  ): Promise<{ status: number; message: string; MFA: string, fromTo: string }> {
    // Obtener credenciales del usuario
    const { username, password } = loginDto;

    // Buscamos el usuarios y lo obtenemos
    const user = await this.usersService.findUser({
      where: {
        username: username
      }
    });

    // Si el usuario no existe, Enviamos un excepcion NotFoundException
    if (!user) {
      throw new NotFoundException(
        `El usuario "${username}" no se encuentra registrado, Por favor registrese`,
      );
    }

    // Verificamos si el usuario esta verificado
    await this.usersService.userIsVerified(user.id);

    // Verificamos si el usuario es valido para iniciar sesion
    if (!user.isVerified) {
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

    await this.mfaService.send(user.email, "LOGIN");

    // Regresamos respuesta al usuario
    return {
      status: HttpStatus.OK,
      message: `Bienvenido ${user.username}, necesitamos que verfique que es usted, se ha enviado un codigo a su correo electronico asociado`,
      MFA: 'pending',
      fromTo: "LOGIN",
    };
  }

  /**
   * Metodo para cerrar la sesion de un usuario
   * @param res
   * @returns
   */
  async logout(res: Response): Promise<void> {
    // TODO Implementar cierre de sesion
  }

  /**
   * Metodo que permite iniciar el proceso de recuperacion de contraseña
   * @param requestForgotPasswordDto 
   * @returns
   */
  async requestForgotPassword(
    requestForgotPasswordDto: RequestForgotPasswordDto
  ): Promise<{ status: number; message: string; MFA: string, fromTo: string }> {
    const { email } = requestForgotPasswordDto;

    await this.mfaService.send(email, "FORGOT_PASSWORD");

    return {
      status: HttpStatus.OK,
      message: "Se ha iniciado el proceso de recuperacion de contraseña. Por favor revise su correo hemos enviado un codigo OTP",
      MFA: 'pending',
      fromTo: "FORGOT_PASSWORD",
    }
  }

  /**
   * Metodo que permite restablecer y finalizar la recuperacion de contraseña
   * @param resetPasswordDto 
   * @returns 
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<ApiResponse> {

    const { email, newPassword } = resetPasswordDto;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new ConflictException(
        'El usuario no existe'
      )
    }

    const hashedNewPassword = await this.argon2Service.hash(newPassword);

    await this.usersService.updateUser(user.id, { password: hashedNewPassword })

    return {
      status: HttpStatus.OK,
      message: "Se ha restablecido la contraseña exitosamente",
    }
  }


  /**
   * Metodo que activa la cuenta de un usuario
   * @param accountActivationDto 
   * @returns 
   */
  async activate(
    accountActivationDto: AccountActivationDto,
  ): Promise<ApiResponse> {
    const { otp } = accountActivationDto;

    await this.accountActivationService.activate(otp);

    return {
      status: HttpStatus.OK,
      message: 'Su cuenta ha sido activada correctamente',
    };
  }
}
