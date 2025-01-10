import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ROLE } from 'src/constants/contants';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { EmailService } from './email.service';
import { UpdateEmailConfigurationDto } from './dto/configuration.dto';

@Controller('email')
@UseGuards(JwtAuthGuard, RoleGuard)
export class EmailController {

    constructor(private readonly emailService: EmailService) {}

    @Get('configuration')
    @Roles(ROLE.ADMIN)
    async getEmailConfiguration() {
        return await this.emailService.getEmailConfigurattion();
    }

    @Put('update/configuration/:id')
    @Roles(ROLE.ADMIN)
    async updateEmailConfiguration(@Param('id') id: string, @Body() updateEmailConfigurationDto: UpdateEmailConfigurationDto) {
        return await this.emailService.updateEmailConfiguration(id, updateEmailConfigurationDto);
    } 
}
