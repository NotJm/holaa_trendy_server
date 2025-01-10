import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseService } from '../../shared/base.service';
import { Incidents, IncidentsDocument } from './schemas/incident.schema';

@Injectable()
export class IncidentService extends BaseService<IncidentsDocument> {
  // constructor(@InjectModel(Incidents.name) private readonly incidentsModel: Model<IncidentsDocument>,
  // ) {
  //   // super();
  //   // this.model = incidentsModel;
  // }

  async createOrUpdateIncident(userId: string): Promise<void> {
    // try {
    //   return await this.model.findOneAndUpdate(
    //     { userId: userId },
    //     {
    //       $inc: { failedAttempts: 1 },
    //       $set: { lastAttempt: new Date() },
    //     },
    //     { upsert: true, new: true },
    //   );
    // } catch (err) {
    //   throw new InternalServerErrorException(
    //     'Error al momento de crear la incidencia',
    //   );
    // }
  }

  async updateIncident(
    userId: string,
    item: FilterQuery<IncidentsDocument>,
  ): Promise<IncidentsDocument> {
    try {
      return await this.update(userId, item);
    } catch (err) {
      throw `Error al momento de actualizar la incidencia: ${err.message}`;
    }
  }

  async findIncident(userId: string): Promise<void> {
    // return await this.findOne({ userId });
  }

  async findIncidents(
    filter?: FilterQuery<IncidentsDocument>,
  ): Promise<void> {
    // return this.findAll(filter);
  }

  async deleteIncident(userId: string): Promise<void> {
    try {
      // await this.deleteById(userId);
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al momento de eliminar la incidencia: ${err.message}`
      )
    }
  }

  async checkFailedAttemptsLimit(incident: IncidentsDocument): Promise<boolean> {
    return incident.failedAttempts >= 5;
  }

  async resetFailedAttempts(incident: IncidentsDocument): Promise<IncidentsDocument> {
    return await this.updateIncident(incident.userId, { failedAttempts: 0 });
  }
  // /**
  //  * Metodo para saber si un usuario esta bloqueado en la base de datos
  //  * @param usernameIsBlockedDto
  //  * @returns Incident informacion sobre sus incidencias
  //  */
  // get_incident_user(username: string): Promise<Incident | null> {
  //   return this.incidentModel.findOne({ userId: username }).exec();
  // }

  // async getBlockedUsers(
  //   filterUsernameForDaysDto: FilterUsernameForDaysDto,
  // ): Promise<Incident[]> {
  //   const { days } = filterUsernameForDaysDto;

  //   const dateThreshold = new Date();
  //   dateThreshold.setDate(dateThreshold.getDate() - days);

  //   const filteredUsers = await this.incidentModel
  //     .find({
  //       isBlocked: true,
  //       $and: [
  //         { blockExpiresAt: { $ne: null } },
  //         { blockExpiresAt: { $gte: new Date(dateThreshold) } },
  //       ],
  //     })
  //     .exec();

  //   return filteredUsers;
  // }

  // async onModuleInit() {
  //   await this.createDefaultConfiguration();
  // }

  // async createDefaultConfiguration(): Promise<void> {
  //   const existsConfiguration = await this.incidentConfigurationModel
  //     .findOne()
  //     .exec();

  //   if (!existsConfiguration) {
  //     const defaultConfiguration = new this.incidentConfigurationModel();
  //     await defaultConfiguration.save();
  //   }
  // }

  // // Obtener Configuracion de incidencias
  // async getIncidentConfiguration(): Promise<IncidentConfigurationDocument> {
  //   return await this.incidentConfigurationModel.findOne().exec();
  // }

  // // Actualizar configuracion para todos
  // async updateIncidentConfiguration(
  //   id: string,
  //   updateConfigurationDto: UpdateConfigurationDto,
  // ): Promise<{ state: boolean; message: string }> {
  //   const incidentConfiguration = await this.incidentConfigurationModel
  //     .findById(id)
  //     .exec();

  //   if (!incidentConfiguration) {
  //     throw new NotFoundException(
  //       `La configuracion con la ID ${id} no ha sido encontrada`,
  //     );
  //   }

  //   await incidentConfiguration.updateOne(updateConfigurationDto);

  //   await incidentConfiguration.save();

  //   return {
  //     state: true,
  //     message: 'Configuracion actualizada con exito',
  //   };
  // }
}
