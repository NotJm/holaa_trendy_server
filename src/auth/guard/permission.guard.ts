import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasPermission = this.checkUserPermission('permissions', '')
    return hasPermission;
  }

  checkUserPermission(user, action) {
    return user.permission.includes(action);
  }
}
