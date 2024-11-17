import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/restauration.dto';
import { PwnedService } from '../core/services/pwned.service';
import { ZxcvbnService } from '../core/services/zxcvbn.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from '../core/services/otp.service';
import { ActivationDto } from './dto/activation.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { LogService } from '../core/services/log.service';
import { IncidentService } from '../admin/incident/incident.service';
import { Request, Response } from 'express';
import { COOKIE_AGE, JWT_AGE, Role } from '../constants/contants';
import { EmailService } from 'src/admin/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private incidentService: IncidentService,
    private emailService: EmailService,
    private pwnedservice: PwnedService,
    private otpService: OtpService,
    private logService: LogService,
  ) {}

  /**
   * Metodo para registrar a un usuario en la base de datos
   * @param registerDto
   * @returns
   */
  async signIn(
    registerDto: RegisterDto,
  ): Promise<{ status: number; message: string }> {
    const { username, password, email } = registerDto;

    // Buscamos al usuario por correo electronico
    const existsUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    }).exec();


    // En caso de que el usuario exista se manda una excepción de conflicto
    if (existsUser) {
      // Mandamos una excepcion de conflicto para notificar que el usuario esta registrado
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: "El usuario o el correo electronico ya estan registrados, por favor inicie sesion",
      });
    }

    // Verificar si la contraseña está comprometida
    const timesCommitted =
      await this.pwnedservice.verificationPassword(password);

    if (timesCommitted > 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: `La contraseña ya fue comprometida ${timesCommitted} veces`,
      });
    }

    // Encriptamos la contrase;a de manera segura
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear esquema para la base de datos
    const newUser = new this.userModel({
      username: username,
      password: hashedPassword,
      email: email,
      permissions: ['change_password'],
    });

    // Guardar usuario
    await newUser.save();

    // Enviar email de verificación
    await this.sendEmailVerification(email);

    return {
      status: HttpStatus.OK,
      message:
        'Gracias por registrarse, hemos enviado un codigo de activación de cuenta a su correo',
    };
  }

  /**
   * Metodo para que detectar si un suario esta en la base de datos
   * @param loginDto
   * @param res
   * @returns
   */
  async logIn(
    loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<{ status: number; message: string }> {
    // Obtenemos las credenciales
    const { email, password } = loginDto;

    // Primero nos aseguramos de que existe el usuario
    const user = await this.userModel.findOne({ email });

    // Si el usuario no se encuentra registrado
    if (!user) {
      // Regresamos una excepcion de conflicto
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: `La cuenta ${email} no esta asociada a ningun usuario, Por favor regístrese.`,
      });
    }

    // Verificar si el usuario tiene un incidente
    const incidentUser = await this.incidentService.getIncidentUser(
      user.username,
    );

    // Si el usuario tiene su cuenta bloqueada
    if (incidentUser && incidentUser.isBlocked) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: `Su cuenta ha sido bloqueada temporalmente. Podrá acceder nuevamente a las ${new Date(incidentUser.blockExpiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.`,
      });
    }

    // Comparacion de contraseña para verificacion de credenciales
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    // Si no son iguales se manda, se crea una nueva incidencia
    if (!isPasswordMatching) {
      // Añadir una incidencia más por si se intenta iniciar sesión incorrectamente
      await this.incidentService.registerFailedAttempt({ email });

      // Se manda una respuesta de conflicto donde las credenciales son incorrectas
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Correo electronico o contraseña incorrecta',
      });
    }

    // Si el usuario no ha verificado su cuenta
    if (!user.verification) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message:
          'Estimado usuario, le solicitamos que verifique su cuenta para habilitar el acceso a nuestros servicios.',
      });
    }

    // Generar una sessionID
    const sessionId = uuidv4();

    // Guardamos la sesion ID
    user.updateOne({ sessionId: sessionId }).exec();

    if (user.role != Role.ADMIN)
      // Enviar email de verificación
      await this.sendEmailVerification(email);

    // Creamos el cuerpo del JWT para poder verificar despues
    const payload = { 
      session: user.sessionId, 
      role: user.role,
    };

    // Generamos el token JWT
    const token = this.jwtService.sign(payload, { expiresIn: JWT_AGE });

    // Informacion de la cookie que se envia al frontend de manera segura
    res.cookie('authentication', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: COOKIE_AGE,
      path: '/',
    });

    return {
      status: HttpStatus.ACCEPTED,
      message: `Bienvenido ${user.username}, necesitamos que verfique que es usted, se ha enviado un codigo a su correo electronico asociado`,
    };
  }

  /**
   * Metodo para cerrar la sesion de un usuario
   * @param res
   * @returns
   */
  async logOut(res: Response): Promise<void> {
    res.clearCookie('authentication');
    res.clearCookie('authenticate');
    res.clearCookie('authenticate-admin');

    res.status(HttpStatus.ACCEPTED).json({
      status: HttpStatus.ACCEPTED,
      message: 'Sesion cerrada exitosamente',
    });
  }

  async refreshAccessToken(@Req() req: Request, res: Response): Promise<any> {
    const token = req.cookies['authentication'];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Acceso Denegado',
      });
    }

    try {
      const payload = this.jwtService.verify(token); // Verifica el token existente

      // Genera un nuevo token basado en el payload del usuario
      const newToken = this.jwtService.sign(payload, { expiresIn: JWT_AGE });

      // Actualiza la cookie con el nuevo token
      res.cookie('authentication', newToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        path: '/',
        maxAge: COOKIE_AGE,
      });

      return res.status(HttpStatus.OK).json({ message: 'Token Refrescado' });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Token Invalido' });
    }
  }

  // Implementacion de olvidar se divide en
  // Enviar correo de para validar y empezar el proceso (actual)
  // TODO Arreglar el codigo OTP implementacion de guardar datos
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;

    // Buscar el usuario por su email
    const user = await this.userModel.findOne({ email });

    // Si el usuario no existe, lanzar una excepción
    if (!user) {
      throw new BadRequestException(
        'El correo no esta asociado a ninguna cuenta',
      );
    }

    // Generar el código OTP utilizando el servicio OTP
    // const otpCode = this.otpService.generateOTP();

    // Enviar el código OTP por correo al usuario
    await this.sendEmailVerification(email);

    // Guardar los cambios en la base de datos
    // await user.save();

    return {
      message:
        'Se ha enviado un código OTP a su correo para recuperar la contraseña',
    };
  }

  async reset_password(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email, password: new_password } = resetPasswordDto;

    // Buscar el usuario por su email
    const user = await this.userModel.findOne({ email });

    // Verificar si el usuario existe
    if (!user) {
      throw new BadRequestException('El correo no está registrado');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Actualizar la contraseña del usuario
    user.password = hashedPassword;

    // Limpiar los campos OTP

    await user.save();

    return { message: 'Contraseña actualizada exitosamente' };
  }

  // Cambio de contraseña
  async change_password(changePasswordDto: ChangePasswordDto) {
    const { username, password, new_password } = changePasswordDto;

    const user = await this.userModel.findOne({ username });

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      // Registrar intento fallido de cambio de contraseña
      await this.logService.logEvent(
        'CHANGE_PASSWORD_FAIL',
        `Intento fallido de cambio de contraseña: la contraseña actual es incorrecta para el usuario ${username}.`,
        user._id.toString(),
      );

      throw new BadRequestException({
        message: 'La contraseña actual es incorrecta',
        error: 'BadRequest',
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.password = hashedPassword;

    await user.save();

    // Registrar evento de cambio de contraseña exitoso
    await this.logService.logEvent(
      'CHANGE_PASSWORD_SUCCESS',
      `El usuario ${username} ha cambiado su contraseña con éxito.`,
      user._id.toString(),
    );

    return {
      status: HttpStatus.OK,
      message: 'Contraseña cambiada exitosamente',
    };
  }

  // Enviar correo de verificacion por OTP
  private async sendEmailVerification(email: string): Promise<any> {
    try {
      // Obtenemos el codigo y la expiracion del OTP
      const { otp, exp } = await this.otpService.generateOTP();

      console.log(exp);

      // Buscamos el usuario por medio del email
      const user = await this.userModel.findOne({ email }).exec();

      await user
        .updateOne({
          otpCode: otp,
          otpExpiration: new Date(Date.now() + exp * 1000),
        })
        .exec();

      // Enviamos un correo de activacion a la cuenta
      await this.emailService.sendCodeVerification(otp, email);
    } catch (error) {
      // En caso de que tengamos un error lo mostraremos
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Excepcion encontrada y controlada: Razon ${error}`,
      };
    }
  }

  // Metodo para activacion de correo
  async accountActivation(
    activationDto: ActivationDto,
  ): Promise<{ status: number; message: string }> {
    // La activacion del correo consta de obtener el email para poder activar la cuenta
    // Para esta implementacion se necesita obtener email
    // Despues se busca el email y se activa la verificacion pasando el estado a verdadero
    // Implementacion de OTP temporal por el momento solo dura (5 minutos lo ideal seria un contador
    // en tiempo real de 5 minutos)
    const { otp } = activationDto;

    // Verificamos si el codigo OTP todavia es valido
    const isValid = this.otpService.verificationOTP(otp);

    // En caso de no ser valido regresamos una excepcion de conflicto
    if (!isValid) {
      throw new ConflictException({
        message: 'El código es inválido',
        error: 'Conflict',
      });
    }

    // Buscamos por codigo otp
    const user = await this.userModel.findOne({ otpCode: otp }).exec();

    if (!user) {
      throw new BadRequestException({
        message: 'El correo no estra registrado',
        error: 'BadRequest',
      });
    }

    // Activamos verificacion
    user.verification = true;

    user.otpCode = '';

    user.otpExpiration = null;

    // Guardamos usuario
    await user.save();

    return {
      status: HttpStatus.OK,
      message: 'Se ha verificado con exito la cuenta',
    };
  }

  async verify_otp(activationDto: ActivationDto): Promise<any> {
    const { otp } = activationDto;

    const isValid = this.otpService.verificationOTP(otp);

    if (!isValid) {
      throw new ConflictException({
        message: 'El código es inválido',
        error: 'Conflict',
      });
    }

    return {
      status: HttpStatus.OK,
      message: 'Se ha verificado con exito el OTP',
    };
  }

  // Verificacion token
  async verificationAuthenticate(
    @Req() req: Request,
  ): Promise<{ message: string; authenticate: boolean; role: string }> {
    try {
      const token = req.cookies.authentication;

      const payload = this.jwtService.verify(token);

      if (!token) {
        return {
          message: 'Token no definido o no existente',
          authenticate: false,
          role: '',
        };
      }

      return {
        message: 'Autorizacion vigente',
        authenticate: true,
        role: payload.role,
      };
    } catch (err) {
      return {
        message: 'Token expirado o inexistente',
        authenticate: false,
        role: '',
      };
    }
  }

  // Revocacion de cookies (session)
  private async revokeSessions(userId: string): Promise<any> {
    await this.userModel.updateOne(
      { _id: userId },
      { $unset: { sessionId: '' } },
    );
    return { message: 'Todas las sesiones han sido revocadas.' };
  }
}
