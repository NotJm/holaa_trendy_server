import speakeasy from 'speakeasy';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncidentService } from 'src/admin/incident/incident.service';
import { IncidentConfiguration } from 'src/admin/incident/schemas/incident.config.schemas';

@Injectable()
export class OtpService {

    private readonly secret = this.configService.get<string>('OTP_KEY');

    constructor(private readonly configService: ConfigService,
        private readonly incidentService: IncidentService
    ) { }


    async getOtpLifeTime(): Promise<number> {
        const configuration: IncidentConfiguration = await this.incidentService.getIncidentConfiguration();

        return configuration.otpLifeTime;
    }

    
    async generateOTP() {

        const otpLifeTime = await this.getOtpLifeTime();

        return {
            otp: speakeasy.totp({
                secret: this.secret,
                encoding: 'base32',
                step: otpLifeTime
            }),
            exp: otpLifeTime
        }
    }

    async verificationOTP(otp: string) {

        const otpLifeTime = await this.getOtpLifeTime();

        return speakeasy.totp.verify({
            secret: this.secret,
            encoding: 'base32',
            token: otp,
            step: otpLifeTime,
            window: 1,
        })
    }
}
