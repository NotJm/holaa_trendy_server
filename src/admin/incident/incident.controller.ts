import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { RegisterIncidentDto } from './incident.dto';

@Controller('incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  // Registrar intento fallido de login
  @Post('register')
  async registerFailedAttempt(
    @Body() registerIncidentDto: RegisterIncidentDto,
  ) {
    return this.incidentService.loginFailedAttempt(
      registerIncidentDto.username,
    );
  }

  // Obtener usuarios bloqueados en los últimos n días
  @Get('blocked-users')
  async getBlockedUsers(@Query('days') days: number = 30) {
    return this.incidentService.getBlockedUsers(days);
  }

  // Obtener la configuración actual de intentos fallidos y duración del bloqueo
  @Get('config')
  async getConfig() {
    return this.incidentService.getConfig();
  }

  // Obtener la configuración actual de verificación
  @Get('verification-config')
  getVerificationConfig() {
    return this.incidentService.getVerificationConfig();
  }

  // Actualizar el número de intentos fallidos
  @Post('update-failed-attempts')
  async updateFailedAttempts(@Body('maxAttempts') maxAttempts: number) {
    return this.incidentService.updateFailedAttempts(maxAttempts);
  }

  // Actualizar la duración del bloqueo
  @Post('update-block-duration')
  async updateBlockDuration(@Body('blockDuration') blockDuration: number) {
    return this.incidentService.updateBlockDuration(blockDuration);
  }

  // Actualizar configuración de tiempo de vida del token y mensaje de verificación
  @Post('update-verification')
  updateVerificationConfig(
    @Body('tokenLifetime') tokenLifetime: number,
    @Body('message') message: string,
  ) {
    return this.incidentService.updateVerificationConfig(
      tokenLifetime,
      message,
    );
  }

   // Obtener el mensaje de correo
   @Get('email-message')
   async getEmailMessage() {
     return this.incidentService.getEmailMessage();
   }
 
   // Actualizar el mensaje de correo
   @Post('update-email-message')
   async updateEmailMessage(@Body('message') newMessage: string) {
     return this.incidentService.updateEmailMessage(newMessage);
   }

   
}
