import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ROLE } from 'src/constants/contants';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { UsersService } from './users.service';
import { SignUpDto } from 'src/auth/dtos/signup.dto';

@Controller('users')
export class UsersController {
  constructor(private user_service: UsersService) {}


  /**
   * Metodo para poder obtener todos los usuarios de la base de datos
   * Solo pueden acceder usuarios con rol de moderador o superiores
   * @returns
   */
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.ADMIN)
  async findUsers() {
    return this.user_service.findAllUsers();
  }
}
