"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const incident_schema_1 = require("../schemas/incident.schema");
let IncidentService = class IncidentService {
    constructor(incidentModel) {
        this.incidentModel = incidentModel;
    }
    async loginFailedAttempt(username) {
        const incident = await this.incidentModel.findOne({ username });
        if (incident) {
            const now = new Date();
            if (incident.isBlocked && now < incident.blockExpiresAt) {
                throw new common_1.ForbiddenException(`La cuenta esta bloqueada. Intentalo nuevamente despues de ${new Date(incident.blockExpiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`);
            }
            if (incident.isBlocked && now >= incident.blockExpiresAt) {
                incident.failedAttempts = 0;
                incident.isBlocked = false;
                incident.blockExpiresAt = null;
            }
            incident.failedAttempts += 1;
            incident.lastAttempt = now;
            if (incident.failedAttempts > 5) {
                incident.isBlocked = true;
                incident.blockExpiresAt = new Date(now.getTime() + 20 * 60 * 1000);
            }
            return incident.save();
        }
        else {
            const newIncident = new this.incidentModel({
                username: username,
                failedAttempts: 1,
                lastAttempt: new Date(),
            });
            return newIncident.save();
        }
    }
    async getOpenIncident() {
        return this.incidentModel.find({ status: 'open' }).exec();
    }
    async closeIncident(closeIncidentDto) {
        const { username } = closeIncidentDto;
        return this.incidentModel.findOneAndUpdate({ username }, { status: 'close', failedAttempts: 0, isBlocked: false, blockExpiresAt: null }, { new: true }).exec();
    }
    async usernameIsBlocked(usernameIsBlockedDto) {
        const { username } = usernameIsBlockedDto;
        const incident = await this.incidentModel.findOne({ username });
        return incident;
    }
};
exports.IncidentService = IncidentService;
exports.IncidentService = IncidentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(incident_schema_1.Incident.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IncidentService);
//# sourceMappingURL=incident.service.js.map