import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { HbsService } from './hbs.service';
import { formattedDateInMinutes } from '../utils/formatted-date-in-minutes';
import { generateLink } from '../utils/generate-link';
@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly hbsService: HbsService,
  ) {
    this.transporter = this.generateTranasporter();
  }

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

  private async loadTemplate(templateName: string, data: any): Promise<string> {
    return await this.hbsService.compile(templateName, data);
  }

  async sendActivationLink(
    username: string,
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    const activationLink = generateLink(
      this.configService,
      '/auth/signup/success/:token',
      { token: token}
    );

    const expirationInMinutes = formattedDateInMinutes(expiresAt);

    const template = await this.loadTemplate('activation-link.hbs', {
      username: username,
      activationLink: activationLink,
      expirationMinutes: expirationInMinutes,
    });

    return await this.transporter.sendMail({
      to: email,
      subject: 'Activación de Cuenta - HOLAA Trendy',
      html: template,
    });
  }

  async sendCodeMFA(
    username: string,
    email: string,
    otp: string,
    expiresAt: Date,
  ): Promise<void> {
    const expirationInMinutes = formattedDateInMinutes(expiresAt);

    const template = await this.loadTemplate('code-mfa.hbs', {
      username: username,
      otpCode: otp,
      expirationMinutes: expirationInMinutes,
    });

    return await this.transporter.sendMail({
      to: email,
      subject: 'Verificación de Código OTP - HOLAA Trendy',
      html: template,
    });
  }

  async sendVerificationLink(
    username: string,
    email: string,
    token: string,
    expiresAt: Date,
  ) {
    const verificationLink = generateLink(
      this.configService,
      'auth/login/:step/:token',
      { step: 'success', token: token },
    );
    const expirationInMinutes = formattedDateInMinutes(expiresAt);

    const template = await this.loadTemplate('verification-link.hbs', {
      username: username,
      verificationLink: verificationLink,
      expirationMinutes: expirationInMinutes,
    });

    return await this.transporter.sendMail({
      to: email,
      subject: 'Verificación de Cuenta - HOLAA Trendy',
      html: template,
    });
  }

  async sendRecoveryPasswordLink(
    username: string,
    email: string,
    expiresAt: Date,
  ) {
    const recoverLink = generateLink(
      this.configService,
      'auth/request-forgot-password/:step',
      { step: 'reset-password' },
    );
    const expirationInMinutes = formattedDateInMinutes(expiresAt);

    const template = await this.loadTemplate('recover-link.hbs', {
      username: username,
      resetPasswordLink: recoverLink,
      expirationMinutes: expirationInMinutes,
    });

    return await this.transporter.sendMail({
      to: email,
      subject: 'Recuperación de Contraseña - HOLAA Trendy',
      html: template,
    });
  }
}
