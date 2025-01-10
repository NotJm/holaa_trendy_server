import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SMSService {
  constructor(private readonly configService: ConfigService) {}

  async send(phoneNumber: string, message: string): Promise<void> {
    const client = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );

    try {
      const smsResponse = await client.messages.create({
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: `${phoneNumber}`,
        body: message,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de enviar un mensaje de texto: ${err.message}`,
      );
    }
  }
}
