import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwtauth.guard';
import { AdminGuard } from '../../admin/guards/admin.guard';
import { SocialService } from './social.service';
import { CreateSocialSiteDto } from './dto/create.social.dto';
import { updateSocialSiteDto } from './dto/update.social.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SocialController {

    constructor(private readonly adminService: SocialService) {}

    @Post('create/social')
    async create(@Body() createSocialSiteDto: CreateSocialSiteDto) {
        
    }
    
    @Put('update/social/:id')
    async update(@Param() id: string, @Body() updateSocialSiteDto: updateSocialSiteDto) {

    }

    @Delete('delete/social/:id')
    async delete(@Body() id: string) {}

    
}
