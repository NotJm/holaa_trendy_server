import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { UsernameIsBlockedDto } from './incident.dto';
import { Config, ConfigDocument } from './schemas/config.schemas';
import { EmailMessage, EmailMessageDocument } from './schemas/emai.schema';

@Injectable()
export class IncidentService {
  private maxFailedAttempts: number;
  private blockDuration: number;
  private tokenLifetime: number;
  private verificationMessage: string;

  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
    @InjectModel(EmailMessage.name) private emailMessageModel: Model<EmailMessageDocument>
  ) {
    this.loadConfig();
  }

  // Cargar configuración desde la base de datos
  private async loadConfig() {
    const config = await this.configModel.findOne();
    if (config) {
      this.maxFailedAttempts = config.maxFailedAttempts;
      this.blockDuration = config.blockDuration;
    } else {
      // Valores por defecto si no se encuentra una configuración
      this.maxFailedAttempts = 5;
      this.blockDuration = 60; // minutos
      this.tokenLifetime = 1440; // minutos
      this.verificationMessage = 'Por favor, verifica tu cuenta.';
    }
  }

  // Actualizar el número de intentos fallidos
  async updateFailedAttempts(maxAttempts: number): Promise<any> {
    let config = await this.configModel.findOne();
    if (!config) {
      config = new this.configModel({
        maxFailedAttempts: maxAttempts,
      });
    } else {
      config.maxFailedAttempts = maxAttempts;
    }
    await config.save();

    // Actualizamos los valores en la instancia actual del servicio
    this.maxFailedAttempts = maxAttempts;

    return { message: 'Número de intentos fallidos actualizado correctamente' };
  }

  // Actualizar la duración del bloqueo
  async updateBlockDuration(blockDuration: number): Promise<any> {
    let config = await this.configModel.findOne();
    if (!config) {
      config = new this.configModel({
        blockDuration: blockDuration,
      });
    } else {
      config.blockDuration = blockDuration;
    }
    await config.save();

    // Actualizamos los valores en la instancia actual del servicio
    this.blockDuration = blockDuration;

    return { message: 'Duración del bloqueo actualizada correctamente' };
  }

  // Lógica para manejar los intentos fallidos
  async loginFailedAttempt(username: string): Promise<Incident> {
    const incident = await this.incidentModel.findOne({ username });
    const now = new Date();

    if (incident) {
      // Si la cuenta está bloqueada y el bloqueo no ha expirado
      if (incident.isBlocked && now < incident.blockExpiresAt) {
        throw new ForbiddenException(
          `La cuenta está bloqueada. Inténtalo nuevamente después de ${new Date(incident.blockExpiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
        );
      }

      // Si el bloqueo ha expirado, reiniciar el contador de intentos
      if (incident.isBlocked && now >= incident.blockExpiresAt) {
        incident.failedAttempts = 0;
        incident.isBlocked = false;
        incident.blockExpiresAt = null;
      }

      // Incrementar el número de intentos fallidos
      incident.failedAttempts += 1;
      incident.lastAttempt = now;

      // Bloquear si excede el número máximo de intentos fallidos
      if (incident.failedAttempts >= this.maxFailedAttempts) {
        incident.isBlocked = true;
        incident.blockExpiresAt = new Date(
          now.getTime() + this.blockDuration * 60 * 1000,
        ); // minutos
      }

      return incident.save();
    } else {
      // Si no existe una incidencia para ese usuario, crearla
      const newIncident = new this.incidentModel({
        username: username,
        failedAttempts: 1,
        lastAttempt: new Date(),
      });
      return newIncident.save();
    }
  }

  // Obtener configuración de verificación
  getVerificationConfig() {
    return {
      tokenLifetime: this.tokenLifetime,
      verificationMessage: this.verificationMessage,
    };
  }

  // Actualizar configuración de verificación
  async updateVerificationConfig(tokenLifetime: number, message: string) {
    const config = await this.configModel.findOne();
    if (config) {
    //   config.tokenLifetime = tokenLifetime;
    //   config.verificationMessage = message;
      await config.save();
    } else {
      const newConfig = new this.configModel({
        tokenLifetime: tokenLifetime,
        verificationMessage: message,
      });
      await newConfig.save();
    }

    // Actualizamos los valores en la instancia actual del servicio
    this.tokenLifetime = tokenLifetime;
    this.verificationMessage = message;

    return { message: 'Configuración de verificación actualizada correctamente' };
  }

  async usernameIsBlocked(
    usernameIsBlockedDto: UsernameIsBlockedDto,
  ): Promise<Incident> {
    const { username } = usernameIsBlockedDto;
    return this.incidentModel.findOne({ username });
  }

  getConfig(): { maxFailedAttempts: number; blockDuration: number } {
    return {
      maxFailedAttempts: this.maxFailedAttempts,
      blockDuration: this.blockDuration,
    };
  }

  async getBlockedUsers(days: number): Promise<Incident[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
  
    // Obtener todos los usuarios que están bloqueados
    const blockedUsers = await this.incidentModel.find({ isBlocked: true }).exec();
  
    // Filtrar manualmente los usuarios cuyo bloqueo ha expirado después del dateThreshold
    const filteredUsers = blockedUsers.filter(user => {
      return user.blockExpiresAt && user.blockExpiresAt >= dateThreshold;
    });
  
    return filteredUsers;
  }
  
  

  // Obtener el mensaje de correo
  async getEmailMessage(): Promise<EmailMessage> {
    const emailMessage = await this.emailMessageModel.findOne();
    if (!emailMessage) {
      return this.createDefaultEmailMessage();
    }
    return emailMessage;
  }

  // Actualizar el mensaje de correo
  async updateEmailMessage(newMessage: string): Promise<EmailMessage> {
    let emailMessage = await this.emailMessageModel.findOne();
    if (!emailMessage) {
      emailMessage = new this.emailMessageModel({ message: newMessage });
    } else {
      emailMessage.message = newMessage;
    }
    return emailMessage.save();
  }

  // Crear mensaje de correo por defecto
  private async createDefaultEmailMessage(): Promise<EmailMessage> {
    const defaultMessage = new this.emailMessageModel({
      message: 'Este es un mensaje predeterminado de correo...',
    });
    return defaultMessage.save();
  }

  
}
