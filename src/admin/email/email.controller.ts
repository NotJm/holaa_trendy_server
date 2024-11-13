import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from 'src/constants/contants';
import { Roles } from 'src/core/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { RoleGuard } from 'src/core/guards/role.guard';
import { EmailService } from './email.service';
import { UpdateEmailConfigurationDto } from './dto/configuration.dto';

@Controller('email')
@UseGuards(JwtAuthGuard, RoleGuard)
export class EmailController {

    constructor(private readonly emailService: EmailService) {}

    @Get('configuration')
    @Roles(Role.ADMIN)
    async getEmailConfiguration() {
        return await this.emailService.getEmailConfigurattion();
    }

    @Put('update/configuration/:id')
    @Roles(Role.ADMIN)
    async updateEmailConfiguration(@Param('id') id: string, @Body() updateEmailConfigurationDto: UpdateEmailConfigurationDto) {
        return await this.emailService.updateEmailConfiguration(id, updateEmailConfigurationDto);
    } 
}
