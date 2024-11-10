import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
    // Primeramente obtenemos la peticion en esta esta puesta nuestra cookie de authenticacion
    const request = context.switchToHttp().getRequest<Request>();

    // Despues accedenmos a ella mediante als cookies
    const token = request.cookies['authentication'];

    // Checamos si existe el token, si no regresamos un error de token de autenticacion no encontrado
    if (!token) {
      throw new UnauthorizedException('Token de autenticacion no encontrado')
    }

    try {
      // Configuramos el secreto
      const secret = this.configService.get<string>('SECRET_KEY');
      // Decodificamo el token para obtener los datos dentro
      const payload = this.jwtService.verify(token, { secret: secret });

      // Añadimos a la peticion para uso posterior
      request.user = payload;

      return true;
    } catch (e) {
      throw new UnauthorizedException(`Token de autenticacion invalido o expirado`);
    }
  }

}
