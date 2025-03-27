import { ConfigService } from '@nestjs/config';

export const generateActivationLink = (
  configService: ConfigService,
  token: string,
): string => {
  return `${configService.get<string>('FRONTEND_URI')}/auth/signup/success/${token}`;
};


