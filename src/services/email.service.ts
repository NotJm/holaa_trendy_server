import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Ejemplo usando Gmail
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const url = `http://localhost:3000reset_password?token=${resetToken}`;
    await this.transporter.sendMail({
      to,
      subject: '🔒 Restablecimiento de Contraseña - HOLAA',
      html: `
        <p>Estimado usuario,</p>
        <p>Hemos recibido una solicitud para restablecer su contraseña. Si no realizó esta solicitud, puede ignorar este mensaje.</p>
        <p>Para restablecer su contraseña, haga clic en el siguiente enlace:</p>
        <a href="${url}" style="color: #4CAF50;">Restablecer Contraseña</a>
        <p>Este enlace es válido por 30 minutos.</p>
        <p>Atentamente,</p>
        <p><strong>El equipo de HOLAA</strong></p>
      `,
    });
  }

  async sendEmailVerification(email: string) {
    const url = `http://localhost:3000verify_email?email=${email}`;
    await this.transporter.sendMail({
      to: email,
      subject: '📧 Verificación de Cuenta - HOLAA',
      html: `
        <p>Estimado usuario,</p>
        <p>¡Gracias por registrarse en <strong>HOLAA</strong>! Para completar su registro, necesitamos que verifique su dirección de correo electrónico.</p>
        <p>Haga clic en el siguiente enlace para verificar su cuenta:</p>
        <a href="${url}" style="color: #4CAF50;">Verificar Cuenta</a>
        <p>Si no realizó esta solicitud, puede ignorar este mensaje.</p>
        <p>Atentamente,</p>
        <p><strong>El equipo de HOLAA</strong></p>
      `,
    });
  }

  async sendOTPCode(to:string ) {

  }
}
