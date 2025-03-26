import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { CookieService } from '../providers/cookie.service';
  
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService
  ) {
    super({
      // Extrae el token de la caberecera Bearer
      jwtFromRequest: (req: Request) => {
        return this.cookieService.get(req, 'trendy_session');
      },
      // Ignora el tiempo de expiracion
      ignoreExpiration: true,
      // El secreto para validar el token
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    // Aqui se decide que hacer con los datos de los usuarios si es valido
    return { userId: payload.id, role: payload.role };
  }
}
