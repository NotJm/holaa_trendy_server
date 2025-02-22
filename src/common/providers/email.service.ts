import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { formattedDate } from '../utils/formatted-date';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter = this.generateTranasporter();

  constructor(private readonly configService: ConfigService) {}

  private generateTranasporter(): Transporter {
    return createTransport(this.generateTransporterOptions());
  }

  private generateTransporterOptions(): SMTPTransport.Options {
    return {
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    };
  }

  async sendActivationLink(email: string, token: string, expiresAt: Date): Promise<void> {
    const activationLink = `http://${this.configService.get<string>('HOSTNAME')}:${this.configService.get<number>('PORT')}/auth/activate/${token}`;

    return await this.transporter.sendMail({
      to: email,
      subject: 'Activación de Cuenta - HOLAA Trendy',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Activación de Cuenta - HOLAA Trendy</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
                <tr>
                    <td style="background-color: #0A1B39; padding: 20px; text-align: center;">
                        <img src="https://via.placeholder.com/150x50.png?text=HOLAA+Trendy" alt="HOLAA Trendy Logo" style="max-width: 150px;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 20px;">
                        <h1 style="color: #0A1B39; margin-bottom: 20px; text-align: center;">¡Bienvenido a <span style="color: #00CFFF;">HOLAA</span><sub>Trendy</sub>!</h1>
                        <p style="color: #333; font-size: 16px; line-height: 1.5;">Estimado usuario,</p>
                        <p style="color: #333; font-size: 16px; line-height: 1.5;">Gracias por registrarte en <strong>HOLAA Trendy</strong>. Para completar la activación de tu cuenta, por favor haz clic en el siguiente botón:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${activationLink}" style="
                                display: inline-block;
                                background-color: #00CFFF;
                                color: #ffffff;
                                padding: 15px 30px;
                                border-radius: 25px;
                                font-size: 18px;
                                font-weight: bold;
                                text-decoration: none;
                                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                            ">
                                Activar mi cuenta
                            </a>
                        </div>
                        <p style="color: #555; font-size: 14px; text-align: center;">
                            <strong>Este enlace es válido hasta:</strong><br>
                            <span style="font-size: 16px; font-weight: bold; color: #0A1B39;">${formattedDate(expiresAt)}</span>
                        </p>
                        <p style="color: #555; font-size: 14px; text-align: center;">Por favor, activa tu cuenta antes de que expire el enlace.</p>
                        <p style="color: #555; font-size: 14px; text-align: center;">Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                        <p style="color: #0A1B39; font-size: 14px; text-align: center; word-break: break-all;">
                            <a href="${activationLink}" style="color: #00CFFF;">${activationLink}</a>
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #333; font-size: 16px; line-height: 1.5;">Si no has solicitado esta cuenta, por favor ignora este correo.</p>
                        <p style="color: #333; font-size: 16px; line-height: 1.5;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                        <p style="color: #333; font-size: 16px; line-height: 1.5;">Atentamente,<br><strong>El equipo de HOLAA Trendy</strong></p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                        <p style="color: #666; font-size: 14px; margin-bottom: 10px;">Síguenos en nuestras redes sociales:</p>
                        <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://via.placeholder.com/30x30.png?text=FB" alt="Facebook" style="width: 30px; height: 30px;"></a>
                        <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://via.placeholder.com/30x30.png?text=IG" alt="Instagram" style="width: 30px; height: 30px;"></a>
                        <a href="#" style="display: inline-block; margin: 0 10px;"><img src="https://via.placeholder.com/30x30.png?text=TW" alt="Twitter" style="width: 30px; height: 30px;"></a>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #0A1B39; color: #ffffff; padding: 20px; text-align: center; font-size: 12px;">
                        <p>&copy; 2025 HOLAA Trendy. Todos los derechos reservados.</p>
                        <p><a href="#" style="color: #00CFFF; text-decoration: none;">Política de Privacidad</a> | <a href="#" style="color: #00CFFF; text-decoration: none;">Términos de Servicio</a></p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    });
  }

  async sendCodeMFA(email: string, otp: string, exp: Date) {
    await this.transporter.sendMail({
      to: email,
      subject: 'Verificación de Código OTP - HOLAA Trendy',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
            <!-- Encabezado del correo -->
            <div style="background-color: #0A1B39; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
                <h2>¡Bienvenido a <strong>HOLAA<sub>Trendy</sub></strong>!</h2>
            </div>
            <!-- Cuerpo del correo -->
            <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; color: #333;">
                <p>Estimado usuario,</p>
                <p style="font-size: 16px;">¡Gracias por unirte a <strong>HOLAA Trendy</strong>! Por favor, utiliza el siguiente código OTP para verificar tu identidad:</p>
                <!-- Código OTP -->
                <p style="text-align: center; margin: 20px 0;">
                    <span style="
                        display: inline-block;
                        background-color: #00CFFF;
                        color: white;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 24px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    ">
                        ${otp}
                    </span>
                </p>
                <!-- Fecha de expiración -->
                <p style="font-size: 14px; color: #555; text-align: center;">
                    <strong>Este código es válido hasta:</strong><br>
                    <span style="font-size: 16px; font-weight: bold;">${formattedDate(exp)}</span>
                </p>
                <p style="font-size: 14px; color: #555;">Por favor, asegúrate de usar el código antes de que expire.</p>
                <p>Atentamente,</p>
                <p><strong>El equipo de HOLAA Trendy</strong></p>
            </div>
        </div>
        `,
    });
  }
}
