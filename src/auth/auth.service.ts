import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { IncidentService } from '../incident/incident.service';
import { EmailService } from '../services/email.service';
import { PwnedService } from '../services/pwned.service';
import { ZxcvbnService } from '../services/zxcvbn.service';
import { randomBytes } from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  private generateSessionID(): string {
    return randomBytes(32).toString('hex');
  }

  private generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private incidentService: IncidentService,
    private emailService: EmailService,
    private pwnedservice: PwnedService,
    private zxcvbnService: ZxcvbnService,
  ) {}

  // TODO: Registro de usuario, hasheo de contraseña
  async register(registerDto: RegisterDto): Promise<any> {
    const { sessionId, username, password, email } = registerDto;

    const user = await this.userModel.findOne({ email, username });

    // En caso de que el usuario exista se manda una excepcion de conflicto
    if (user) {
      throw new ConflictException({
        message: `El usuario '${user.username}' ya se encuentra registrado`,
        error: 'Conflict',
      });
    }

    // Verificar si la contraseña es debil
    const zxcvbn = this.zxcvbnService.validatePassword(password);

    if (zxcvbn) {
      throw new BadRequestException('Contraseña debil');
    }

    // Verificar si la contraseña comprometida
    const timesCommitted =
      await this.pwnedservice.verificationPassword(password);

    if (timesCommitted > 0) {
      throw new BadRequestException(
        `La contraseña ya fue comprometida ${timesCommitted} veces`,
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear esquema para la base de datos
    const newUser = new this.userModel({
      sessionID: sessionId,
      username: username,
      password: hashedPassword,
      email: email,
    });

    // Enviar email de verificacion
    await this.send_email_verification(email);

    // Guardar usuario
    await newUser.save();

    return {
      status: HttpStatus.OK,
      message:
        'Gracias por registrarse, hemos enviado un link de activacion de cuenta a su correo',
    };
  }

  // TODO: Login de usuario
  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    // Generar una sessionID
    const sessionId = this.generateSessionID();

    // Primero nos aseguramos que si existe la el usuario
    const user = await this.userModel.findOne({ username });

    // Si el usuario no se encuentra registrado
    if (!user) {
      throw new ConflictException(
        `El usuario ${username} no esta registrado, Por favor registrese`,
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
      // Añadir una incidencia mas por si se intenga loguear mal
      await this.incidentService.loginFailedAttempt(username);

      throw new ConflictException('Credenciales Incorrectas');
    }

    user.sessionId = sessionId;

    await user.save();

    const payload = { username: user.username, sub: user.id };

    const token = this.jwtService.sign(payload);

    return {
      status: HttpStatus.OK,
      message: 'Sesion Iniciada Exitosamente',
      token: token,
    };
  }

  // TODO: Cerrar Sesion
  async logout(userId: string): Promise<any> {
    await this.revokeSessions(userId);

    return {
      status: HttpStatus.OK,
      message: 'Sesion Cerrada Exitosamente',
    };
  }

  // TODO: Olvidar Contraseña
  async forgot_password(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('El correo no estra registrado');
    }

    const restToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '1h' },
    );

    await this.emailService.sendPasswordResetEmail(email, restToken);

    return { message: 'Se ha enviado un correo con el enlace de recuperación' };
  }

  // TODO: Restablecer la contraseña
  async reset_password(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, new_password } = resetPasswordDto;

    try {
      const decoded = this.jwtService.verify(token);

      // TODO: Buscar el usuario en base al token decodificado
      const user = await this.userModel.findById(decoded.id);

      if (!user) {
        throw new BadRequestException('Token invalido o expirado');
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      user.password = hashedPassword;

      await user.save();

      await this.revokeSessions(user.id);

      return { message: 'Contraseña actualiza exitosamente' };
    } catch (err) {
      throw new BadRequestException('Token invalido o expirado');
    }
  }

  // Enviar correo de verificacion por OTP
  private async send_email_verification(email: string): Promise<any> {
    const otpCode = this.generateOTPCode();

    await this.emailService.send_code_verfication(otpCode, email);

    return {
      status: HttpStatus.OK,
      message: 'Se ha enviado a su correo un link de activacion',
    };
  }

  // TODO: Verificacion de Email
  async verify_email(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.userModel.findOne({ email: decoded.email });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      user.emailIsVerify = true;

      await user.save();

      return {
        status: HttpStatus.OK,
        message: 'Correo verificado exitosamente',
      };
    } catch (err) {
      throw new ForbiddenException('Token invalido o expirado');
    }
  }

  // TODO: Revocacion de cookies (session)
  private async revokeSessions(userId: string): Promise<any> {
    await this.userModel.updateOne(
      { _id: userId },
      { $unset: { sessionId: '' } },
    );
    return { message: 'Todas las sesiones han sido revocadas.' };
  }
}
