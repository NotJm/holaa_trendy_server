import { ConflictException, Injectable } from '@nestjs/common';
import { LoggerApp } from '../../../common/logger/logger.service';
import { RedisService } from '../../../common/microservice/redis.service';
import { EmailService } from '../../../common/providers/email.service';
import { TokenService } from '../../../common/providers/token.service';
import { User } from '../../users/entity/users.entity';
import { UsersService } from '../../users/users.service';
@Injectable()
export class AccountActivationService {
  
  constructor(
    private readonly loggerApp: LoggerApp,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Sends an email containing account activation information to the user.
   * @param email The email address of the user
   * @returns A promise that resolves when the email is sent successfully
   */
  async send(username: string, email: string, token: string, expiresAt: Date): Promise<void> {
    return await this.emailService.sendActivationLink(username, email, token, expiresAt);
  }

  /**
   * Activates the user account through the user's unique identification
   * @param token The user's unique identification token
   */
  async activate(token: string): Promise<void> {
    const verifyData = await this.redisService.get<any>(`verify:${token}`)

    if (!verifyData) {
      this.loggerApp.warn('Intento de activar cuenta: El usuario intento activar cuenta con token invalido')
      throw new ConflictException('Su sesion es invalida o expiro');
    }

    return this.usersService.markUserAsActive(verifyData.userId);
  }

}
