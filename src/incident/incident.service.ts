import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { CloseIncidentDto, UsernameIsBlockedDto } from './incident.dto';

@Injectable()
export class IncidentService {
    constructor(@InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>) {}

    // TODO: Registrar una nueva incidencia
    async loginFailedAttempt(username: string): Promise<Incident> {
        const incident = await this.incidentModel.findOne({ username });

        if (incident) {
            const now = new Date();

            if (incident.isBlocked && now < incident.blockExpiresAt) {
                throw new ForbiddenException(
                    `La cuenta esta bloqueada. Intentalo nuevamente despues de ${new Date(incident.blockExpiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
                )
            }

            if (incident.isBlocked && now >= incident.blockExpiresAt) {
                incident.failedAttempts = 0;  // Reiniciar contador
                incident.isBlocked = false;   // Desbloquear cuenta
                incident.blockExpiresAt = null; // Limpiar fecha de bloqueo
            }

            incident.failedAttempts += 1;
            incident.lastAttempt = now;

            if (incident.failedAttempts > 5) {
                incident.isBlocked = true;
                incident.blockExpiresAt = new Date(now.getTime() + 20 * 60 * 1000);
            }

            return incident.save();
        } else {
            const newIncident = new this.incidentModel({
                username: username,
                failedAttempts: 1,
                lastAttempt: new Date(),
            });
            return newIncident.save();
        }
    }

    //TODO: Obtener una incidencia
    async getOpenIncident(): Promise<Incident[]> {
        return this.incidentModel.find({ status: 'open' }).exec();
    }

    //TODO: Cerrar una incidencia
    async closeIncident(closeIncidentDto: CloseIncidentDto): Promise<Incident> {
        const { username } = closeIncidentDto;
        return this.incidentModel.findOneAndUpdate(
            { username },
            { status: 'close', failedAttempts: 0, isBlocked: false, blockExpiresAt: null },
            { new: true},
        ).exec();
    }

    //TODO: Buscar si el usuario tiene bloqueada la cuenta
    async usernameIsBlocked(usernameIsBlockedDto: UsernameIsBlockedDto): Promise<Incident> {
        const { username } = usernameIsBlockedDto;
        const incident = await this.incidentModel.findOne({ username });
        return incident;
    }
}
