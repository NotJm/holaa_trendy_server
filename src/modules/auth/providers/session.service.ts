import { ConflictException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { COOKIE_BY_ROLE } from 'src/common/constants/contants';
import { JWT_BY_ROLE } from '../../../common/constants/contants';
import { LoggerApp } from '../../../common/logger/logger.service';
import { RedisService } from '../../../common/microservice/redis.service';
import { CookieService } from '../../../common/providers/cookie.service';
import { TokenService } from '../../../common/providers/token.service';
import { generateSessionId } from '../../../common/utils/generate-session-id';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly loggerApp: LoggerApp,
    private readonly redisService: RedisService,
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  async start(token: string, res: Response): Promise<void> {
    const { userId } = await this.tokenService.verify<{ userId: string }>(
      token,
    );

    const user = await this.usersService.findUserById(userId);

    const jwtAge = JWT_BY_ROLE[user.role];


    const accessToken = this.tokenService.generate(
      { id: user.id, role: user.role },
      jwtAge,
    );

    const refreshToken = this.tokenService.generate(
      { id: user.id, role: user.role },
      '7d',
    );

    await this.redisService.set(
      `refresh:${refreshToken}`,
      { userId: user.id },
      60 * 60 * 24 * 7,
    );

    return (
      this.tokenService.send(accessToken, res, 'trendy_session', 1 * 60 * 60 * 1000) &&
      this.tokenService.send(refreshToken, res, 'trendy_refresh_session', 1 * 60 * 60 * 1000)
    );
  }

  /**
   * Generates a temporary session id for the user
   * @summary This method is used to generate a temporary session id for the user and save it in the redis cache, session expires in 5 minutes
   * @param userId The user's unique identification
   * @returns A promise that resolves to the session id
   */
  async generateTemporarySession(userId: string): Promise<string> {
    const sessionId = generateSessionId();
 
    await this.redisService.set(
      `session:${sessionId}`,
      { userId: userId },
      300,
    );

    return sessionId;
  }

  /**
   * Sends the session id to the client
   * @summary This method is used to send the session id to the client
   * @param sessionId The session id
   * @param res The response object
   */
  send(sessionId: string, res: Response): void {
    return this.cookieService.send(res, 'session_id', sessionId);
  }

  verify(req: Request): string {
    const sessionId = this.cookieService.get(req, 'session_id');

    if (!sessionId) {
      this.loggerApp.warn(
        'Intento de verificar la sesion del usuario: Se intento verificar la sesion del usuario pero no existe',
        'SessionService',
      );
      throw new ConflictException('Su sesion ha expirado o es invalida');
    }

    return sessionId;
  }

  async get(sessionId: string): Promise<string> {
    const sessionData = await this.redisService.get<any>(
      `session:${sessionId}`,
    );

    if (!sessionData) {
      this.loggerApp.warn(
        'Intento de recuperar datos de la sesion del usuario: Se intento recuperar datos de la sesion del usuario pero expiraron',
      );
      throw new ConflictException('Su sesion ha expirado o es invalida');
    }

    return sessionData.userId;
  }

  async del(sessionId: string, res: Response): Promise<void> {
    await this.redisService.del(`session:${sessionId}`);

    return this.cookieService.delete(res, 'session_id');
  }
}
