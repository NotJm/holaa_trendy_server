import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { RegisterIncidentDto } from './incident.dto';
import { JwtAuthGuard } from '../../common/guards/jwtauth.guard';
import { AdminGuard } from '../../admin/guards/admin.guard';
import { Roles } from '../../common/decorators/roles.decorator';

// @UseGuards(JwtAuthGuard, AdminGuard)
@Controller('incidents')
export class IncidentController {
    constructor(private readonly incidentService: IncidentService) {}

    // Registrar intento fallido de login
    @Post('register')
    // @Roles('user')
    async registerFailedAttempt(@Body() registerIncidentDto: RegisterIncidentDto) {
        return this.incidentService.loginFailedAttempt(registerIncidentDto.username);
    }

    // Obtener usuarios bloqueados en los últimos n días
    @Get('blocked-users')
    // @Roles('admin')
    async getBlockedUsers(@Query('days') days: number = 30) {
        return this.incidentService.getBlockedUsers(days);
    }

    // Obtener la configuración actual de verificación
    @Get('verification-config')
    // @Roles('admin')
    getVerificationConfig() {
        return this.incidentService.getVerificationConfig();
    }

    // Actualizar configuración de tiempo de vida del token y mensaje de verificación
    @Post('update-verification')
    // @Roles('admin')
    updateVerificationConfig(
        @Body('tokenLifetime') tokenLifetime: number,
        @Body('message') message: string
    ) {
        return this.incidentService.updateVerificationConfig(tokenLifetime, message);
    }
}
