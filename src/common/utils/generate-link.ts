import { ConfigService } from "@nestjs/config";

export const generateLink = (
  configService: ConfigService,
  path: string,
  params?: Record<string, string | number>
): string => {
  const baseUrl = `${configService.get<string>('HOSTNAME')}`;

  if (params) {
    Object.keys(params).forEach(key => {
      const regex = new RegExp(`:${key}`, 'g');
      path = path.replace(regex, String(params[key]));
    });
  }

  return `${baseUrl}/${path}`;
};
