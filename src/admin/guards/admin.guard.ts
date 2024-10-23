import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate( context: ExecutionContext ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if(!roles) {
      return true;
    }
    

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no auntenticado');
    }

    if (!user.role) {
      throw new UnauthorizedException('Rol de usuario no definido');
    }

    if (!roles.includes(user.role)) {
      throw new UnauthorizedException('El acceso solo es para administradores');
    }

    return roles.includes(user.role);

  }
}
