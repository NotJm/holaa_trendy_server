import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiResponse } from 'src/common/interfaces/api.response.interface';
import { BaseController } from '../../common/base.controller';
import { ROLE } from '../../common/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignUpDto } from './dtos/signup.dto';
import { SendSmsDto, VerifySmsDto } from './dtos/sms.dto';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Endpoint that handles signup for user account
   * @param signUpDto Contains information to register a new user
   * @param res Response to the client
   * @returns Response to the client
   */
  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      await this.authService.signUp(signUpDto, res);

      return {
        status: HttpStatus.OK,
        message:
          'Tu registro se ha completado con éxito. Ahora, por favor, activa tu cuenta para comenzar a disfrutar de nuestros servicios.',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Endpoint that handles logic for user account activation
   * @param userId The user's unique indetification
   * @returns A promise that resolves when user account is successfully activated
   */
  @Get('account/activate/:token')
  async activate(@Param('token') token: string): Promise<IApiResponse> {
    try {
      await this.authService.activateAccount(token);

      return {
        status: HttpStatus.OK,
        message: 'La cuenta se ha activado exitosamente',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handles the logic for user login
   * @summary This method is used to login a user in the system
   * @param loginDto Contains information to login a user
   * @param res Response to the client
   * @param req Request from the client
   * @returns Response to the client
   */
  @Post('login')
  async logIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res,
    @Req() req: Request,
  ): Promise<IApiResponse> {
    try {
      await this.authService.logIn(loginDto, res, req);

      return {
        status: HttpStatus.OK,
        message:
          'Para continuar, por favor verifica tu identidad con el link de verificacion que te enviamos a tu correo electronico.',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handles the logic for sending a verification code to the user's phone number
   * @param to The user's phone number
   * @param res Response to the client
   * @returns A promise that resolves when the verification code it send
   */
  @Post('send/sms/code')
  async sendVerificationCode(
    @Body() sendSmsDto: SendSmsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      await this.authService.sendSms(sendSmsDto.phone);

      return {
        status: HttpStatus.OK,
        message:
          'Se ha enviado un codigo de verificacion a su numero de telefono asociado',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handles the logic for verifying a verification code
   * @param verify Contains the user's phone number and the code
   * @param req Request from the client
   * @param res Response to the client
   * @returns Response to the client
   */
  @Post('verify/sms/code')
  async verifyVerificationCode(
    @Body() verifySmsDto: VerifySmsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      await this.authService.verifySms(verifySmsDto.phone, verifySmsDto.code, res);

      return {
        status: HttpStatus.OK,
        message: 'El codigo de verificacion es valido exitosamente',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handles the logic for verifying a verification link
   * @param token Contains the verification link
   * @param res Response to the client
   * @returns Response to the client
   */
  @Post('verify/email/link/:token')
  async verifyVerificationLink(
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      await this.authService.startSession(token, res);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handles the logic for logging out a user
   * @param res Response to the client
   * @returns Response to the client
   */
  @Get('logout')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER, ROLE.ADMIN, ROLE.EMPLOYEE, ROLE.SUPPORT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return await this.authService.logout(res, req);
  }

  /**
   * Handles the logic for resetting a user's password
   * @param resetPasswordDto Contains the user's new password
   * @param req Request from the client
   * @param res Response to the client
   * @returns Response to the client
   */
  @Post('reset/password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      await this.authService.resetPassword(resetPasswordDto, req, res);

      return {
        status: HttpStatus.OK,
        message: 'Se ha restablecido la contraseña exitosamente',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handles the logic for sending a recovery link to the user's email
   * @param to Contains the user's email
   * @param res Response to the client
   * @returns Response to the client
   */
  @Post('send/email/recovery/link')
  async sendRecoveryLink(
    @Body() to: { email: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      await this.authService.sendRecoveryLink(to.email, res);

      return {
        status: HttpStatus.OK,
        message:
          'Se ha enviado un enlace de recuperacion de contraseña a su correo electronico asociado',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('check/session')
  async checkSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      const { active, role } = await this.authService.checkSession(req, res);

      return {
        status: HttpStatus.OK,
        data: {
          authenticate: active,
          role: role,
        },
      };
    } catch (error) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        data: {
          authenticate: false,
          role: null,
        },
      };
    }
  }

  @Post('refresh/session')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      const revoked = await this.authService.refreshToken(req, res);

      return {
        status: HttpStatus.OK,
        data: {
          revoke: revoked,
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
