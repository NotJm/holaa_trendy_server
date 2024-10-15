export declare class LoginDto {
    username: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    new_password: string;
}
export declare class VerifyEmailDto {
    email: string;
}
export declare class SendEmailVerificationDto {
    email: string;
}
