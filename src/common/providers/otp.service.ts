import speakeasy from 'speakeasy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncidentService } from 'src/admin/incident/incident.service';
import { IncidentConfiguration } from 'src/admin/incident/schemas/incident.config.schemas';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class OtpService {
  private readonly secret = this.configService.get<string>('OTP_KEY');

  constructor(
    private readonly configService: ConfigService,
    private readonly incidentService: IncidentService,
  ) {}

  async set_otp_for_user(user: UserDocument): Promise<void> {

    const { otp, exp } = await this.generate_otp();

    console.log(otp);

    user.otp = otp;
    user.otp_expiration = new Date(Date.now() + exp * 1000);

    await user.save();
    
  }

  async delete_otp_from_user(user: UserDocument): Promise<void> {
    user.otp = "";
    user.otp_expiration = null;
  }

  async get_otp_life_time(): Promise<number> {
    const configuration: IncidentConfiguration =
      await this.incidentService.getIncidentConfiguration();

    return configuration.otpLifeTime;
  }

  async generate_otp() {
    const otpLifeTime = await this.get_otp_life_time();

    return {
      otp: speakeasy.totp({
        secret: this.secret,
        encoding: 'base32',
        step: otpLifeTime,
      }),
      exp: otpLifeTime,
    };
  }

  async verify_otp(otp: string) {
    const otpLifeTime = await this.get_otp_life_time();

    return speakeasy.totp.verify({
      secret: this.secret,
      encoding: 'base32',
      token: otp,
      step: otpLifeTime,
      window: 1,
    });
  }
}
