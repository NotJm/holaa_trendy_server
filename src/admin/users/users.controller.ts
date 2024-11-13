import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuard } from 'src/core/guards/role.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { Role } from 'src/constants/contants';
import { Roles } from 'src/core/decorators/roles.decorator';


@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UsersController {

    constructor(private userService: UsersService) {}

    
    @Roles(Role.ADMIN)
    @Get('get/all')
    async findAll() {
        return this.userService.findAll();
    }
    
}
