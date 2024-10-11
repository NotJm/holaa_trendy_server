import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from '../interface/user.interface';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() userData: IUser) {
        return this.authService.login(userData);
    }

    @Post('signup')
    async register(@Body() userData:IUser) {
        return this.authService.register(userData);
    }
}
