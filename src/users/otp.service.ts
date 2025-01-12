import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import { TotpOptions, TotpVerifyOptions } from 'speakeasy';
import { OTP_LIFE_TIME } from '../constants/contants';
import { UserOtp } from './entity/user-otp.entity';
import { BaseService } from '../shared/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';

@Injectable()
export class OtpService extends BaseService<UserOtp> {
  private readonly OTP_KEY = this.configService.get<string>('OTP_KEY');

  constructor(
    @InjectRepository(UserOtp) private readonly userOtpRepository: Repository<UserOtp>,
    private readonly configService: ConfigService
  ) {
    super(userOtpRepository);
  }

  /**
   * Generar opciones para codigo OTP de manera segura
   * @returns Opciones para generar OTP
   */
  private generateOtpOptions(): TotpOptions {
    return {
      secret: this.OTP_KEY,
      encoding: 'base32',
      algorithm: 'sha512',
      step: OTP_LIFE_TIME,
    };
  }

  /**
   * Genera opciones pare verificar codigo OTP
   * @param otp Codigo OTP
   * @returns Opciones para verificar codigo OTP
   */
  private generateOtpVerifyOptions(otp: string): TotpVerifyOptions {
    return {
      token: otp,
      secret: this.OTP_KEY,
      encoding: 'base32',
      algorithm: 'sha512',
      step: OTP_LIFE_TIME,
    };
  }

  async findOtp(otp: string): Promise<UserOtp> {
    return this.findOne({ where: { otp: otp }})
  }

  async deleteOtp(otp: string): Promise<void> {
    return this.delete({ where: { otp: otp }})
  }

  /**
   * Genera un codigo otp
   * @returns Regresa un codigo otp y la fecha de expiracion
   */
  async generate(user: Users, useCase: "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD"): Promise<{ otp: string; otpExpiration: Date }> {
    // Generamos las opciones para el otp
    const options = this.generateOtpOptions();

    // Genero el otp mediante la configuracion inicial
    const otp = speakeasy.totp(options);

    // Calculo la fecha de expiracion
    const expiresAt = new Date(Date.now() + OTP_LIFE_TIME * 1000);

    // Creamos un registro
    await this.create({ 
      userId: user,
      otp: otp,
      expiresAt: expiresAt,
      useCase
    })


    // Regresamos el otp y la fecha de expiracion
    return {
      otp: otp,
      otpExpiration: expiresAt,
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
