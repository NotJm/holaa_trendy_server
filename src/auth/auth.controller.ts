import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/restauration.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ActivationDto, ActivationDto2 } from '../auth/dto/activation.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logIn')
  async logIn(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    // Este metodo se encarga de  authenticar al usuario y si todo sale bien se regresa un JWT
    return await this.authService.logIn(loginDto, res);
  }

  @Post('signIn')
  async signIn(@Body() registerDto: RegisterDto) {
    // La implementacion de este metodo se encuentra correctamente organizada
    // En este caso solo debe de verificar la funcionalidad del Codigo OTP como verificacion extra
    // Una vez que se verifica se encuentra otro endpoint 'activation-email'
    return await this.authService.signIn(registerDto);
  }

  @Post('activation-email')
  async activationEmail(@Body() activationDto: ActivationDto) {
    // Endpoint encargado de la activacion del correo solo cuando se registra
    return await this.authService.activationEmail(activationDto);
  }

  @Get('authenticate-verification')
  async verify_token(@Req() req: Request) {
    // Implementacion de logica para verifacion de authenticacion mediante JWT
    // una vez que el usuario este logueado el guardia que esta programado en el fronend
    // actuara enviando las cookies a este endpoint para la verificacion del usuario authenticado
    return await this.authService.verificationAuthenticate(req);
  }
}
