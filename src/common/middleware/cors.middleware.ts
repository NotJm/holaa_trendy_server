import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigin = 'https://slategray-jay-602961.hostingersite.com/';  // Cambia esto al origen de tu frontend

    // Establecer el origen permitido de forma explícita
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    
    // Habilitar credenciales (cookies, tokens, etc.)
    res.header('Access-Control-Allow-Credentials', 'true');

    // Métodos permitidos
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    
    // Cabeceras permitidas
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Disposition');

    // Manejar preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  }
}
