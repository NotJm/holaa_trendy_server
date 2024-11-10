import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    // La implementacion de este metodo es dudosa todavia esta cuestion si es correcto 
    const url = `http://localhost:3000/reset_password?token=${resetToken}`;
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

  // Enviar codigo de verificacion para activar cuenta
  async sendCodeVerification(otpCode: string, email: string) {
    // Implementacion de logica para poder integrar personalizacion de mensajes de email
    // Primeramente deberia poder integrar ciertos elementos en variables para poder personalizarla
    // Esto totalmente conectado a mongo, en este caso se crearia un coleccion nueva
    // Sin embargo deberia dividirla porque son diferentes mensajes con diferentes definiciones
    await this.transporter.sendMail({
      to: email,
      subject: 'Verificación de Cuenta - HOLAA-Trendy',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
          <div style="background-color: #0A1B39; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h2>¡Bienvenido a <strong>HOLAA<sub>Trendy</sub></strong>!</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; color: #333;">
            <p>Estimado usuario,</p>
            <p style="font-size: 16px;">¡Gracias por registrarse en <strong>HOLAA</strong>! Para completar su registro, necesitamos que verifique su dirección de correo electrónico.</p>
            <p style="text-align: center;">
              <span style="
                display: inline-block;
                background-color: #00CFFF;
                color: white;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 20px;
                font-weight: bold;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease, transform 0.3s ease;
              ">
                ${otpCode}
              </span>
            </p>
            <p style="font-size: 14px;">Si no realizó esta solicitud, puede ignorar este mensaje.</p>
            <p>Atentamente,</p>
            <p><strong>El equipo de HOLAA-Trendy</strong></p>
          </div>
        </div>
      `,
    });
  }

  async sendCodePassword(otpCode: string, email: string) {
    // La implementacion para poder resetear contraseña deberia ser la siguiente
    // Usuario no recuerda su contraseña -> Da click a olvidar contraseña
    // Usuario debe poner su email para poder continuar con su recuperacion
    // Usuario recibe email con codigo otp para poder restablecer su contraseña
    // Se deberia personalizar cada mensaje de email por separado?
    await this.transporter.sendMail({
      to: email,
      subject: '🔒 Recuperación de Contraseña - HOLAA-Trendy',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
          <div style="background-color: #0A1B39; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h2>Solicitud de Recuperación de Contraseña</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; color: #333;">
            <p>Estimado usuario,</p>
            <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer su contraseña en <strong>HOLAA</strong>.</p>
            <p>Por favor, use el siguiente código OTP para completar el proceso de recuperación de su contraseña:</p>
            <p style="text-align: center;">
              <span style="
                display: inline-block;
                background-color: #00CFFF;
                color: white;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 20px;
                font-weight: bold;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease, transform 0.3s ease;
              ">
                ${otpCode}
              </span>
            </p>
            <p style="font-size: 14px;">Si no realizó esta solicitud, puede ignorar este mensaje.</p>
            <p>Atentamente,</p>
            <p><strong>El equipo de HOLAA-Trendy</strong></p>
          </div>
        </div>
      `,
    });
  }
}
