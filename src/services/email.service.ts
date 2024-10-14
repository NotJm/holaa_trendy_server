import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    console.log(this.configService.get<string>('EMAIL_USERNAME'));
    console.log(this.configService.get<string>('EMAIL_PASSWORD'));
    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // Ejemplo usando Gmail
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD')
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const url = `http://localhost:3000reset-password?token=${resetToken}`;
    await this.transporter.sendMail({
      to,
      subject: 'Restablecimiento de contraseña',
      html: `Haga clic <a href="${url}">aquí</a> para restablecer su contraseña`,
    });
  }
}
