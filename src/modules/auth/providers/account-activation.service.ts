import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { OtpService } from '../../../common/providers/otp.service';
import { EmailService } from '../../../common/providers/email.service';

@Injectable()
export class AccountActivationService {
constructor(
  private readonly otpService: OtpService,
  private readonly emailService: EmailService,
  private readonly usersService: UsersService,
) {}

/**
 * Envia un correo con el codigo de activacion de la cuenta
 * @param email Correo del usuario
 */
async send(email: string): Promise<void> {
  const user = await this.usersService.findUser({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new InternalServerErrorException('El usuario no existe');
  }

  const { otp, otpExpiration } = await this.otpService.generate(
    user,
    'SIGNUP',
  );

  await this.emailService.sendCodeAccountActivation(
    email,
    otp,
    otpExpiration,
  );
}

async activate(otp: string): Promise<void> {
  const userOtp = await this.otpService.findOtp(otp);

  console.log(userOtp);

  if (!userOtp) {
    throw new InternalServerErrorException('El usuario no existe');
  }

  const isValid = this.otpService.verify(userOtp.otp);

  if (!isValid) {
    throw new ConflictException(
      'El codigo de activacion es incorrecto o ha expirado',
    );
  } else {
    await this.usersService.updateUser(userOtp.userId.userId, {
      isVerified: true,
    });

    await this.otpService.deleteOtp(otp);
  }
}
}
