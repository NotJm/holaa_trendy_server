import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from 'src/modules/audit/audit.service';
import { AuditMeta } from '../decorators/audit-log.decorator';
import { IApiRequest } from '../interfaces/api-request.interface';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<IApiRequest>();

    const handler = context.getHandler();
    const auditMeta: AuditMeta | undefined = Reflect.getMetadata(
      'audit',
      handler,
    );

    return next.handle().pipe(
      tap(async (response) => this.handleSuccess(response, request, auditMeta)),
    );
  }

  private async handleSuccess(
    response: any,
    request: IApiRequest,
    auditMeta: AuditMeta,
  ): Promise<void> {
    if (!auditMeta) return;

    await this.auditService.registerLog(
      request.user.userId,
      auditMeta.action,
      auditMeta.module,
      auditMeta.getEntityId?.(response),
      auditMeta.oldValue || null,
      response || null,
    );
  }
}
