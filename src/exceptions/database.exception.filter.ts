import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError, EntityPropertyNotFoundError, QueryFailedError } from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError, EntityPropertyNotFoundError, EntityPropertyNotFoundError)
export class AllDataBaseExceptionsFilter implements ExceptionFilter {
  catch(exception: QueryFailedError | EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorMessage =
      exception instanceof HttpException
        ? typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : (exception.getResponse() as any).message
        : 'Un error desconocido ocurrio';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      error: {
        statusCode: status,
        error: exception.name || 'Error inesperado',
        message: errorMessage['message'] || "Error Inesperado",
        errors: exception.stack || null,
        timestamp: new Date().toLocaleDateString(),
        path: request ? request.url : null,
      },
    });
  }
}
