import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { FilterUsernameForDaysDto, RegisterIncidentDto } from './dto/incident.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { Role } from 'src/constants/contants';
import { JwtAuthGuard } from '../../core/guards/jwt.auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { UpdateConfigurationDto } from './dto/configuration.dto';

// Implementacion de controlador para el manejo de incidencias este metodo solo es accesible para ciertos
// usuarios como por ejmplo auth o administradores
@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  // Metodo que se encarga de registrar al usuarios que hacen un intento fallido
  // de iniciar sesion
  @Post('register')
  async registerFailedAttempt(@Body() registerIncidentDto: RegisterIncidentDto) {
    return await this.incidentService.registerFailedAttempt(registerIncidentDto);
  }

  // Metodo para obtener a los usuarios bloquedos filtrando por el numero de dias bloqueados
  @Get('blocked/users')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async getBlockedUsers(@Body() filterUsernameForDaysDto: FilterUsernameForDaysDto) {
    return await this.incidentService.getBlockedUsers(filterUsernameForDaysDto);
  }

  // Obtener la configuración actual de intentos fallidos y duración del bloqueo
  @Get('configuration')
  async getConfiguration() {
    return await this.incidentService.getIncidentConfiguration();
  }

  @Put('update/configuration/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async updateConfiguration(@Param('id') id: string, @Body() updateConfigurationDto: UpdateConfigurationDto) {
    return await this.incidentService.updateIncidentConfiguration(id, updateConfigurationDto);
  }


   
}
