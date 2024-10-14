import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from './auth.dto';
import { IncidentService } from 'src/incident/incident.service';
import { EmailService } from 'src/services/email.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private incidentService;
    private emailService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, incidentService: IncidentService, emailService: EmailService);
    register(userData: User): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    forgot_password(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    reset_password(resetPasswordDto: ResetPasswordDto): Promise<any>;
}
