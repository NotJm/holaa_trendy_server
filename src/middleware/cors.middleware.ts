import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que controla los accesos de origen asi como el CORS
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigin = this.configService.get<string>('FRONTEND_URI');  

    res.header('Access-Control-Allow-Origin', allowedOrigin);
    
    res.header('Access-Control-Allow-Credentials', 'true');

    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
    );
    
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization, Content-Disposition'
    );

    if (req.method === 'OPTIONS') {
      res.sendStatus(200).end();
      return 
    }

    next();
  }
}