import speakeasy from 'speakeasy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {

    private readonly secret = this.configService.get<string>('OTP_KEY');
    private readonly step = this.configService.get<number>('OTP_STEP');

    constructor(private readonly configService: ConfigService) {}
    
    generateOTP() {
        return {
            otp: speakeasy.totp({
                secret: this.secret,
                encoding: 'base32',
                step: this.step
            }),
            exp: this.step
        }
    }

    verificationOTP(token: string) {
        return speakeasy.totp.verify({
            secret: this.secret,
            encoding: 'base32',
            token,
            step: this.step,
            window: 1,
        })
    }
}
