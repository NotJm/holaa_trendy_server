import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import {
  FilterUsernameForDaysDto,
  RegisterIncidentDto,
} from './dto/incident.dto';
import {
  IncidentConfiguration,
  IncidentConfigurationDocument,
} from './schemas/incident.config.schemas';

import { UpdateConfigurationDto } from './dto/configuration.dto';

@Injectable()
export class IncidentService implements OnModuleInit {
  async onModuleInit() {
    await this.createDefaultConfiguration();
  }

  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
    @InjectModel(IncidentConfiguration.name)
    private incidentConfigurationModel: Model<IncidentConfigurationDocument>,
  ) {}

  async createDefaultConfiguration(): Promise<void> {
    const existsConfiguration = await this.incidentConfigurationModel
      .findOne()
      .exec();

    if (!existsConfiguration) {
      const defaultConfiguration = new this.incidentConfigurationModel();
      await defaultConfiguration.save();
    }
  }

  // Obtener Configuracion de incidencias
  async getIncidentConfiguration(): Promise<IncidentConfigurationDocument> {
    return await this.incidentConfigurationModel.findOne().exec();
  }

  // Actualizar configuracion para todos
  async updateIncidentConfiguration(
    id: string,
    updateConfigurationDto: UpdateConfigurationDto,
  ): Promise<{ state: boolean; message: string }> {
    const incidentConfiguration = await this.incidentConfigurationModel
      .findById(id)
      .exec();

    if (!incidentConfiguration) {
      throw new NotFoundException(
        `La configuracion con la ID ${id} no ha sido encontrada`,
      );
    }

    await incidentConfiguration.updateOne(updateConfigurationDto);

    await incidentConfiguration.save();

    return {
      state: true,
      message: 'Configuracion actualizada con exito',
    };
  }

  // Lógica para manejar los intentos fallidos
  async registerFailedAttempt(
    registerIncidentDto: RegisterIncidentDto,
  ): Promise<Incident> {
    const { email } = registerIncidentDto;

    const incident = await this.incidentModel.findOne({ username: email });
    const incidentConfiguration = await this.incidentConfigurationModel
      .findOne()
      .exec();
    const now = new Date();

    if (incident) {
      if (this.isAccountBlocked(incident, now)) {
        throw new ForbiddenException(
          `La cuenta está bloqueada. Inténtalo nuevamente después de ${incident.blockExpiresAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
        );
      }

      this.resetAttemptsIfBlockExpired(incident, now);

      incident.failedAttempts += 1;
      incident.lastAttempt = now;

      if (incident.failedAttempts >= incidentConfiguration.maxFailedAttempts) {
        this.blockAccount(incident, incidentConfiguration.blockDuration, now);
      }

      return incident.save();
    } else {
      return this.createIncident(email);
    }
  }

  // Verifica si la cuenta está bloqueada y el bloqueo no ha expirado
  private isAccountBlocked(incident: Incident, now: Date): boolean {
    return incident.isBlocked && now < incident.blockExpiresAt;
  }

  // Reinicia los intentos fallidos y desbloquea la cuenta si el bloqueo ha expirado
  private resetAttemptsIfBlockExpired(incident: Incident, now: Date): void {
    if (incident.isBlocked && now >= incident.blockExpiresAt) {
      incident.failedAttempts = 0;
      incident.isBlocked = false;
      incident.blockExpiresAt = null;
    }
  }

  // Bloquea la cuenta y establece la duración del bloqueo
  private blockAccount(
    incident: Incident,
    blockDuration: number,
    now: Date,
  ): void {
    incident.isBlocked = true;
    incident.blockExpiresAt = new Date(
      now.getTime() + blockDuration * 60 * 1000,
    );
  }

  // Crea una nueva incidencia para el usuario
  private async createIncident(email: string): Promise<Incident> {
    const newIncident = new this.incidentModel({
      username: email,
      failedAttempts: 1,
      lastAttempt: new Date(),
    });
    return newIncident.save();
  }

  /**
   * Metodo para saber si un usuario esta bloqueado en la base de datos
   * @param usernameIsBlockedDto
   * @returns Incident informacion sobre sus incidencias
   */
  async getIncidentUser(username: string): Promise<Incident> {
    return await this.incidentModel.findOne({ username }).exec();
  }

  async getBlockedUsers(
    filterUsernameForDaysDto: FilterUsernameForDaysDto,
  ): Promise<Incident[]> {
    const { days } = filterUsernameForDaysDto;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const filteredUsers = await this.incidentModel
      .find({
        isBlocked: true,
        $and: [
          { blockExpiresAt: { $ne: null } },
          { blockExpiresAt: { $gte: new Date(dateThreshold) } },
        ],
      })
      .exec();

    return filteredUsers;
  }
}
