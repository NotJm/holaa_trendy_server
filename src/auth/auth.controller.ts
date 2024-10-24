import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/restauration.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
<<<<<<< HEAD
import { ActivationDto } from 'src/auth/dto/activation.dto';
import { Request } from 'express';
=======
import { ActivationDto } from '../auth/dto/activation.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwtauth.guard';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { COOKIE_AGE } from '../common/constants/enviroment.contants';
>>>>>>> 2f52e8a68d935756f9c4ad75617f37270851cfac

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // Enviar peticiones para inicio de sesion
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    // Esperamos a que el servicio se conecte y confime credenciales
    return await this.authService.logIn(loginDto, res);

  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.signIn(registerDto);
  }

  @Post('forgot/password')
  async forgot_password(@Body() forgotPassworDto: ForgotPasswordDto) {
    return await this.authService.forgot_password(forgotPassworDto);
  }

  @Post('reset/password')
  async reset_password(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.reset_password(resetPasswordDto);
  }

  @Post('verify/otp/code')
  async verify_email(@Body() activationDto: ActivationDto) {
    return await this.authService.verify_email(activationDto);
  }

  @Post('refresh/token')
  async refresh_token(@Body() token: string) {
    return await this.authService.refreshAccessToken(token);
  }

  @Get('verify')
  async verify_token(@Req() req:Request) {
    console.log('Aqui')
    return await this.authService.verify_token(req);
  }

}
