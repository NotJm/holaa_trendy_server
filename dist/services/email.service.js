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
exports.EmailService = void 0;
const nodemailer = require("nodemailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('EMAIL_USERNAME'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
        });
    }
    async sendPasswordResetEmail(to, resetToken) {
        const url = `http://localhost:3000reset_password?token=${resetToken}`;
        await this.transporter.sendMail({
            to,
            subject: '🔒 Restablecimiento de Contraseña - HOLAA',
            html: `
        <p>Estimado usuario,</p>
        <p>Hemos recibido una solicitud para restablecer su contraseña. Si no realizó esta solicitud, puede ignorar este mensaje.</p>
        <p>Para restablecer su contraseña, haga clic en el siguiente enlace:</p>
        <a href="${url}" style="color: #4CAF50;">Restablecer Contraseña</a>
        <p>Este enlace es válido por 30 minutos.</p>
        <p>Atentamente,</p>
        <p><strong>El equipo de HOLAA</strong></p>
      `,
        });
    }
    async sendEmailVerification(email) {
        const url = `http://localhost:3000verify_email?email=${email}`;
        await this.transporter.sendMail({
            to: email,
            subject: '📧 Verificación de Cuenta - HOLAA',
            html: `
        <p>Estimado usuario,</p>
        <p>¡Gracias por registrarse en <strong>HOLAA</strong>! Para completar su registro, necesitamos que verifique su dirección de correo electrónico.</p>
        <p>Haga clic en el siguiente enlace para verificar su cuenta:</p>
        <a href="${url}" style="color: #4CAF50;">Verificar Cuenta</a>
        <p>Si no realizó esta solicitud, puede ignorar este mensaje.</p>
        <p>Atentamente,</p>
        <p><strong>El equipo de HOLAA</strong></p>
      `,
        });
    }
    async sendOTPCode(to) {
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map