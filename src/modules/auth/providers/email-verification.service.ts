import { Injectable } from "@nestjs/common";
import { EmailService } from '../../../common/providers/email.service';

@Injectable()
export class EmailVerificationService {

  constructor(
    private readonly emailService: EmailService,
  ) {}

  async send(username: string, email: string, expiresAt: Date, token?: string, isVerificationLink: boolean = true): Promise<void> {

    if (isVerificationLink) {
      return await this.emailService.sendVerificationLink(username, email, token, expiresAt);
    }

    return await this.emailService.sendRecoveryPasswordLink(username, email, expiresAt);
  }

}
