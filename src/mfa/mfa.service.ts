import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmailService } from '../common/providers/email.service';
import { OtpService } from '../users/otp.service';
import { UsersService } from '../users/users.service';
import { MFACodeDto } from './dtos/mfa-code.dto';

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
    const user = await this.userService.findUser({
      where: { email: email },
    });

    if (!user) {
      throw new InternalServerErrorException('El usuario no existe');
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
      throw new InternalServerErrorException('El usuario no existe');
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
