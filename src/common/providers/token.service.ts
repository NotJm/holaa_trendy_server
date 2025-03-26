import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { COOKIE_JWT_AGE, JWT_DEFAULT_AGE } from 'src/common/constants/contants';
import { CookieService } from 'src/common/providers/cookie.service';
import { JwtPayload } from '../../modules/auth/interfaces/jwt-payload.interface';
import { LoggerApp } from '../logger/logger.service';

@Injectable()
export class TokenService {
  private readonly jwtOptions: JwtSignOptions = {
    expiresIn: JWT_DEFAULT_AGE,
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerApp: LoggerApp,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * Generates a JWT token with the given payload and optional jwtAge
   * @param payload The payload to be encoded in the token
   * @param jwtAge The optional jwtAge to be used for the token
   * @returns The generated JWT token
   */
  public generate(payload: any, jwtAge?: string): string {
    if (jwtAge) {
      this.jwtOptions.expiresIn = jwtAge;
    }

    return this.jwtService.sign(payload, this.jwtOptions);
  }

  /**
   * Handles the logic for sending a JWT token to the response
   * @summary This method is used to send a JWT token to the response
   * @param token The JWT token to be sent
   * @param res The response object
   * @param cookieName The name of the cookie to be sent
   * @param cookieAge The age of the cookie to be sent
   * @returns A promise that resolves to void
   */
  public async send(
    token: string,
    res: Response,
    cookieName: string = 'accessToken',
    cookieAge: number = COOKIE_JWT_AGE,
  ): Promise<void> {
    return this.cookieService.send(res, cookieName, token, cookieAge);
  }

  public verify<T>(token: string): Promise<T> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(`Token invalido`);
    }
  }

  public decode(token: string): JwtPayload {
    const decode = this.jwtService.decode<JwtPayload>(token);

    if (!decode) {
      throw new UnauthorizedException('Invalid Token');
    }

    return decode;
  }

  public delete(res: Response, tokenName: string): void {
    res.clearCookie(tokenName);
  }

  public get(req: Request): { accessToken: string; refreshToken: string } {
    const accessToken = this.cookieService.get(req, 'trendy_session');
    const refreshToken = this.cookieService.get(req, 'trendy_refresh_session');

    if (!accessToken || !refreshToken) {
      this.loggerApp.warn(
        'Intento de obtener las sesiones del usuario: El usuario no esta autenticado',
        'TokenService',
      );

      throw new UnauthorizedException('Su session ha expirado o es invalida');
    }

    return { accessToken, refreshToken };
  }
}
