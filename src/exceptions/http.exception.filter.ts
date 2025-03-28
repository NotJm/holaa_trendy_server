import { LoggerApp } from '../common/logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  @Inject(LoggerApp) private readonly loggerApp: LoggerApp;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorMessage = exception.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      typeof errorMessage === 'object' && 'message' in errorMessage
        ? errorMessage['message']
        : 'Error inesperado';

    const errorData = {
      statusCode: status,
      error: 'Error al momento de procesar la solicitud',
      message: message,
    };

    this.loggerApp.error(
      `HTTP Error (${status}): ${JSON.stringify(errorData)} - PATH: ${request.url}`,
    );

    response.status(status).json(errorData);
  }
}
