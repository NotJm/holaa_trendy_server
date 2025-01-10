import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmailService } from '../common/providers/email.service';
import { OtpService } from '../common/providers/otp.service';
import { UsersService } from '../users/users.service';
import { CookieService } from '../common/providers/cookie.service';
import { MFACodeDto } from './dtos/mfa-code.dto';


@Injectable()
export class MFAService {
  constructor(
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

  async send(email: string): Promise<void> {
    const user = null 
    // const user = await this.userService.findUser({ email });

    if (!user) {
      throw new InternalServerErrorException('El usuario no existe');
    }

    const { otp, otpExpiration } = await this.otpService.generate();

    // await this.userService.updateUser(user.id, {
    //   otp: otp,
    //   otpExpiration: otpExpiration,
    // });

    await this.emailService.sendCodeMFA(email, otp, otpExpiration);
  }

  async verify(
    mfaCodeDto: MFACodeDto,
  ): Promise<{ status: number; message: string }> {
    const { otp } = mfaCodeDto;

    const user = null;
    // const user = await this.userService.findUser({ otp });

    if (!user) {
      throw new InternalServerErrorException('El usuario no existe');
    }

    const isValid = this.otpService.verify(user.otp);

    if (!isValid) {
      throw new InternalServerErrorException(
        'El codigo de verificacion es incorrecto  o ha expirado',
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Se ha verificado correctamente el codigo de verificacion',
    };
  }
}
