import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PwnedService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async verificationPassword(password: string) : Promise<any> {
        const hash = this.sha1(password);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5).toUpperCase();
        const API_PWNED = this.configService.get<string>("API_PWNED")

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${API_PWNED}/${prefix}`)
            );
            const hashes = response.data.split('\n');

            for (const line of hashes) {
                const [hashSuffix, count] = line.split(':');
                if (hashSuffix === suffix) {
                  return parseInt(count, 10); // Devolver el número de veces
                }
              }
        } catch (err) {
            throw new HttpException('Error al verificar la contraseña', HttpStatus.BAD_REQUEST);
        }
    }

    private sha1(str: string): string {
        const crypto = require('crypto');
        return crypto.createHash('sha1').update(str).digest('hex').toUpperCase();
    }
}
