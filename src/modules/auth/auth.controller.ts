import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AccountActivationDto } from './dtos/activation.dto';
import { LoginDto } from './dtos/login.dto';
import { RequestForgotPasswordDto } from './dtos/request-forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AuthInterceptor } from '../../common/interceptor/auth.interceptor';
import { RoleGuard } from '../../common/guards/role.guard';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ROLE } from '../../common/constants/contants';
import { BaseController } from '../../common/base.controller';
import { ApiResponse } from 'src/common/interfaces/api.response.interface';

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
  async signUp(@Body() signUpDto: SignUpDto): Promise<ApiResponse> {
    try {
      const response = await this.authService.signUp(signUpDto);

      return {
        status: HttpStatus.OK,
        message: 'Successfully',
        data: response,
      };
    } catch (error) {
      this.handleError(error);
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
  @UseInterceptors(AuthInterceptor)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER, ROLE.ADMIN)
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }

  /**
   * Metodo para activar la cuenta de un usuario
   */
  @Post('activate')
  async activate(@Body() accountActivationDto: AccountActivationDto) {
    return await this.authService.activate(accountActivationDto);
  }

  @Post('check-session')
  async checkSession(@Req() req: Request): Promise<ApiResponse> {
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
  ): Promise<ApiResponse> {
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
