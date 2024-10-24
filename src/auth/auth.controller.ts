import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/restauration.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ActivationDto } from 'src/auth/dto/activation.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwtauth.guard';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { COOKIE_AGE } from 'src/common/constants/enviroment.contants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // Enviar peticiones para inicio de sesion
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    // Esperamos a que el servicio se conecte y confime credenciales
    const token = await this.authService.logIn(loginDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: COOKIE_AGE,
      path: '/'
    })

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Sesión iniciada exitosamente',
    });
  }

  // Enviar peticiones para cerrar sesion
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: "Token no proporcionado",
      });
    }

    await this.authService.logOut(res);

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "Sesion Cerrada Exitosamente",
    })
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

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Roles('user')
  @Post('change/password')
  async change_password(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.change_password(changePasswordDto);
  }

  
  

}
