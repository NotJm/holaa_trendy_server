import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerApp } from '../common/logger/logger.service';
import { IApiRequest } from '../common/interfaces/api-request.interface';
import { HttpStatusCode } from 'axios';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly loggerApp = new LoggerApp();

  use(req: IApiRequest, res: any, next: (error?: Error | any) => void) {
    const { method, originalUrl, ip } = req;
    const user = req.user ? req.user.userId : 'Guest';

    res.on('finish', () => {
      if (res.statusCode === HttpStatusCode.Created || res.statusCode === HttpStatusCode.Ok)
        this.loggerApp.log(
          `[${method}] ${originalUrl} - User: ${user} - IP: ${ip} - Status: ${res.statusCode}`,
          'LoggerMiddleware',
        );
    });

    next();
  }
}
