import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { AccountVerificationDto } from './dtos/activation.dto';
import { Request, Response } from 'express';
import { RoleGuard } from '../common/guards/role.guard';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../constants/contants';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  /**
   * Metodo para autenticar un cliente
   * @param loginDto Contiene informacion sobre el cliente
   * @param res Respuesta que se envia al cliente
   * @returns Respuesta al cliente (Cookie jwt)
   */
  @Post('login')
  async logIn(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    return await this.auth_service.login(loginDto, res);
  }

  /**
   * Metodo para poder inscribir un cliente
   * @param registerDto Contiene informacion a inscribir un cliente
   * @returns Respues al cliente
   */
  @Post('signup')
  async signup(
    @Body() registerDto: SignUpDto,
    @Res({ passthrough: true }) res,
  ) {
    return await this.auth_service.signup(registerDto, res);
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
    return await this.auth_service.logout(res);
  }

  /**
   * Metodo para obtener el estado de la verificacion
   * @param req Peticion donde contiene la cookies
   * @returns Regresa el estado de la verificacion
   */
  @Get('verification-status')
  async verification_status(@Req() req: Request) {
    return await this.auth_service.verification_status(req);
  }

  /**
   * Metodo para poder verificar la cuenta de un usuario
   * @param accountVerificationDto
   * @returns Regresa la respuesta de la verificacion de la cuenta
   */
  @Post('account-verification')
  async account_verification(
    @Body() accountVerificationDto: AccountVerificationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.auth_service.account_verification(
      accountVerificationDto,
      req,
      res
    );
  }

  @Get('forgot-password-status')
  async forgot_password_status(@Req() req: Request) {
    return await this.auth_service.forgot_password_status(req);
  }


  /**
   * Endpoint para poder solicitar un cambio de contraseña
   * @param forgotPasswordDto
   * @param res
   * @returns
   */
  @Post('forgot-password')
  async forgot_password(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.auth_service.forgot_password(forgotPasswordDto, res);
  }

  /**
   * Endpoint para poder restablecer la contraseña
   * @param resetPasswordDto
   * @param res
   * @returns
   */
  @Post('reset-password')
  async reset_password(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.auth_service.reset_password(resetPasswordDto, res);
  }
}
