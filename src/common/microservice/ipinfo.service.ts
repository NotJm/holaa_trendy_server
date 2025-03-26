import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IpInfoResponse } from '../interfaces/ipinfo.response.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IpInfoService {
  private readonly IPINFO_API = this.configService.get<string>('IPINFO_API');
  private readonly IPINFO_TOKEN =
    this.configService.get<string>('IPINFO_TOKEN');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getInformation(ip: string): Promise<IpInfoResponse> {
    const response = await firstValueFrom(
      this.httpService.get<IpInfoResponse>(
        `${this.IPINFO_API}/${ip}/json?token=${this.IPINFO_TOKEN}`,
      ),
    );

    return response.data;
  }
}
