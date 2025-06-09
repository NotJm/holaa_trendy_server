import { Injectable, OnModuleDestroy, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { redisConfig } from '../../config/redis.config';
import { LoggerApp } from '../../logger/logger.service';


@Injectable({ scope: Scope.DEFAULT })
export class RedisService implements OnModuleDestroy {
  readonly #client: Redis;

  private readonly REDIS_TTL_BY_ROLE = {
    ADMIN: 1 * 24 * 60 * 60,       
    EMPLOYEE: 3 * 24 * 60 * 60,    
    SUPPORT: 5 * 24 * 60 * 60,     
    USER: 7 * 24 * 60 * 60,        
  };
  

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerApp: LoggerApp,
  ) {
    this.#client = new Redis(redisConfig(this.configService));

    this.#client.once('connect', () =>
      this.loggerApp.log('✅ Conectado a redis', 'RedisService'),
    );
    
    this.#client.once('error', (error) =>
      this.loggerApp.error(
        `Error al conectar a redis: ${error}`,
        'RedisService',
      ),
    );
  }

  public getTTLByRole(role: string): number {
    return this.REDIS_TTL_BY_ROLE[role.toUpperCase()] || this.REDIS_TTL_BY_ROLE.USER;
  }

  /**
   * Handles the logic for setting a value in Redis with an expiration time
   * @summary This method serializes the value to JSON and sets it in Redis with an expiration time
   * @param key The key under which the value will be stored in Redis
   * @param value The value to be stored in Redis
   * @param ttl Time to live in seconds (default is 300 seconds)
   * @returns A promise that resolves to the result of the Redis set operation
   * @throws {Error} If there is an error while setting the value in Redis
   */
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

  /**
   * Handles the logic for getting a value by key from the provide Redis
   * @param key The key under whic the value will be store in Redis
   * @returns A promise that resolves to the result of the Redis get operation
   * @throws {Error} If ther is an error while getting the value in Redis
   */
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
