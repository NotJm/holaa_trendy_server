import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../admin/audit/audit.service';
import { RegisterActionDto } from '../../admin/audit/dto/register.action.dto';

@Injectable()
export class AuditInterceptor implements NestInterceptor {

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const method = request.method;
    const user = request.user;
    const url = request.url;

    const { username } = user;

    return next.handle().pipe(
      
      tap(() => {
        
        if ((['POST', 'PUT', 'DELETE']).includes(method)) {
          const auditDto = new RegisterActionDto();
          auditDto.username = username;
          auditDto.date = new Date();
          auditDto.action = method
          auditDto.details = `El usuario ${username} realizo accion de tipo ${method} a la ruta ${url}`

          this.auditService.registerAction(auditDto)
        }
      })
    )
  }
}
