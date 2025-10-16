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
import { IApiRequest } from 'src/common/interfaces/api-request.interface';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
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
  async signUp(@Body() signUpDto: SignUpDto): Promise<IApiResponse> {
    try {
      await this.authService.signUp(signUpDto);

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
   * Endpoint that handles logic for user login account
   * @summary This method is used to login a user in the system
   * @param loginDto Contains information to login a user
   * @param res Response to the client
   * @param req Request from the client
   * @returns Response to the client
   */
  @Post('login')
  async logIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: IApiRequest,
  ): Promise<IApiResponse> {
    try {
      await this.authService.logIn(loginDto, res, req);

      return {
        status: HttpStatus.OK,
        message: `¡Bienvenido, ${loginDto.username}!
        Estamos felices de verte de nuevo en HOLAA Trendy. ¡Disfruta de tus compras!`,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('mobile/login')
  async mobileLogIn(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: IApiRequest,
  ): Promise<IApiResponse> {
    try {
      const { token } = await this.authService.mobileLogIn(LoginDto, res, req);

      return {
        status: HttpStatus.OK,
        message: `¡Bienvenido, ${LoginDto.username}!
        Estamos felices de verte de nuevo en HOLAA Trendy. ¡Disfruta de tus compras!`,
        data: token
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  

  /**
   * Endpoint that handles the logic for sending a verification code to the user's phone number
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
      await this.authService.sendSMS(sendSmsDto.phone);

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
      await this.authService.verifySMS(
        verifySmsDto.phone,
        verifySmsDto.code,
        res,
      );

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
    @Req() req: IApiRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return await this.authService.logout(res, req);
  }

  @Post("mobile/forgot-password")
  async forgotPasswordMobile(

  ): Promise<IApiResponse> {
    return {
      status: HttpStatus.OK,
      message: "Se ha iniciado el proceso de recuperación de contraseña"
    }
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

  /**
   * Handles the logic for checking the user's session
   * @param req A request object
   * @returns A promise that resolves IApiResponse containing the response data
   */
  @Post('check/session')
  async checkSession(@Req() req: IApiRequest): Promise<IApiResponse> {
    try {
      const { active, role } = await this.authService.checkSession(req);

      return {
        status: HttpStatus.OK,
        data: {
          authenticated: active,
          role: role,
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post('refresh/session')
  async refreshToken(
    @Req() req: IApiRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse> {
    try {
      await this.authService.refreshToken(req, res);

      return {
        status: HttpStatus.OK,
        data: {
          revoked: true,
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
