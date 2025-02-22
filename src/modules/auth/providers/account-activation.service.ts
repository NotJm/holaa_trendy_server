import { Injectable } from '@nestjs/common';
import { EmailService } from '../../../common/providers/email.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ActivationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Sends an email containing account activation information to the user.
   * @param email The email address of the user
   * @returns A promise that resolves when the email is sent successfully
   */
  async send(email: string, token: string, expiresAt: Date): Promise<void> {
    return await this.emailService.sendActivationLink(email, token, expiresAt);
  }

  /**
   * Activates the user account through the user's unique identification
   * @param userId The user's unique identification
   */
  async activate(userId: string): Promise<void> {
    this.usersService.updateUser(userId, {
      isActivated: true,
    });
  }
}
