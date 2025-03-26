import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { LoggerApp } from '../logger/logger.service';
@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly #client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerApp: LoggerApp,
  ) {
    this.#client = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSSWORD') || '',
      db: this.configService.get('REDIS_DB') || 0,
      maxRetriesPerRequest: 2,
      
    });

    this.#client.on('connect', () =>
      this.loggerApp.log('Conectado a redis', 'RedisService'),
    );
    this.#client.on('error', (error) =>
      this.loggerApp.error(
        `Error al conectar a redis: ${error}`,
        'RedisService',
      ),
    );
  }

  async set(key: string, value: unknown, ttl: number = 300): Promise<string> {
    try {
      const data = JSON.stringify(value);
      return await this.#client.set(key, data, 'EX', ttl);
    } catch (error) {
      this.loggerApp.error(
        `Error al establecer el valor en redis: ${error}`,
        error.stack,
        'RedisService',
      );
      return null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.#client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.loggerApp.error(
        `Error al obtener el valor en redis: ${error}`,
        error.stack,
        'RedisService',
      );
      return null;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.#client.del(key);
    } catch (error) {
      this.loggerApp.error(
        `Error al eliminar clave ${key}: ${error.message}`,
        error.stack,
        'RedisService',
      );
      return 0;
    }
  }

  async onModuleDestroy() {
    this.loggerApp.log('Cerrando conexion a redis', 'RedisService');
    await this.#client.quit();
  }
}
