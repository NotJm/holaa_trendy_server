import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CloseIncidentDto, RegisterIncidentDto } from './incident.dto';
import { JwtAuthGuard } from 'src/common/guards/jwtauth.guard';
import { AdminGuard } from 'src/admin/guards/admin.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('incident')
export class IncidentController {
    constructor(private readonly incidentService:IncidentService) {}

    @Post('register')
    @Roles('user')
    async registerFailedAttempt(@Body() registerIncidentDto: RegisterIncidentDto) {
        return this.incidentService.loginFailedAttempt(registerIncidentDto.username);
    }

    // @Post('')
}
