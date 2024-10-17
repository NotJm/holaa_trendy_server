import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';

@Controller()
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

  @Post('forgot_password')
  async forgot_password(@Body() forgotPassworDto: ForgotPasswordDto) {
    return await this.authService.forgot_password(forgotPassworDto);
  }

  @Post('reset_password')
  async reset_password(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.reset_password(resetPasswordDto);
  }

  @Get('verify_email')
  async verify_email(@Query('token') token: string) {
    console.log('si llegue');
    return await this.authService.verify_email(token);
  }
  

}
