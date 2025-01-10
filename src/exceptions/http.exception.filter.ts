import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import e from 'express';

@Catch(HttpException)
export class AllHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorMessage = exception.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      error: {
        statusCode: status,
        error: exception.name || 'Error Inesperado',
        message: errorMessage['message'] || "Error Inesperado",
        errors: exception.cause || null,
        timestamp: new Date().toLocaleDateString(),
        path: request ? request.url : null,
      }
    });
  }
}
