import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
    sendEmailVerification(email: string): Promise<void>;
    sendOTPCode(to: string): Promise<void>;
}
