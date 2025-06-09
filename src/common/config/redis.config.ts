import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const redisConfig = (configService: ConfigService): RedisOptions => ({
  host: configService.get('REDIS_HOST'),
  port: configService.get('REDIS_PORT'),
  username: configService.get('REDIS_USER') || '',
  password: configService.get('REDIS_PASSWORD') || '',
  db: configService.get('REDIS_DB') || 0,
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => (times > 1 ? null : 1000),
  showFriendlyErrorStack: false,
});
