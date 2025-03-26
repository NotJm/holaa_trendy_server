import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerApp } from 'src/common/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly loggerApp = new LoggerApp();

  use(req: any, res: any, next: (error?: Error | any) => void) {
    const { method, originalUrl, ip } = req;

    const user = req.user ? req.user.id : 'Guest';

    res.on('finish', () => {
      this.loggerApp.log(`[${method}] ${originalUrl} - User: ${user} - IP: ${ip} - Status: ${res.statusCode}`)
    })

    next();

  }
}
