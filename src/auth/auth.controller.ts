import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { ROLE } from '../constants/contants';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AccountActivationDto } from './dtos/activation.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return await this.authService.signUp(registerDto, res);
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
   * Metodo para cerrar la sesion de un cliente
   * @param res Respuesta al cliente
   * @returns
   */
  @Get('logout')
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

}
