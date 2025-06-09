import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';
import { LoggerApp } from '../common/logger/logger.service';

@Catch(
  QueryFailedError,
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  EntityPropertyNotFoundError,
  TypeORMError,
)
export class DataBaseExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerApp: LoggerApp) {}

  catch(
    exception: QueryFailedError | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
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

    this.loggerApp.error(
      `TypeOrm Error: ${errorMessage['message']}`,
      exception.stack,
      'DataBaseExceptionsFilter',
    );

    response.status(status).json({
      error: {
        statusCode: status,
        error: 'Error de servidor',
        message: errorMessage['message'] || 'Error Inesperado',
        timestamp: new Date().toLocaleDateString(),
      },
    });
  }
}
