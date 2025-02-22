import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  IApiResponse,
} from 'src/common/interfaces/api.response.interface';
import { BaseController } from '../../common/base.controller';
import { ROLE } from '../../common/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RequestForgotPasswordDto } from './dtos/request-forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignUpDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Metodo para poder inscribir un cliente
   * @param signUpDto Contiene informacion a inscribir un cliente
   * @returns Respues al cliente
   */
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<IApiResponse> {
    try {
      await this.authService.signUp(signUpDto);

      return {
        status: HttpStatus.OK,
        message: 'User register successfully',
      };
      
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Metodo para autenticar un cliente
   * @param loginDto Contiene informacion sobre el cliente
   * @param res Respuesta que se envia al cliente
   * @returns Respuesta al cliente (Cookie jwt)
   */
  @Post('login')
  async logIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res,
    @Req() req: Request,
  ) {
    return await this.authService.login(loginDto, res, req);
  }

  /**
   *
   * @param requestForgotPasswordDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('request/forgot-password')
  async requestForgotPassword(
    @Body() requestForgotPasswordDto: RequestForgotPasswordDto,
  ) {
    return await this.authService.requestForgotPassword(
      requestForgotPasswordDto,
    );
  }

  /**
   *
   * @param requestForgotPasswordDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Metodo para cerrar la sesion de un cliente
   * @param res Respuesta al cliente
   * @returns
   */
  @Get('logout')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER, ROLE.ADMIN)
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }

  /**
   * Endpoint that handles loginc for user account activation
   * @param userId The user's unique indetification
   * @returns A promise that resolves when user account is successfully activated
   */
  @Get('activate/:token')
  async activate(@Param('token') token: string): Promise<IApiResponse> {
    try {
      await this.authService.activate(token);

      return {
        status: HttpStatus.OK,
        message: 'Your account has been activated successfully',
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('check-session')
  async checkSession(@Req() req: Request): Promise<IApiResponse> {
    try {
      const check = await this.authService.checkSession(req);

      return {
        status: HttpStatus.OK,
        message: 'Coicidencia de autenticidad',
        data: {
          authenticate: check,
        },
      };
    } catch (error) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Inconsistencia de autenticidad',
        data: {
          authenticate: false,
        },
      };
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<IApiResponse> {
    try {
      const response = await this.authService.refreshToken(req, res);
      return {
        status: HttpStatus.OK,
        message: 'Successfully',
        data: {
          revoke: response,
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
