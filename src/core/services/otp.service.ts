import speakeasy from 'speakeasy';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncidentService } from 'src/admin/incident/incident.service';

@Injectable()
export class OtpService implements OnModuleInit {

    private readonly secret = this.configService.get<string>('OTP_KEY');
    private step = 300;

    constructor(private readonly configService: ConfigService,
        private readonly incidentService: IncidentService
    ) { }

    async onModuleInit() {
        let incidenConfiguration:any = await this.incidentService.getIncidentConfiguration();

        this.step = incidenConfiguration.otpLifeTime;
    }
    
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
