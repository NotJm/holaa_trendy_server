import { ConfigService } from "@nestjs/config";

export const generateLink = (
  configService: ConfigService,
  path: string,
  params?: Record<string, string | number>
): string => {
  const baseUrl = `http://${configService.get<string>('HOSTNAME')}:${configService.get<number>('FRONT_PORT')}`;

  if (params) {
    Object.keys(params).forEach(key => {
      const regex = new RegExp(`:${key}`, 'g');
      path = path.replace(regex, String(params[key]));
    });
  }

  return `${baseUrl}/${path}`;
};
