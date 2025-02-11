import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ROLE } from 'src/common/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { RegisterAddressDto } from './dtos/register-address.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /**
   * Metodo para poder obtener todos los usuarios de la base de datos
   * Solo pueden acceder usuarios con rol de moderador o superiores
   * @returns
   */
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.ADMIN)
  async findUsers() {
    return this.userService.findAllUsers();
  }

  /**
   * Metodo para register o actualizar la direccion de un usuario
   * @param req Cuerpo de la peticion
   * @param registerAddressDto DTO para registrar la drieccion del usuario
   * @returns 
   */
  @HttpCode(HttpStatus.OK)
  @Post('register/address')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER)
  async registerAddress(
    @Req() req: Request,
    @Body() registerAddressDto: RegisterAddressDto,
  ) {
    return await this.userService.registerAddress(req, registerAddressDto);
  }

 
}
