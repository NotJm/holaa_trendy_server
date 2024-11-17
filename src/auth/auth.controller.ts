import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ActivationDto } from '../auth/dto/activation.dto';
import { Request, Response } from 'express';
import { RoleGuard } from 'src/core/guards/role.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/constants/contants';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/restauration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logIn')
  /**
   * Endpoint para poder iniciar sesion de manera sencilla requiere crendenciales.
   * Este metodo se encarga de  authenticar al usuario y si todo sale bien se regresa un JWT
   */
  async logIn(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    return await this.authService.logIn(loginDto, res);
  }

  @Post('signIn')
  /**
   * Endpoint para poder registruar un usuario
   */
  async signIn(@Body() registerDto: RegisterDto) {
    return await this.authService.signIn(registerDto);
  }

  @Get('logOut')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async logOut(@Res() res: Response) {
    return await this.authService.logOut(res);
  }

  @Post('account-activation')
  async accountActivation(@Body() activationDto: ActivationDto) {
    // Endpoint encargado de la activacion del correo solo cuando se registra
    return await this.authService.accountActivation(activationDto);
  }

  /**
   * Metodo para verificar la authenticacion del usuario
   * @param req 
   * @returns Regresa booleano si existe la cookie de authenticate para verifcacion
   */
  @Get('authenticate-verification')
  async verifyToken(@Req() req: Request) {
    return await this.authService.verificationAuthenticate(req);
  }

  @Post('refresh-token') 
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async refresAccessToken(@Req() req: Request, @Res() res: Response) {
    return await this.authService.refreshAccessToken(req, res)
  }

  @Post('request-password')
  async requestPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.reset_password(resetPasswordDto);
  }
}
