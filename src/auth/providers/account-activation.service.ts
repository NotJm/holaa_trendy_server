import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailService } from '../../common/providers/email.service';
import { OtpService } from '../../common/providers/otp.service';
import { UsersService } from '../../users/users.service';
import { CookieService } from '../../common/providers/cookie.service';

@Injectable()
export class AccountActivationService {
  constructor(
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * Envia un correo con el codigo de activacion de la cuenta
   * @param email Correo del usuario
   */
  async send(email: string): Promise<void> {
    const user = null;
    // const user = await this.usersService.findUser({ email });

    if (!user) {
      throw new InternalServerErrorException('El usuario no existe');
    }

    const { otp, otpExpiration } = await this.otpService.generate();

    // await this.usersService.updateUser(user.id, {
    //   otp: otp,
    //   otpExpiration: otpExpiration,
    // });


    await this.emailService.sendCodeAccountActivation(
      email,
      otp,
      otpExpiration,
    );
  }

  async activate(otp: string): Promise<void> {
    const user = null;
    // const user = await this.usersService.findUser({ otp });

    if (!user) {
      throw new InternalServerErrorException('El usuario no existe');
    }	

		const isValid = this.otpService.verify(user.otp);
	
		if (!isValid) {
				throw new ConflictException('El codigo de activacion es incorrecto o ha expirado');
		} else {
			// await this.usersService.updateUser(user.id, {
			// 	isVerified: true,
      //   otp: '',
      //   otpExpiration: null,
			// })
		}
		
  }
}
