import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')

export class UsersController {

    constructor(private userService: UsersService) {}

    // @UseGuards(JwtAuthGuard, AdminGuard)
    // @Roles('admin')
    @Get('get/all')
    async findAll() {
        // return this.userService.findAll();
    }
    
}
