import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { LoggerApp } from '../logger/logger.service';

@Injectable()
export class TwilioService {
  #client: Twilio;

  private readonly AUTH_TOKEN: string =
    this.configService.get<string>('TWILIO_AUTH_TOKEN');
  private readonly ACCOUNT_SID: string =
    this.configService.get<string>('TWILIO_ACCOUNT_SID');
  private readonly VERIFY_SERVICE_SID: string = this.configService.get<string>(
    'TWILIO_VERIFY_SERVICE_SID',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerApp: LoggerApp,
  ) {
    this.#client = new Twilio(this.ACCOUNT_SID, this.AUTH_TOKEN);
  }

  async send(to: string): Promise<VerificationInstance> {
    try {
      return await this.#client.verify.v2
        .services(this.VERIFY_SERVICE_SID)
        .verifications.create({ to, channel: 'sms' });
    } catch (error) {
      this.loggerApp.error(
        'Error al enviar el codigo de verificacion',
        error.stack || null,
        'Twilio',
      );
      throw new Error('Error al enviar el codigo de verificacion');
    }
  }

  async verify(
    to: string,
    code: string,
  ): Promise<VerificationCheckInstance> {
    try {
      return await this.#client.verify.v2
        .services(this.VERIFY_SERVICE_SID)
        .verificationChecks.create({ to, code });
    } catch (error) {
      this.loggerApp.error(
        'Error al verificar el codigo de verificacion',
        error.stack || null,
        'Twilio',
      );
      throw new Error('Error al verificar el codigo de verificacion');
    }
  }
}
