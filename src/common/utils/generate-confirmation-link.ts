import { ConfigService } from "@nestjs/config";

export const generateVerificationLink = (
  configService: ConfigService,
  token: string,
): string => {
  return `http://${configService.get<string>('HOSTNAME')}:${configService.get<number>('FRONT_PORT')}/auth/account-confirmation/verification/${token}`;
};