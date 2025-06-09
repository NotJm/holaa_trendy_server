import { ConflictException, Injectable } from '@nestjs/common';
import { generateExpirationDate } from 'src/common/utils/generate-expiration-date';
import { TokenService } from 'src/modules/auth/providers/token.service';
import { LoggerApp } from '../../../common/logger/logger.service';
import { RedisService } from '../../../common/microservice/redis/redis.service';
import { EmailService } from '../../../common/providers/email.service';
import { UsersService } from '../../users/users.service';
@Injectable()
export class AccountActivationService {
  private readonly EXPIRATION_ACTIVATION_LINK = 600; // 10 minutes

  constructor(
    private readonly loggerApp: LoggerApp,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Generates a unique token for the user and stores it in Redis with a the experation time
   * @param userId - The unique identifier of the user
   * @returns A promise that resolves to the generated token
   *
   */
  async generate(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const token = this.tokenService.generateToken({ userId });

    await this.redisService.set(
      `verify:${token}`,
      { userId },
      this.EXPIRATION_ACTIVATION_LINK,
    );

    const expiresAt = generateExpirationDate(10);

    return { token, expiresAt };
  }

  /**
   * Sends an email containing account activation information to the user.
   * @summary This method generates a unique token for the user and sends an email with the activation link.
   * @param email The email address of the user
   * @returns A promise that resolves when the email is sent successfully
   */
  async send(
    username: string,
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    return await this.emailService.sendActivationLink(
      username,
      email,
      token,
      expiresAt,
    );
  }

  /**
   * Activates the user account through the user's unique identification
   * @summary This method user account activate using the unique identification token
   * @param token The user's unique identification token
   * @throws ConflictException if the token is invalid or expired
   */
  async activate(token: string): Promise<void> {
    const verifyData = await this.redisService.get<any>(`verify:${token}`);

    if (!verifyData) {
      this.loggerApp.warn(
        'Intento de activar cuenta: El usuario intento activar cuenta con token invalido',
        'AccountActivationAService',
      );
      throw new ConflictException('Su sesion es invalida o expiro');
    }

    return this.usersService.markUserAsActive(verifyData.userId);
  }
}
