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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Metodo para poder inscribir un cliente
   * @param registerDto Contiene informacion a inscribir un cliente
   * @returns Respues al cliente
   */
  @Post('signup')
  async signup(@Body() registerDto: SignUpDto) {
    return await this.authService.signUp(registerDto);
  }

  /**
   * Metodo para autenticar un cliente
   * @param loginDto Contiene informacion sobre el cliente
   * @param res Respuesta que se envia al cliente
   * @returns Respuesta al cliente (Cookie jwt)
   */
  @Post('login')
  async logIn(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    return await this.authService.login(loginDto, res);
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

  // @UseInterceptors(AuthInterceptor)
  @Post('check-session')
  async checkSession(@Req() req: Request) {
    return await this.authService.checkSession(req);
  }
}
