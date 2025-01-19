import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      // Extrae el token de la caberecera Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ignora el tiempo de expiracion
      ignoreExpiration: false,
      // El secreto para validar el token
      secretOrKey: configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    // Aqui se decide que hacer con los datos de los usuarios si es valido
    return { session: payload.sessionId, role: payload.role };
  }
}
