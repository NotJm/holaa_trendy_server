import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import helmet from 'helmet';
import csurf from 'csurf';
import xss from 'xss-clean';
import cookieParse from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.enableCors({
    origin: "http://localhost:4200", 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true,
    
  });

  // app.use('/auth/login', rateLimit({
  //   windowMs: 15 * 60 * 1000,
  //   max: 5,
  //   message: 'Demasiadas solicitudes, desde esta IP, intentelo mas tarde',
  //   standardHeaders: true,
  //   legacyHeaders: false,
  // }))

  app.use(
    cookieSession({
      name: 'session',
      keys: [
        configService.get<string>("MASTER_COOKIE_KEY_V1"),
        configService.get<string>("MASTER_COOKIE_KEY_V2")
      ],
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  )

  app.use(xss()); 

  app.use(cookieParse());

  app.use(helmet());

  // app.use(csurf({ cookie: true }));

  mongoose.set('sanitizeFilter', true);

  await app.listen(configService.get<number>("PORT"));


  
}

bootstrap();
