import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Response } from 'express';
import { IApiRequest } from 'src/common/interfaces/api-request.interface';
import { CookieService } from 'src/common/providers/cookie.service';
import { LoggerApp } from '../../../common/logger/logger.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  private readonly jwtOptions: JwtSignOptions = {
    expiresIn: '5m',
  };

  private readonly ACCESS_TOKEN_BY_ROLE = {
    ADMIN: '15m',
    EMPLOYEE: '30m',
    SUPPORT: '1h',
    USER: '2h',
  };

  private readonly REFRESH_TOKEN_BY_ROLE = {
    ADMIN: '1d',
    EMPLOYEE: '3d',
    SUPPORT: '5d',
    USER: '7d',
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerApp: LoggerApp,
    private readonly cookieService: CookieService,
  ) {}

  public getTokenAgesByRole(role: string): {
    accessTokenAge: string;
    refreshTokenAge: string;
  } {
    return {
      accessTokenAge: this.ACCESS_TOKEN_BY_ROLE[role.toUpperCase()] || '5m',
      refreshTokenAge: this.REFRESH_TOKEN_BY_ROLE[role.toUpperCase()] || '7d',
    };
  }

  /**
   * Generates a JWT token with the given payload and optional jwtAge
   * @param payload The payload to be encoded in the token
   * @param jwtAge The optional jwtAge to be used for the token
   * @returns The generated JWT token
   
   */
  public generateToken(payload: IJwtPayload | any, jwtAge?: string): string {
    if (jwtAge) this.jwtOptions.expiresIn = jwtAge;

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
  public sendInCookie(
    token: string,
    res: Response,
    cookieName: string = 'accessToken',
    cookieAge: number = 15 * 60 * 1000,
  ): void {
    return this.cookieService.sendCookie(res, cookieName, token, cookieAge);
  }

  /**
   * Handles the logic for verifying a JWT token
   * @summary This method is used to verify a JWT token
   * @param token - The unique user's identification
   * @returns A promise that resolves to the verified token
   * @thorws UnauthorizedException if the token is invalid
   */
  public verifyToken<T>(token: string): Promise<T> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(`Token invalido`);
    }
  }

  /**
   * Handls the logic for decoding a JWT token
   * @summart This method is used to decode a JWT token
   * @param token The unique user's identification
   * @returns An interface containing the decoded token
   * @throws UnauthorizedException if the token is invalid
   */
  public decode(token: string): IJwtPayload {
    const decode = this.jwtService.decode<IJwtPayload>(token);

    if (!decode) {
      throw new UnauthorizedException('Invalid Token');
    }

    return decode;
  }

  /**
   * Handles the logic for deleting a JWT token
   * @summary This method is used to delete a JWT token
   * @param res - The response object
   * @param tokenName - The name of the cookie to be deleted
   */
  public delete(res: Response, tokenName: string): void {
    return this.cookieService.deleteCookie(res, tokenName);
  }

  /**
   * Handles the logic for getting the JWT tokens from the request
   * @sumamry This method is used to get the JWT tokens from the request
   * @param req - The request object
   * @returns An object containing the accessToken and refreshToken
   * @throws UnauthorizedException if the user is not authenticated
   */
  public getTokensByCookie(req: IApiRequest): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.cookieService.getCookie(req, 'trendy_session');
    const refreshToken = this.cookieService.getCookie(
      req,
      'trendy_refresh_session',
    );

    if (!accessToken) {
      this.loggerApp.warn(
        'Acceso denegado: Token de acceso no encontrado en las cookies',
        'TokenService',
      );
      throw new UnauthorizedException(
        'Falta el token de acceso. Por favor, inicie sesión nuevamente.',
      );
    }

    if (!refreshToken) {
      this.loggerApp.warn(
        'Acceso denegado: Token de refresco no encontrado en las cookies',
        'TokenService',
      );
      throw new UnauthorizedException(
        'Falta el token de refresco. Por favor, inicie sesión nuevamente.',
      );
    }

    return { accessToken, refreshToken };
  }
}
