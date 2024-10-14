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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentSchema = exports.Incident = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Incident = class Incident {
};
exports.Incident = Incident;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Incident.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Incident.prototype, "failedAttempts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Incident.prototype, "lastAttempt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "open" }),
    __metadata("design:type", String)
], Incident.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Incident.prototype, "isBlocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Incident.prototype, "blockExpiresAt", void 0);
exports.Incident = Incident = __decorate([
    (0, mongoose_1.Schema)()
], Incident);
exports.IncidentSchema = mongoose_1.SchemaFactory.createForClass(Incident).set('versionKey', false);
//# sourceMappingURL=incident.schema.js.map