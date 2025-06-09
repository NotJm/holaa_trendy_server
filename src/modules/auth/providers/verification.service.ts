import { Injectable } from '@nestjs/common';
import { TwilioService } from '../../../common/microservice/twilio.service';
import { EmailService } from '../../../common/providers/email.service';
import { generateExpirationDate } from '../../../common/utils/generate-expiration-date';
import { User } from '../../../modules/users/entity/users.entity';
import { UsersService } from '../../../modules/users/users.service';
import { TokenService } from './token.service';

@Injectable()
export class VerificationService {
  private readonly EXPIRATION_BY_EMAIL_DEFAULT = 5;

  constructor(
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly twilioService: TwilioService,
  ) {}

  /**
   * @summary Genera un token unico y su fecha de expiracion mediante
   * el identificador unico del cliente
   * @param userId Identificador unico del cliente
   * @returns Una estructura de datos que contiene el token y su fecha de expiracion
   */
  private generateTokenAndExpirationDate(userId: string): {
    token: string;
    expiresAt: Date;
  } {
    return {
      token: this.tokenService.generateToken({ userId: userId }), // Genera token unico mediante el servicio TokenService
      expiresAt: generateExpirationDate(this.EXPIRATION_BY_EMAIL_DEFAULT), // 5 minutos de duracion
    };
  }

  /**
   * @summary Proceso de verificacion mediante numero de telefono del usuario. En el cual se envia un codigo OTP al numero de telefono asociado
   * @param userPhone Numero de telefono asociado al usuario
   * @returns Una promesa que no resuelve nada (void)
   */
  public async sendSMS(userPhone: string): Promise<void> {
    await this.twilioService.send(userPhone);
  }

  /**
   * @summary Proceso para finalizar la verificacion mediante el numero de telefono asociado a la cuenta del usuario
   * @param userPhone Numero de telefono asociado al usuario
   * @param otpCode Codigo OTP que fue enviado al numero de telefono
   * @returns Una promesa que no resuelve nada (void)
   */
  public async verifySMS(
    userPhone: string,
    otpCode: string,
  ): Promise<void> {
    await this.twilioService.verify(userPhone, otpCode);
  }

  /**
   * @summary Proceso de verificacion con el uso de link de verificacion mediante correo electronico del usuario
   * @param user Objeto User que contiene informacion del usuario
   
   * @returns Una promesa que no resuelve nada (void)
   */
  public async byVerificationLink(user: User): Promise<void> {
    const { token, expiresAt } = this.generateTokenAndExpirationDate(user.id);

    return this.emailService.sendVerificationLink(
      user.username,
      user.email,
      token,
      expiresAt,
    );
  }

  /**
   * @summary Proceso de verificacion con el uso de correo electronico del usuario donde no se ocupa link de verificacion
   * @param user Objeto User que contiene informacion del usuario
   */
  public async byEmail(user: User): Promise<void> {
    const { expiresAt } = this.generateTokenAndExpirationDate(user.id);

    return this.emailService.sendRecoveryPasswordLink(
      user.username,
      user.email,
      expiresAt,
    );
  }
}
