import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { formattedDate } from '../shared/utils/formatted-date';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';
import { BcryptService } from './providers/bcrypt.service';
import { TokenService } from './providers/token.service';
import { AccountActivationService } from './providers/account-activation.service';
import { MFAService } from '../mfa/mfa.service';
import { AccountActivationDto } from './dtos/activation.dto';
import { Op } from 'sequelize'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly bcryptService: BcryptService,
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
    res: Response,
  ): Promise<{ status: number; message: string; account_activation: string }> {
    // Obtenemos los datos necesarios para crear un usuario
    const { username, password, email } = signUpDto;

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
      const hashedPassword = await this.bcryptService.hash(password);

      // Creamos al usuario
      await this.usersService.createUser({
        username: username,
        password: hashedPassword,
        email: email,
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

  /**
   * Metodo para autenticar un cliente
   * @param loginDto Contiene informacion sobre el cliente
   * @param res Respuesta que se envia al cliente
   * @returns Respuesta al cliente (Cookie jwt)
   */
  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<{ status: number; message: string; MFA: string }> {
    // Obtener credenciales del usuario
    const { username, password } = loginDto;

    // Buscamos el usuarios y lo obtenemos
    const user = null //await this.usersService.findUser({ username: username });

    // Si el usuario no existe, Enviamos un excepcion NotFoundException
    if (!user) {
      throw new NotFoundException(
        `El usuario "${username}" no se encuentra registrado, Por favor registrese`,
      );
    }

    // Verificamos si el usuario esta verificado
    await this.usersService.userIsVerified(user.id);

    // Verificamos si el usuario esta bloqueado
    await this.usersService.userIsBlocked(user.id);

    // Verificamos si el usuario es valido para iniciar sesion
    if (!user.isVerified) {
      throw new ForbiddenException(
        'Por favor, active su cuenta para habilitar el acceso a los servicios.',
      );
    }

    // Comprobamos si las contraseña concuerdan con las del usuari
    const isPasswordMatching = await this.bcryptService.compare(
      password,
      user.password,
    );

    // Si las contraseñas no coinciden, entonces registramos una incidencia
    if (!isPasswordMatching) {
      await this.usersService.registerFailedAttempt(user.id);

      throw new ConflictException('Nombre de usuario o contraseña incorrecta');
    }

    // Creamos una session unica mediante uuidv4
    const sessionId = uuidv4();
    // await this.usersService.updateUser(user.id, { sessionId: sessionId });

    // Creamos y enviamos un token de autenticacion al usuario
    const token = this.tokenService.generate(user);
    this.tokenService.send(res, token);

    await this.mfaService.send(user.email);

    // Regresamos respuesta al usuario
    return {
      status: HttpStatus.OK,
      message: `Bienvenido ${user.username}, necesitamos que verfique que es usted, se ha enviado un codigo a su correo electronico asociado`,
      MFA: 'pending',
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

  async activate(
    accountActivationDto: AccountActivationDto,
  ): Promise<{ status: number; message: string }> {
    const { otp } = accountActivationDto;

    await this.accountActivationService.activate(otp);

    return {
      status: HttpStatus.OK,
      message: 'Su cuenta ha sido activada correctamente',
    };
  }
}
