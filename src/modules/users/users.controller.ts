import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ROLE } from 'src/common/constants/contants';
import { UserId } from 'src/common/decorators/user.decorator';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
import { BaseController } from '../../common/base.controller';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { RegisterAddressDto } from './dtos/register-address.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController extends BaseController {
  constructor(private userService: UsersService) {
    super();
  }

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
  @Put('update/address')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER)
  async registerAddress(
    @UserId() userId: string,
    @Body() registerAddressDto: RegisterAddressDto,
  ): Promise<IApiResponse> {
    try {
      const data = await this.userService.registerAddress(
        userId,
        registerAddressDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Direccion registrada con exito',
        data: data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('address')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER)
  async getAddress(@UserId() userId: string): Promise<IApiResponse> {
    try {
      const data = await this.userService.getAddress(userId);

      return {
        status: HttpStatus.OK,
        data: data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('data')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER, ROLE.ADMIN, ROLE.EMPLOYEE, ROLE.SUPPORT)
  async getAvatar(@UserId() userId: string): Promise<IApiResponse> {
    try {
      const userData = await this.userService.getUserById(userId);

      return {
        status: HttpStatus.OK,
        data: userData,
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.USER)
  async getProfile(@UserId() userId: string): Promise<IApiResponse> {
    try {
      const profile = await this.userService.getProfile(userId);

      return {
        status: HttpStatus.OK,
        data: profile,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
