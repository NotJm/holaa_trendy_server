import { Injectable } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { IApiRequest } from '../interfaces/api-request.interface';

@Injectable()
export class CookieService {
  COOKIE_AGE_DEFAULT = 5 * 60 * 1000;

  private readonly COOKIE_AGE_BY_ROLE = {
    ADMIN: 15 * 60 * 1000,
    EMPLOYEE: 30 * 60 * 1000,
    SUPPORT: 1 * 60 * 60 * 1000,
    USER: 2 * 60 * 60 * 1000,
  };

  private readonly REFRESH_COOKIE_AGE_BY_ROLE = {
    ADMIN: 1 * 24 * 60 * 60 * 1000,
    EMPLOYEE: 3 * 24 * 60 * 60 * 1000,
    SUPPORT: 5 * 24 * 60 * 60 * 1000,
    USER: 7 * 24 * 60 * 60 * 1000,
  };

  /**
   * Default configuration for secure cookies
   */
  private cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'none', 
    secure: true, 
    path: '/',
    maxAge: this.COOKIE_AGE_DEFAULT,
  };

  public getCookieAgesByRole(role: string): {
    accessCookieAge: number;
    refreshCookieAge: number;
  } {
    return {
      accessCookieAge:
        this.COOKIE_AGE_BY_ROLE[role.toUpperCase()] || this.COOKIE_AGE_DEFAULT,
      refreshCookieAge:
        this.REFRESH_COOKIE_AGE_BY_ROLE[role.toUpperCase()] ||
        this.COOKIE_AGE_DEFAULT,
    };
  }

  /**
   * Envia una cookie al cliente
   * @param res Objeto respuesta
   * @param name Nombre de la cookie
   * @param value Valor de la cookie
   * @param cookieAge Expiracion de la cookie (opcional)
   */
  sendCookie(res: Response, name: string, value: string, cookieAge?: number) {
    res.cookie(name, value, { ...this.cookieOptions, maxAge: cookieAge });
  }

  /**
   * Elimina una cookie del cliente
   * @param res Objeto respuesta
   * @param name Nombre de la cookie
   */
  deleteCookie(res: Response, name: string) {
    res.clearCookie(name, this.cookieOptions);
  }

  /**
   * Obtiene el valor de una cookie
   * @param req Objeto peticion
   * @param name Nombre de la cookie
   * @returns Regresa el valor de la cookie
   */
  getCookie(req: Request, name: string): any {
    return req.cookies[name];
  }

  getJwtCookies(req: Request): {
    accessToken: string;
    refreshAccessToken: string;
  } {
    return {
      accessToken: req.cookies['accessToken'],
      refreshAccessToken: req.cookies['refreshAccessToken'],
    };
  }

  existsCookie(req: IApiRequest, cookieName: string): boolean {
    return req.cookies[cookieName] ? true : false;
  }
}
