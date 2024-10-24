import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminGuard } from '../admin/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwtauth.guard';
import { UsersService } from './users.service';


@Controller('users')

export class UsersController {

    constructor(private userService: UsersService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Roles('admin')
    @Get('get/all')
    async findAll() {
        return this.userService.findAll();
    }
    
}
