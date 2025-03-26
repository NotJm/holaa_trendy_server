import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { IApiResponse } from './interfaces/api.response.interface';
import { LoggerApp } from './logger/logger.service';

export abstract class BaseController {
  @Inject(LoggerApp) protected readonly loggerApp: LoggerApp

  protected handleError(error: unknown): IApiResponse {
    if (error instanceof Error && !(error instanceof HttpException)) {
      this.loggerApp.error(
        `Error del servidor: ${error.message || 'Error desconocido'}`,
        error.stack || null,
        'BaseController',
      );
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Hubo un problema al momento de procesar la solicitud',
        error:  'Hubo un problema al momento de procesar la solicitud',
      };
    }

    throw error;
  }

}
