import { Model } from 'mongoose';
import { Incident, IncidentDocument } from 'src/schemas/incident.schema';
import { CloseIncidentDto, UsernameIsBlockedDto } from './incident.dto';
export declare class IncidentService {
    private incidentModel;
    constructor(incidentModel: Model<IncidentDocument>);
    loginFailedAttempt(username: string): Promise<Incident>;
    getOpenIncident(): Promise<Incident[]>;
    closeIncident(closeIncidentDto: CloseIncidentDto): Promise<Incident>;
    usernameIsBlocked(usernameIsBlockedDto: UsernameIsBlockedDto): Promise<Incident>;
}
