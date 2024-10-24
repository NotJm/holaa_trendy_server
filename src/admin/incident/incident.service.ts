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

  async getBlockedUsers(days: number): Promise<Incident[]> {
    // Obtener la fecha límite, restando los días indicados a la fecha actual
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
  
    console.log('Date Threshold:', dateThreshold);  // Para asegurarse de que sea una fecha válida
  
    // Verificar que blockExpiresAt es un campo de tipo Date válido
    return this.incidentModel.find({
      isBlocked: true,
      blockExpiresAt: {
        $gte: dateThreshold // Asegúrate de que dateThreshold sea una instancia válida de Date
      }
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
}
