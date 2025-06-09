import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerApp } from '../common/logger/logger.service';
import { IApiRequest } from '../common/interfaces/api-request.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly loggerApp = new LoggerApp();

  use(req: IApiRequest, res: any, next: (error?: Error | any) => void) {
    const { method, originalUrl, ip } = req;
    console.log(req.user);
    const user = req.user ? req.user.userId : 'Guest';

    res.on('finish', () => {
      this.loggerApp.log(
        `[${method}] ${originalUrl} - User: ${user} - IP: ${ip} - Status: ${res.statusCode}`,
        'LoggerMiddleware',
      );
    });

    next();
  }
}
