import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { JWT_AGE } from '../constants/contants';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  global: true,
  secret: configService.get<string>('SECRET_KEY'),
  signOptions: { expiresIn: JWT_AGE },
});
