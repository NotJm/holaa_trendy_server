import speakeasy from 'speakeasy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
    constructor(private readonly configService: ConfigService) {}

    generateOTP() {
        const secret = this.configService.get<string>('OTP_KEY');
        const step = this.configService.get<number>('OTP_STEP', 300);

        return speakeasy.totp({
            secret,
            encoding: 'base32',
            step
        })
    }

    verifyOTP(token: string) {
        const secret = this.configService.get<string>('OTP_KEY');
        const step = this.configService.get<number>('OTP_STEP', 300);

        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            step,
            window: 1,
        })
    }
}
