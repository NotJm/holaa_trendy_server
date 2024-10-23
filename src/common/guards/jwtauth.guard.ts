import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private jwtService:     JwtService,
    private configService : ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Autorizacion faltante o invalida')
    }
    
    const token = authHeader.split(' ')[1];

    if (!token) {
      return false;
    }

    
    try {
      const user = this.jwtService.verify(token, { 
          secret: this.configService.get<string>('SECRET_KEY')
      });
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token no valido o expirado');
    }
  }
}
