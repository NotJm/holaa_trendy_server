import { ConflictException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiRequest } from 'src/common/interfaces/api-request.interface';
import { LoggerApp } from '../../../common/logger/logger.service';
import { RedisService } from '../../../common/microservice/redis/redis.service';
import { CookieService } from '../../../common/providers/cookie.service';
import { generateSessionId } from '../../../common/utils/generate-session-id';
import { User } from '../../../modules/users/entity/users.entity';
import { UsersService } from '../../users/users.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ISession } from '../interfaces/session.interface';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from './token.service';

@Injectable()
export class SessionService {
  private readonly EXPIRATION_TEMPORARY_SESSION = 300; // 5 minutes

  constructor(
    private readonly loggerApp: LoggerApp,
    private readonly redisService: RedisService,
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Handles the logic for starting the user's session
   * @summary This method is used to start the user's session and the send cookies 
   * @param user The user's object containing user's data
   * @param res The response object
   * @param token The optional parameter containing user's unique identification
   * @param useToken The flag for working with the user's unique identification
   * @returns A promise that resolves to void
   * @throws UnauthorizedException if the token is invalid
   * @throws NotFoundException if the token is not found
   */
  async startSession(
    user: User,
    res: Response,
    token?: string,
    useToken: boolean = false,
    useRedisService: boolean = true,
  ): Promise<void> {
    /**
     * Si se ocupa inciar sesion mediante un token unico generado esto
     * es necesario si se indica que tiene que ver una verificacion persistente despues de cada inicio de sesion
     */
    if (token && useToken) {
      const { userId } = await this.tokenService.verifyToken<{
        userId: string;
      }>(token);

      user = await this.usersService.findUserById(userId);
    }

    // Generamos payload para los JWT
    const payload: IJwtPayload = {
      sub: user.id,
      role: user.role,
    };

    // Obtenemos los tiempos de expiracion mediante el rol del usuario
    const { accessTokenAge, refreshTokenAge } =
      this.tokenService.getTokenAgesByRole(user.role);
    const { accessCookieAge, refreshCookieAge } =
      this.cookieService.getCookieAgesByRole(user.role);

    // Generamos los tokens
    const accessToken = this.tokenService.generateToken(
      payload,
      accessTokenAge,
    );
    const refreshToken = this.tokenService.generateToken(
      payload,
      refreshTokenAge,
    );

    // Si se utiliza Redis, almacenar el refresh token en Redis
    if (useRedisService) {
      const redisTTL = this.redisService.getTTLByRole(user.role);

      await this.redisService.set(
        `refresh:${refreshToken}`,
        { userId: user.id },
        redisTTL,
      );
      // Si no se utiliza Redis, se utiliza una forma mas rudimentaria
    } else {
      this.refreshTokenService.saveRefreshToken(
        user,
        refreshToken,
        accessCookieAge,
      );
    }

    // Enviar los tokens en las cookies
    this.tokenService.sendInCookie(
      accessToken,
      res,
      'trendy_session',
      accessCookieAge,
    );
    this.tokenService.sendInCookie(
      refreshToken,
      res,
      'trendy_refresh_session',
      refreshCookieAge,
    );
  }

  async stopSession(
    res: Response,
    req: IApiRequest,
    useRedisService: boolean = true,
  ): Promise<void> {
    try {
      const { refreshToken } = this.tokenService.getTokensByCookie(req);

      if (useRedisService) {
        this.redisService.del(`refresh:${refreshToken}`);
      } else {
        this.refreshTokenService.deleteRefreshToken(refreshToken);
      }

      await Promise.all([
        Promise.resolve().then(() => {
          this.tokenService.delete(res, 'trendy_session');
          this.tokenService.delete(res, 'trendy_refresh_session');
        }),
      ]);
    } catch (error) {
      this.loggerApp.error(
        `Error durante finalizar la sesion: ${error.message}`,
        'SessionService',
      );
    }
  }

  async checkSession(req: IApiRequest): Promise<ISession> {
    const { accessToken } = this.tokenService.getTokensByCookie(req);

    const userData =
      await this.tokenService.verifyToken<IJwtPayload>(accessToken);

    const user = await this.usersService.findUserById(userData.sub);

    return { active: true, role: user.role };
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
      this.EXPIRATION_TEMPORARY_SESSION,
    );

    return sessionId;
  }

  /**
   * Sends the session id to the client
   * @summary This method is used to send the session id to the client
   * @param sessionId The session id
   * @param res The response object
   */
  sendSessionInCookie(sessionId: string, res: Response): void {
    return this.cookieService.sendCookie(res, 'session_id', sessionId);
  }

  verifySession(req: Request): string {
    const sessionId = this.cookieService.getCookie(req, 'session_id');

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

    return this.cookieService.deleteCookie(res, 'session_id');
  }
}
