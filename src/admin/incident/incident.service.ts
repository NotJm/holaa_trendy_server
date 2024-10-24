import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { CloseIncidentDto, UsernameIsBlockedDto } from './incident.dto';

@Injectable()
export class IncidentService {
  private readonly maxFailedAttempts: number;
  private readonly blockDuration: number;
  private readonly tokenLifetime: number;
  private readonly verificationMessage: string;

  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
    private readonly configService: ConfigService,
  ) {
    this.maxFailedAttempts =
      this.configService.get<number>('maxFailedAttempts');
    this.blockDuration = this.configService.get<number>('blockDuration');
    this.tokenLifetime = this.configService.get<number>('tokenLifetime');
    this.verificationMessage = this.configService.get<string>(
      'verificationMessage',
    );
  }

  // los intentos fallidos
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

  // Ver si un usuario está bloqueado
  async usernameIsBlocked(
    usernameIsBlockedDto: UsernameIsBlockedDto,
  ): Promise<Incident> {
    const { username } = usernameIsBlockedDto;
    return this.incidentModel.findOne({ username });
  }

  // Obtener lista de usuarios bloqueados en los últimos 'n' días
async getBlockedUsers(days: number): Promise<Incident[]> {
    try {
      // Obtener la fecha límite restando 'days' a la fecha actual
      const now = new Date();
      const sinceDate = new Date(now.setDate(now.getDate() - days));
    
      // Mostrar la fecha generada en los logs para verificación
      console.log('Fecha límite para la consulta:', sinceDate);
      console.log(sinceDate instanceof Date);  // Verificar que sea una fecha válida
    
      // Realizar la consulta para incidentes bloqueados
      const blockedUsers = await this.incidentModel.find({
        isBlocked: true,
        $and: [
          { blockExpiresAt: { $ne: null } }, // Verifica que no sea null
          { blockExpiresAt: { $gte: sinceDate } } // Luego verifica que sea mayor o igual a sinceDate
        ]
      }).exec();
      
    
      // Si no hay usuarios bloqueados, retornar un array vacío
      if (!blockedUsers || blockedUsers.length === 0) {
        console.log(`No se encontraron usuarios bloqueados en los últimos ${days} días.`);
        return [];
      }
    
      // Retornar los usuarios bloqueados encontrados
      return blockedUsers;
  
    } catch (error) {
      console.error('Error al obtener usuarios bloqueados:', error);
      throw new Error('Error al obtener usuarios bloqueados');
    }
  }
  
  
  

  // Obtener configuración de verificación
  getVerificationConfig() {
    return {
      tokenLifetime: this.tokenLifetime,
      verificationMessage: this.verificationMessage,
    };
  }

<<<<<<< HEAD
  // Actualizar configuración de verificación
  updateVerificationConfig(tokenLifetime: number, message: string) {
    process.env.TOKEN_LIFETIME = tokenLifetime.toString();
    process.env.VERIFICATION_MESSAGE = message;
  }
=======
    // Obtener lista de usuarios bloqueados en los últimos 'n' días
    async getBlockedUsers(days: number): Promise<Incident[]> {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);

        return this.incidentModel.find({
            isBlocked: true,
            blockExpiresAt: { $gte: sinceDate },
        }).exec();
    }

    // Obtener configuración de verificación
    getVerificationConfig() {
        return {
            tokenLifetime: this.tokenLifetime,
            verificationMessage: this.verificationMessage,
        };
    }

    // Actualizar configuración de verificación  
    updateVerificationConfig(tokenLifetime: number, message: string) {
        process.env.TOKEN_LIFETIME = tokenLifetime.toString();
        process.env.VERIFICATION_MESSAGE = message;
    }
>>>>>>> 2f52e8a68d935756f9c4ad75617f37270851cfac
}
