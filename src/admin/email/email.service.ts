import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmailConfiguration,
  EmailConfiguraionDocument,
} from './schemas/email.config.schema';
import { Model } from 'mongoose';
import { UpdateEmailConfigurationDto } from './dto/configuration.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OtpService } from '../../common/providers/otp.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter;
  private configuration: EmailConfiguraionDocument;

  constructor(
    @InjectModel(EmailConfiguration.name)
    private readonly email_configuration_model: Model<EmailConfiguraionDocument>,
    private readonly config_service: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config_service.get<string>('EMAIL_USERNAME'),
        pass: this.config_service.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async onModuleInit() {
    await this.createDefaultConfiguration();
  }

  async createDefaultConfiguration(): Promise<void> {
    const existsEmailConfiguration = await this.email_configuration_model
      .findOne()
      .exec();

    if (!existsEmailConfiguration) {
      const defaultConfiguration = new this.email_configuration_model();
      await defaultConfiguration.save();
    }
  }

  async getEmailConfigurattion(): Promise<EmailConfiguraionDocument> {
    return this.email_configuration_model.findOne().exec();
  }

  async updateEmailConfiguration(
    id: string,
    updateEmailConfigurationDto: UpdateEmailConfigurationDto,
  ): Promise<{ state: boolean; message: string }> {
    const emailConfiguration = await this.email_configuration_model
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

  async send_code_verification(email: string, otp: any, exp: Date) {
    

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
                ${otp}
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
