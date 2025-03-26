import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import { OTP_LIFE_TIME } from '../constants/contants';

@Injectable()
export class OtpService {
  private readonly OTP_SECRET = this.configService.get<string>('OTP_SECRET');

  constructor(private readonly configService: ConfigService) {}

  private generate(): string {
    return speakeasy.totp({
      secret: this.OTP_SECRET,
      encoding: 'base32',
      step: OTP_LIFE_TIME,
    })
  }

  private verify(token: string): boolean {
    return speakeasy.totp.verify({
      token: token,
      secret: this.OTP_SECRET,
      encoding: 'base32',
      step: OTP_LIFE_TIME,
    })
  }

  async generateAndSendByPhone(phone: string): Promise<void> {
    const otp = this.generate();
  }

  async generateAndSendByEmail(email: string): Promise<void> {
    const otp = this.generate();
  }
  

 
}
