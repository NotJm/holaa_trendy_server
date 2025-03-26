import { Injectable } from '@nestjs/common';
import { TwilioService } from '../../../common/microservice/twilio.service';
import { SessionService } from './session.service';
import { UsersService } from '../../users/users.service';
import { Response } from 'express';

@Injectable()
export class SMSVerificationService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
  ) {}

  async send(phone: string): Promise<void> {
    await this.twilioService.send(phone);
  }

  async verify(phone: string, code: string, res: Response): Promise<void> {
    const user = await this.usersService.findUserByPhone(phone);

    const sessionId = await this.sessionService.generateTemporarySession(user.id);

    this.sessionService.send(sessionId, res);

    await this.twilioService.verify(phone, code);
  }
}
