import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApikeyGuard implements CanActivate {

  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>("API_KEY");

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Acceso no autorizado');
    }

    return true;

  }
}
