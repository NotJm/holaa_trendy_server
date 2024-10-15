import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SendEmailVerificationDto, VerifyEmailDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { IncidentService } from '../incident/incident.service';
import { EmailService } from '../services/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private incidentService: IncidentService,
    private emailService: EmailService
  ) {}

  // TODO: Registro de usuario, hasheo de contraseña
  async register(userData: User): Promise<any> {
    const { username, password, email } = userData;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      // TODO: Hasheando contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new this.userModel({
        username: username,
        password: hashedPassword,
        email: email,
      });

      // TODO: Enviar email con verificacion de cuenta
      this.send_email_verification({ email });

      // TODO: Guardar usuario
      await newUser.save();

      return { message: 'Gracias por registrarse, hemos enviado un link de activacion de cuenta su correo' };
    } else {
      return { message: 'El usuario ya se encuentra registrado' };
    }
  }

  // TODO: Login de usuario
  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
  
    const user = await this.userModel.findOne({ username });

    if (!user) {
      return { message: `El usuario ${username} no esta registrado, Por favor registrese`}
    }

    const userIncident = await this.incidentService.usernameIsBlocked({ username });
    
    if (userIncident && userIncident.isBlocked) {
      return { 
        message: `Su cuenta ha sido bloqueada temporalmente. Podrá acceder nuevamente a las ${new Date(userIncident.blockExpiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.` 
      }
      
    }

    if (!user.emailIsVerify) {
      return {
        message: "Estimado usuario, le solicitamos que verifique su cuenta para habilitar el acceso a nuestros servicios."
      }
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (isPasswordMatching) {
      const payload = { username: user.username, sub: user.id };

      const token = this.jwtService.sign(payload);

      return { message: 'Sesion Iniciada Exitosamente', access_token: token };
    } else {
      // TODO: Modulo de Incidencias mas 5 intentos bloquear cuenta
      await this.incidentService.loginFailedAttempt(username);
      return { message: 'Credenciales Incorrectas' };
    }
  }

  // TODO: Olvidar Contraseña
  async forgot_password(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      return { messsage: "El correo no estra registrado" };
    }

    const restToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '1h' },
    );

    await this.emailService.sendPasswordResetEmail(email, restToken);

    return { message: 'Se ha enviado un correo con el enlace de recuperación'};
  }

  // TODO: Restablecer la contraseña
  async reset_password(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, new_password } = resetPasswordDto;

    try {
      const decoded = this.jwtService.verify(token);

      console.log(decoded);

      // TODO: Buscar el usuario en base al token decodificado
      const user = await this.userModel.findById(decoded.id);

      console.log(user);

      if (!user) {
        return { message: 'Token invalido o expirado' };
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      user.password = hashedPassword;

      await user.save();

      return { message: 'Contraseña actualiza exitosamente' };
    } catch (err) {
      throw new BadRequestException('Token invalido o expirado');
    }
  }

  async send_email_verification(sendEmailVerificationDto: SendEmailVerificationDto): Promise<any> {
    const { email } = sendEmailVerificationDto;

    await this.emailService.sendEmailVerification(email);

    return { message: "Se ha enviado un correo de verificacion" }
  }

  async verify_email(verifyEmailDto: VerifyEmailDto): Promise<any> {
    const { email } = verifyEmailDto;

    const user = await this.userModel.findOne({ email });

    user.emailIsVerify = true;

    await user.save();

    return { message: "La cuenta a sido verificada con exito "}

  }

}
