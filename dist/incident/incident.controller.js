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
exports.IncidentController = void 0;
const common_1 = require("@nestjs/common");
const incident_service_1 = require("./incident.service");
const incident_dto_1 = require("./incident.dto");
let IncidentController = class IncidentController {
    constructor(incidentService) {
        this.incidentService = incidentService;
    }
    async registerFailedAttempt(registerIncidentDto) {
        return this.incidentService.loginFailedAttempt(registerIncidentDto.username);
    }
    async getOpenIncident() {
        return this.incidentService.getOpenIncident();
    }
    async closeOpenIncident(closeIncidentDto) {
        return this.incidentService.closeIncident(closeIncidentDto);
    }
};
exports.IncidentController = IncidentController;
__decorate([
    (0, common_1.Post)('incident'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_dto_1.RegisterIncidentDto]),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "registerFailedAttempt", null);
__decorate([
    (0, common_1.Get)('open'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "getOpenIncident", null);
__decorate([
    (0, common_1.Post)('close'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_dto_1.CloseIncidentDto]),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "closeOpenIncident", null);
exports.IncidentController = IncidentController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [incident_service_1.IncidentService])
], IncidentController);
//# sourceMappingURL=incident.controller.js.map