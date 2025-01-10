import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { formattedDate } from '../../shared/utils/formatted-date';

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

  async sendCodeAccountActivation(email: string, otp: string, exp: Date) {
    await this.transporter.sendMail({
      to: email,
      subject: 'Activación de Cuenta - HOLAA Trendy',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
            <!-- Encabezado del correo -->
            <div style="background-color: #0A1B39; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
                <h2>¡Bienvenido a <strong>HOLAA<sub>Trendy</sub></strong>!</h2>
            </div>
            <!-- Cuerpo del correo -->
            <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; color: #333;">
                <p>Estimado usuario,</p>
                <p style="font-size: 16px;">Gracias por registrarte en <strong>HOLAA Trendy</strong>! Para completar la activación de tu cuenta, por favor utiliza el siguiente código OTP:</p>
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
                <p style="font-size: 14px; color: #555;">Por favor, utiliza el código antes de que expire.</p>
                <p>Atentamente,</p>
                <p><strong>El equipo de HOLAA Trendy</strong></p>
            </div>
        </div>
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
