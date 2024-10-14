import { IncidentService } from './incident.service';
import { CloseIncidentDto, RegisterIncidentDto } from './incident.dto';
export declare class IncidentController {
    private readonly incidentService;
    constructor(incidentService: IncidentService);
    registerFailedAttempt(registerIncidentDto: RegisterIncidentDto): Promise<import("../schemas/incident.schema").Incident>;
    getOpenIncident(): Promise<import("../schemas/incident.schema").Incident[]>;
    closeOpenIncident(closeIncidentDto: CloseIncidentDto): Promise<import("../schemas/incident.schema").Incident>;
}
