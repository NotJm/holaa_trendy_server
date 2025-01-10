import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PwnedService {
  private API_PWNED = this.configService.get<string>('API_PWNED');

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async isPwned(password: string): Promise<boolean> {
    const timeComitteds = await this.verify(password); 
    return timeComitteds > 0 ;
  }

  private async verify(password: string): Promise<number> {
    const hash = this.sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5).toUpperCase();

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.API_PWNED}/${prefix}`),
      );
      const hashes = response.data.split('\n');

      for (const line of hashes) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix === suffix) {
          return parseInt(count, 10); 
        }
      }
    } catch (err) {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error al momento de verificar contraseña`,
      });
    }
  }

  private sha1(str: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha1').update(str).digest('hex').toUpperCase();
  }
}
