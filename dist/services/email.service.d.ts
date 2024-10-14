import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(to: string, resetToken: string): Promise<void>;
}
