import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('forgot/password')
  async forgot_password(@Body() forgotPassworDto: ForgotPasswordDto) {
    return await this.authService.forgot_password(forgotPassworDto);
  }

  @Post('reset/password')
  async reset_password(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.reset_password(resetPasswordDto);
  }

  @Get('verify/otp/code')
  async verify_email(@Query('otp') otp: string) {
    return await this.authService.verify_email(otp);
  }
  

}
