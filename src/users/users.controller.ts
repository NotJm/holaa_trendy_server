import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuard } from '../common/guards/role.guard';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { ROLE } from 'src/constants/contants';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private user_service: UsersService) {}


  /**
   * Metodo para poder obtener todos los usuarios de la base de datos
   * Solo pueden acceder usuarios con rol de moderador o superiores
   * @returns
   */
  @Get('get/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.ADMIN)
  async get_all() {
    return this.user_service.get_all();
  }
}
