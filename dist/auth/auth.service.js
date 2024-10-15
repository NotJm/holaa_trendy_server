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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const incident_service_1 = require("../incident/incident.service");
const email_service_1 = require("../services/email.service");
let AuthService = class AuthService {
    constructor(userModel, jwtService, incidentService, emailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.incidentService = incidentService;
        this.emailService = emailService;
    }
    async register(userData) {
        const { username, password, email } = userData;
        const user = await this.userModel.findOne({ username });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new this.userModel({
                username: username,
                password: hashedPassword,
                email: email,
            });
            this.send_email_verification({ email });
            await newUser.save();
            return { message: 'Gracias por registrarse, hemos enviado un link de activacion de cuenta su correo' };
        }
        else {
            return { message: 'El usuario ya se encuentra registrado' };
        }
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const user = await this.userModel.findOne({ username });
        if (!user) {
            return { message: `El usuario ${username} no esta registrado, Por favor registrese` };
        }
        const userIncident = await this.incidentService.usernameIsBlocked({ username });
        if (userIncident && userIncident.isBlocked) {
            return {
                message: `Su cuenta ha sido bloqueada temporalmente. Podrá acceder nuevamente a las ${new Date(userIncident.blockExpiresAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.`
            };
        }
        if (!user.emailIsVerify) {
            return {
                message: "Estimado usuario, le solicitamos que verifique su cuenta para habilitar el acceso a nuestros servicios."
            };
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (isPasswordMatching) {
            const payload = { username: user.username, sub: user.id };
            const token = this.jwtService.sign(payload);
            return { message: 'Sesion Iniciada Exitosamente', access_token: token };
        }
        else {
            await this.incidentService.loginFailedAttempt(username);
            return { message: 'Credenciales Incorrectas' };
        }
    }
    async forgot_password(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { messsage: "El correo no estra registrado" };
        }
        const restToken = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
        await this.emailService.sendPasswordResetEmail(email, restToken);
        return { message: 'Se ha enviado un correo con el enlace de recuperación' };
    }
    async reset_password(resetPasswordDto) {
        const { token, new_password } = resetPasswordDto;
        try {
            const decoded = this.jwtService.verify(token);
            console.log(decoded);
            const user = await this.userModel.findById(decoded.id);
            console.log(user);
            if (!user) {
                return { message: 'Token invalido o expirado' };
            }
            const hashedPassword = await bcrypt.hash(new_password, 10);
            user.password = hashedPassword;
            await user.save();
            return { message: 'Contraseña actualiza exitosamente' };
        }
        catch (err) {
            throw new common_1.BadRequestException('Token invalido o expirado');
        }
    }
    async send_email_verification(sendEmailVerificationDto) {
        const { email } = sendEmailVerificationDto;
        await this.emailService.sendEmailVerification(email);
        return { message: "Se ha enviado un correo de verificacion" };
    }
    async verify_email(verifyEmailDto) {
        const { email } = verifyEmailDto;
        const user = await this.userModel.findOne({ email });
        user.emailIsVerify = true;
        await user.save();
        return { message: "La cuenta a sido verificada con exito " };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        incident_service_1.IncidentService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map