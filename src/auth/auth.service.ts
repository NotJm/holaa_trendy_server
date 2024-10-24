import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/restauration.dto';
import { EmailService } from './service/email.service';
import { PwnedService } from './service/pwned.service';
import { ZxcvbnService } from './service/zxcvbn.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from './service/otp.service';
import { ActivationDto, ActivationDto2 } from './dto/activation.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { LogService } from '../common/services/log.service'; // Asegúrate de importar LogService
import { IncidentService } from '../admin/incident/incident.service';
import { Request, Response } from 'express';
import { COOKIE_AGE } from '../common/constants/enviroment.contants';

@Injectable()
export class AuthService {
  private generateSessionID(): string {
    return uuidv4();
  }

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private incidentService: IncidentService,
    private emailService: EmailService,
    private pwnedservice: PwnedService,
    private zxcvbnService: ZxcvbnService,
    private otpService: OtpService,
    private logService: LogService,
  ) {}

  // Registro de usuario, hasheo de contraseña
  async signIn(registerDto: RegisterDto): Promise<any> {
    const { username, password, email } = registerDto;

    const user = await this.userModel.findOne({ email, username });

    // En caso de que el usuario exista se manda una excepción de conflicto
    if (user) {
      // Registrar evento de intento fallido de registro
      await this.logService.logEvent(
        'REGISTER_FAIL',
        `Intento de registro fallido: el usuario ${username} ya existe.`,
        user._id.toString(),
      );

      throw new ConflictException({
        message: `El usuario '${user.username}' ya se encuentra registrado`,
        error: 'Conflict',
      });
    }

    // Verificar si la contraseña es débil
    const zxcvbn = this.zxcvbnService.validatePassword(password);

    if (zxcvbn) {
      throw new BadRequestException({
        message: 'La contraseña ingresada, es débil',
        error: 'BadRequest',
      });
    }

    // Verificar si la contraseña está comprometida
    const timesCommitted =
      await this.pwnedservice.verificationPassword(password);

    if (timesCommitted > 0) {
      throw new BadRequestException({
        message: `La contraseña ya fue comprometida ${timesCommitted} veces`,
        error: 'BadRequest',
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear esquema para la base de datos
    const newUser = new this.userModel({
      username: username,
      password: hashedPassword,
      email: email,
      permissions: ['change_password'],
    });

    // Enviar email de verificación
    await this.send_email_verification(email);

    // Guardar usuario
    await newUser.save();

    // Registrar evento de registro exitoso
    await this.logService.logEvent(
      'REGISTER_SUCCESS',
      `El usuario ${username} se ha registrado con éxito.`,
      newUser._id.toString(),
    );

    return {
      status: HttpStatus.OK,
      message:
        'Gracias por registrarse, hemos enviado un link de activación de cuenta a su correo',
    };
  }

  // Manejo de login del usuario
  async logIn(loginDto: LoginDto, @Res() res: Response): Promise<any> {
    // Obtenemos los datos importantes
    const { username, password } = loginDto;

    // Generar una sessionID
    const sessionId = this.generateSessionID();

    // Primero nos aseguramos de que existe el usuario
    const user = await this.userModel.findOne({ username });

    // Si el usuario no se encuentra registrado
    if (!user) {
      // Registrar evento de intento de inicio de sesión con usuario inexistente
      await this.logService.logEvent(
        'LOGIN_FAIL',
        `Intento de inicio de sesión fallido: el usuario ${username} no está registrado.`,
        username,
      );

      throw new ConflictException(
        `El usuario ${username} no está registrado, Por favor regístrese.`,
      );
    }

    // Si el usuario no ha verificado su cuenta
    if (!user.emailIsVerify) {
      throw new ForbiddenException(
        'Estimado usuario, le solicitamos que verifique su cuenta para habilitar el acceso a nuestros servicios.',
      );
    }

    // Verificar si el usuario tiene un incidente
    const userIncident = await this.incidentService.usernameIsBlocked({
      username,
    });

    // Si el usuario tiene su cuenta bloqueada
    if (userIncident && userIncident.isBlocked) {
      throw new ForbiddenException(
        `Su cuenta ha sido bloqueada temporalmente. Podrá acceder nuevamente a las ${new Date(userIncident.blockExpiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.`,
      );
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      // Registrar evento de intento fallido de inicio de sesión por contraseña incorrecta
      await this.logService.logEvent(
        'LOGIN_FAIL',
        `Intento de inicio de sesión fallido: contraseña incorrecta para el usuario ${username}.`,
        user._id.toString(),
      );

      // Añadir una incidencia más por si se intenta iniciar sesión incorrectamente
      await this.incidentService.loginFailedAttempt(username);

      throw new ConflictException('Credenciales incorrectas');
    }

    user.sessionId = sessionId;

    await user.save();

    const payload = {
      sessionId: sessionId,
      user: user,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Registrar evento de inicio de sesión exitoso
    await this.logService.logEvent(
      'LOGIN_SUCCESS',
      `El usuario ${username} ha iniciado sesión con éxito.`,
      user._id.toString(),
    );

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: COOKIE_AGE,
      path: '/',
    });

    return {
      status: HttpStatus.OK,
      message: 'Sesión iniciada exitosamente',
    };
  }

  async refreshAccessToken(token: string) {
    try {
      const decode = this.jwtService.verify(token);

      const user = await this.userModel.findById(decode.sub);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const payload = {
        username: user.username,
        sub: user.id,
      };

      const new_token = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return {
        status: HttpStatus.OK,
        message: 'Token refrescado con exito',
        token: new_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Olvidar Contraseña
  async forgot_password(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;

    // Buscar el usuario por su email
    const user = await this.userModel.findOne({ email });

    // Si el usuario no existe, lanzar una excepción
    if (!user) {
      throw new BadRequestException('El correo no está registrado');
    }

    // Generar el código OTP utilizando el servicio OTP
    const otpCode = this.otpService.generateOTP();

    // Enviar el código OTP por correo al usuario
    await this.emailService.send_code_password(otpCode, email);

    // Guardar los cambios en la base de datos
    await user.save();

    return {
      message:
        'Se ha enviado un código OTP a su correo para recuperar la contraseña',
    };
  }

  async reset_password(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email, new_password } = resetPasswordDto;

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
  private async send_email_verification(email: string): Promise<any> {
    const otpCode = this.otpService.generateOTP();

    await this.emailService.send_code_verfication(otpCode, email);

    return {
      status: HttpStatus.OK,
      message: 'Se ha enviado a su correo un link de activacion',
    };
  }

  // Verificacion de Email
  async verify_email(activationDto: ActivationDto): Promise<any> {
    const { email, otp } = activationDto;

    const isValid = this.otpService.verifyOTP(otp);

    if (!isValid) {
      throw new ConflictException({
        message: 'El código es inválido',
        error: 'Conflict',
      });
    }

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException({
        message: 'El correo no estra registrado',
        error: 'BadRequest',
      });
    }

    user.emailIsVerify = true;

    await user.save();

    return {
      status: HttpStatus.OK,
      message: 'Se ha verificado con exito la cuenta',
    };
  }

  async verify_otp(activationDto: ActivationDto2): Promise<any> {
    const { otp } = activationDto;

    const isValid = this.otpService.verifyOTP(otp);

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
  async verify_token(@Req() req: Request) {
    const token = req.cookies['token'];

    console.log('cookies ', req.cookies);

    console.log('token ', token);

    if (!token) {
      return {
        message: 'Autorizacion no vigente',
        authenticate: false,
      };
    }

    return {
      message: 'Autorizacion vigente',
      authenticate: true,
    };
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
