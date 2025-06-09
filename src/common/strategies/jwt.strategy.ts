import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { CookieService } from '../providers/cookie.service';
import { IApiRequest } from '../interfaces/api-request.interface';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
  ) {
    super({
      jwtFromRequest: (req: IApiRequest) => this.retrieveJWTFromRequest(req),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  private retrieveJWTFromRequest(req: IApiRequest): any {
    return this.cookieService.existsCookie(req, 'trendy_session')
      ? this.cookieService.getCookie(req, 'trendy_session')
      : this.cookieService.getCookie(req, 'refresh_trendy_session');
  }

  async validate(payload: IJwtPayload) {
    return { userId: payload.sub, role: payload.role };
  }
}
