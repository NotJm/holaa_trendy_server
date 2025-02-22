import { HttpException, HttpStatus } from "@nestjs/common";
import { IApiResponse } from "./interfaces/api.response.interface";

export abstract class BaseController {

  protected handleError(error: unknown): IApiResponse {

    if (error instanceof HttpException) {
      return {
        status: error.getStatus(),
        message: error.message,
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Hubo un problema al momento de procesar la solicitud',
      error: error instanceof Error ? error.message : "Error desconocido"
    }

  }

}