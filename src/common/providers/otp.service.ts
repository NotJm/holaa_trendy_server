import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TotpOptions, TotpVerifyOptions } from 'speakeasy';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  private readonly otpKey = this.configService.get<string>('OTP_KEY');

  private readonly otpLifeTime = 300;

  constructor(private readonly configService: ConfigService) {}

  private generateOtpOptions(): TotpOptions {
    return {
      secret: this.otpKey,
      encoding: 'base32',
      algorithm: 'sha512',
      step: this.otpLifeTime,
    };
  }

  private generateOtpVerifyOptions(otp: string): TotpVerifyOptions {
    return {
      token: otp,
      secret: this.otpKey,
      encoding: 'base32',
      algorithm: 'sha512',
      step: this.otpLifeTime,
    };
  }

  /**
   * Genera un codigo otp
   * @returns Regresa un codigo otp y la fecha de expiracion
   */
  async generate(): Promise<{ otp: string; otpExpiration: Date }> {
    // Generamos las opciones para el otp
    const options = this.generateOtpOptions();

    // Genero el otp mediante la configuracion inicial
    const otp = speakeasy.totp(options);

    // Calculo la fecha de expiracion
    const otpExpiration = new Date(Date.now() + this.otpLifeTime * 1000);

    // Regresamos el otp y la fecha de expiracion
    return {
      otp: otp,
      otpExpiration: otpExpiration,
    };
  }

  /**
   * Verifica que el otp no haya expirado
   * @param otp 
   * @returns Regresa true si el otp es valido, de lo contrario regresa false
   */
  async verify(otp: string): Promise<boolean> {
    // Genero las opciones de verificacion
    const options = this.generateOtpVerifyOptions(otp);

    // Verifico el otp
    return speakeasy.totp.verify(options);
  }
}
