import { ConfigService } from '@nestjs/config';

export const generateActivationLink = (
  configService: ConfigService,
  token: string,
): string => {
  return `http://${configService.get<string>('HOSTNAME')}:${configService.get<number>('FRONT_PORT')}/auth/signup/success/${token}`;
};


