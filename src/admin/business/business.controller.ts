import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateSocialSiteDto } from './dto/social/create.social.dto';
import { updateSocialSiteDto } from './dto/social/update.social.dto';
import { CreateBusinessProfileDto, UpdtaeBusinessProfileDto } from './dto/business/business.dto';
import { AuditInterceptor } from '../../core/interceptor/audit.interceptor';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from 'src/constants/contants';

@Controller('business')
export class BusinessController {

    constructor(private readonly businessService: BusinessService) {}

    // Implementacion de metodos para la creacion, leer, actualizacion y eliminacion de redes sociales

    @Post('create/social')
    @UseInterceptors(AuditInterceptor)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async createSocialSite(@Body() createSocialSiteDto: CreateSocialSiteDto) {
        return await this.businessService.creatSocialSite(createSocialSiteDto);
    }

    @Get('get/social')
    async getSocialSite() {
        return await this.businessService.getSocialSites();
    }

    @Put('update/social/:id')
    @UseInterceptors(AuditInterceptor)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async updateSocialSite(@Param('id') id: string, @Body() updateSocialSiteDto: updateSocialSiteDto) {
        return await this.businessService.updateSocialSite(id, updateSocialSiteDto);
    }

    @Delete('delete/social/:id')
    @UseInterceptors(AuditInterceptor)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async deleteSocialSite(@Param('id') id: string) {
        return await this.businessService.deleteSocialSite(id);
    }


    // Implementacion de metodos para la Gestion de Slogan

    @Get('info')
    async getBusinessInformation() {
        return await this.businessService.getBusinessInformation();
    }

    @Post('create/profile')
    @UseInterceptors(AuditInterceptor)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async createBusinessProfile(@Body() createBusinessProfileDto: CreateBusinessProfileDto) {
        return await this.businessService.createBusinessProfile(createBusinessProfileDto);
    }

    @Put('update/profile/:id')
    @UseInterceptors(AuditInterceptor)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.ADMIN)
    async updateBusinessProfile(@Param('id') id: string, @Body() upateBusinessProfileDto: UpdtaeBusinessProfileDto) {
        return await this.businessService.updateBusinessProfile(id, upateBusinessProfileDto);
    }



    

}
