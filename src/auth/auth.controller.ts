import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() userData: User) {
    return await this.authService.register(userData);
  }

  @Post('forgot_password')
  async forgot_password(@Body() forgotPassworDto: ForgotPasswordDto) {
    return await this.authService.forgot_password(forgotPassworDto);
  }

  @Post('reset_password')
  async reset_password(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.reset_password(resetPasswordDto);
  }

}
