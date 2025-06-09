import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMilliseconds } from 'date-fns';
import { Response } from 'express';
import { BaseService } from 'src/common/base.service';
import { IApiRequest } from 'src/common/interfaces/api-request.interface';
import { CookieService } from 'src/common/providers/cookie.service';
import { User } from 'src/modules/users/entity/users.entity';
import { Repository } from 'typeorm';
import { LoggerApp } from '../../../common/logger/logger.service';
import { RedisService } from '../../../common/microservice/redis/redis.service';
import { UsersService } from '../../../modules/users/users.service';
import { RefreshToken } from '../entity/refresh-token.entity';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { TokenService } from './token.service';
@Injectable()
export class RefreshTokenService extends BaseService<RefreshToken> {
  constructor(
    @InjectRepository(RefreshTokenService)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly loggerApp: LoggerApp,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {
    super(refreshTokenRepository);
  }

  /**
   * @summary Busca un registro que coincida con el token unico del usuario
   * @param token Token unico del usuario
   * @throws {UnauthorizedException} Si el registro no coincide se lanza una excepcion de No autorizado
   * @returns Una promesa que resuelve cuando la entidad RefreshToken fue encontrada
   */
  private async findRefreshTokenByToken(token: string): Promise<RefreshToken> {
    const storedToken = await this.findOne({
      relations: ['user'],
      where: {
        token: token,
      },
    });

    if (!storedToken) {
      this.loggerApp.warn(
        'Intento de actualizar el token de acceso: Los datos no existen',
        'RefreshTokenService',
      );

      throw new UnauthorizedException(
        'Su sesion ha expirado o no esta disponible',
      );
    }

    return storedToken;
  }

  /**
   * @summary Verifica que el token del registro no este ya revocado o este expirado
   * @param storedToken Registro que contiene el token de unico del usuario
   * @returns Verdadero si el token fue revocado o expirado y falso si ninguna de las dos condiciones se cumple
   */
  private isRefreshTokenExpiredOrRevoked(storedToken: RefreshToken): boolean {
    return storedToken.revoked || storedToken.expiresAt.getTime() < Date.now();
  }

  private async invalidateRefreshToken(
    storedToken: RefreshToken,
  ): Promise<RefreshToken> {
    return this.update(storedToken.id, {
      revoked: true,
    });
  }

  /**
   * Manipula la logica para podre refrescar el token de acceso de un cliente
   * @summary Este metodo utiliza el servicio de Redis para manejar de manera mas eficaz el refresco del token sin depender directamente de la base de datos .
   * Mediante el uso del token de refresco verificamos y actualizamos el token de acceso para persistir la sesion del cliente
   * @param req Objeto tipo IApiRequest que contiene informacion sobre la peticion actual
   * @param res Objeto tipo Response que contiene informacion sobre la respuesta actual
   * @throws {UnauthorizedException} En caso de que la informacion no se encuentre, se regresara un error 401 (No autorizado)
   * @returns Una promeas que se resuelve cuando el token de acceso es refrescado exitosamente
   */
  async refreshTokenWithRedis(req: IApiRequest, res: Response): Promise<void> {
    const refreshToken = this.cookieService.getCookie(req, 'trendy_refresh_session');

    const refreshTokenData = await this.redisService.get<{ userId: string }>(
      `refresh:${refreshToken}`,
    );

    if (!refreshTokenData) {
      this.loggerApp.warn(
        'Intento de actualizar el token de acceso: Los datos no existen',
        'AuthService',
      );

      throw new UnauthorizedException(
        'Su sesion ha expirado o no esta disponible',
      );
    }

    const user = await this.usersService.findUserById(refreshTokenData.userId);

    const payload: IJwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const { accessTokenAge } = this.tokenService.getTokenAgesByRole(user.role);
    const { accessCookieAge } = this.cookieService.getCookieAgesByRole(
      user.role,
    );

    const newAccessToken = this.tokenService.generateToken(
      payload,
      accessTokenAge,
    );

    return this.tokenService.sendInCookie(
      newAccessToken,
      res,
      'trendy_session',
      accessCookieAge,
    );
  }

  /**
   * Manipula la logica para poder refrecar el token de acceso de un cliente
   * @summary Este metodo utiliza el servicio tradicional mediante la base de datos busca el token que este asignado al usuario para poder refrescarlo.
   * @param req Objeto tipo IApiRequest que contiene informacion sobre la peticion actual
   * @param res Objeto tipo Response que contiene informacion sobre la respuesta actual
   * @throws {UnauthorizedException} En caso de que la informacion no se encuentre, se regresara un error 401 (No autorizado)
   * @returns Una promeas que se resuelve cuando el token de acceso es refrescado exitosamente
   */
  async refreshToken(req: IApiRequest, res: Response): Promise<void> {
    const { refreshToken } = this.tokenService.getTokensByCookie(req);

    const storedToken = await this.findRefreshTokenByToken(refreshToken);

    if (this.isRefreshTokenExpiredOrRevoked(storedToken)) {
      throw new UnauthorizedException('Su sesion ha expirado');
    }

    const user = storedToken.user;

    const payload: IJwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const { accessTokenAge, refreshTokenAge } =
      this.tokenService.getTokenAgesByRole(user.role);

    const { accessCookieAge, refreshCookieAge } =
      this.cookieService.getCookieAgesByRole(user.role);

    const newAccessToken = this.tokenService.generateToken(
      payload,
      accessTokenAge,
    );

    const newRefreshToken = this.tokenService.generateToken(
      payload,
      refreshTokenAge,
    );

    this.invalidateRefreshToken(storedToken);

    this.saveRefreshToken(user, newRefreshToken, refreshCookieAge);

    this.tokenService.sendInCookie(
      newAccessToken,
      res,
      'trendy_session',
      accessCookieAge,
    );
    this.tokenService.sendInCookie(
      newRefreshToken,
      res,
      'trendy_refresh_session',
      refreshCookieAge,
    );
  }

  /**
   * Guardar el token de refresco en la base de datos, en caso de no tener habilitado el servicio de redis
   * @param user Objeto User que contiene toda la informacion
   * @param refreshToken Identificador unico token refresco
   */
  async saveRefreshToken(
    user: User,
    refreshToken: string,
    expiresInMiliseconds: number,
  ): Promise<void> {
    const expiresAt = addMilliseconds(new Date(), expiresInMiliseconds);

    await this.create({
      token: refreshToken,
      expiresAt,
      user,
    });
  }

  /**
   * @summary Invalidar el token de refresco de la base de datos, en caso de que el usuario cierre sesion. Esto viene mejor para hacer una mejor auditoria
   * @param refreshToken Identificador unico del usuario
   */
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    const storedToken = await this.findRefreshTokenByToken(refreshToken);
    await this.invalidateRefreshToken(storedToken);
  }
}
