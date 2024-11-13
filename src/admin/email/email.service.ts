import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmailConfiguration,
  EmailConfiguraionDocument,
} from './schemas/email.config.schema';
import { Model } from 'mongoose';
import { UpdateEmailConfigurationDto } from './dto/configuration.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  
  private transporter;
  private configuration: EmailConfiguraionDocument;

  async onModuleInit() {
    await this.createDefaultConfiguration();
    
  }

  constructor(
    @InjectModel(EmailConfiguration.name)
    private readonly emailConfiguraionModel: Model<EmailConfiguraionDocument>,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async createDefaultConfiguration(): Promise<void> {
    const existsEmailConfiguration = await this.emailConfiguraionModel
      .findOne()
      .exec();

    if (!existsEmailConfiguration) {
      const defaultConfiguration = new this.emailConfiguraionModel();
      await defaultConfiguration.save();
    }
  }

  async getEmailConfigurattion(): Promise<EmailConfiguraionDocument> {
    return this.emailConfiguraionModel.findOne().exec();
  }

  async updateEmailConfiguration(
    id: string,
    updateEmailConfigurationDto: UpdateEmailConfigurationDto,
  ): Promise<{ state: boolean; message: string }> {
    const emailConfiguration = await this.emailConfiguraionModel
      .findById(id)
      .exec();

    if (!emailConfiguration) {
      throw new NotFoundException(
        `La configuracion con la ID ${id} no ha sido encontrada`,
      );
    }

    await emailConfiguration.updateOne(updateEmailConfigurationDto).exec();

    return {
      state: true,
      message: 'Configuracion actualizada con exito',
    };
  }

  // Enviar codigo de verificacion para activar cuenta
  async sendCodeVerification(otpCode: string, email: string) {
    // Implementacion de logica para poder integrar personalizacion de mensajes de email
    // Primeramente deberia poder integrar ciertos elementos en variables para poder personalizarla
    // Esto totalmente conectado a mongo, en este caso se crearia un coleccion nueva
    // Sin embargo deberia dividirla porque son diferentes mensajes con diferentes definiciones

    this.configuration = await this.getEmailConfigurattion();

    await this.transporter.sendMail({
      to: email,
      subject: this.configuration.title,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
          <div style="background-color: #0A1B39; padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h2>¡Bienvenido a <strong>HOLAA<sub>Trendy</sub></strong>!</h2>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; color: #333;">
            <p>Estimado usuario,</p>
            <p style="font-size: 16px;">¡Gracias por estar con nosotros <strong>HOLAA</strong>! Necesitamos que verifique el codigo OTP.</p>
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
            <p style="font-size: 14px;">${this.configuration.content}</p>
            <p>Atentamente,</p>
            <p><strong>${this.configuration.footer}</strong></p>
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

    this.configuration = await this.getEmailConfigurattion();

    await this.transporter.sendMail({
      to: email,
      subject: this.configuration.title,
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
            <p style="font-size: 14px;">${this.configuration.content}.</p>
            <p>Atentamente,</p>
            <p><strong>${this.configuration.footer}</strong></p>
          </div>
        </div>
      `,
    });
  }
}
