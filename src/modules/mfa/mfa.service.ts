import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MFACodeDto } from './dtos/mfa-code.dto';
import { OtpService } from '../../common/providers/otp.service';
import { EmailService } from '../../common/providers/email.service';

@Injectable()
export class MFAService {
  constructor(
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
  ) {}

  async send(
    email: string,
    useCase: 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD',
  ): Promise<void> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new InternalServerErrorException('El codigo OTP es invalido o ha expirado');
    }

    const { otp, otpExpiration } = await this.otpService.generate(
      user,
      useCase,
    );


    await this.emailService.sendCodeMFA(email, otp, otpExpiration);
  }

  async verify(
    mfaCodeDto: MFACodeDto,
  ): Promise<{ status: number; message: string }> {
    const { otp } = mfaCodeDto;

    const userOtp = await this.otpService.findOtp(otp);

    if (!userOtp) {
      throw new InternalServerErrorException('El codigo OTP es invalido o ha expirado');
    }

    const isValid = this.otpService.verify(userOtp.otp);

    if (!isValid) {
      throw new InternalServerErrorException(
        'El codigo de verificacion es incorrecto  o ha expirado',
      );
    }

    await this.otpService.deleteOtp(otp);

    return {
      status: HttpStatus.OK,
      message: 'Se ha verificado correctamente el codigo de verificacion',
    };
  }
}
