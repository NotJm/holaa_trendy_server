import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<any>;
    register(userData: User): Promise<any>;
    forgot_password(forgotPassworDto: ForgotPasswordDto): Promise<any>;
    reset_password(resetPasswordDto: ResetPasswordDto): Promise<any>;
}
