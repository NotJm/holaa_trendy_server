import { Injectable } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { COOKIE_DEFAULT_AGE } from 'src/common/constants/contants';

@Injectable()
export class CookieService {
  /**
   * Configuracion predeterminada para cookies seguras
   */
  private cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: COOKIE_DEFAULT_AGE,
  };  

  /**
   * Envia una cookie al cliente
   * @param res Objeto respuesta 
   * @param name Nombre de la cookie
   * @param value Valor de la cookie
   * @param age Expiracion de la cookie (opcional)
   */
  send(res: Response, name: string, value: string, age?: number) {
    res.cookie(name, value, { ...this.cookieOptions, maxAge: age });
  }

  /**
   * Elimina una cookie del cliente
   * @param res Objeto respuesta
   * @param name Nombre de la cookie
   */
  delete(res: Response, name: string) {
    res.clearCookie(name);
  }

  /**
   * Obtiene el valor de una cookie
   * @param req Objeto peticion
   * @param name Nombre de la cookie
   * @returns Regresa el valor de la cookie
   */
  get(req: Request, name: string): any {
    return req.cookies[name];
  }

  getJwtCookies(req: Request): { accessToken: string, refreshAccessToken: string } {
    return {
      accessToken: req.cookies['accessToken'],
      refreshAccessToken: req.cookies['refreshAccessToken']
    };
  }

}
