import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParse from 'cookie-parser';
import { COOKIE_AGE } from './common/constants/enviroment.contants';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  app.enableCors({
    origin: "https://slategray-jay-602961.hostingersite.com/", 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true,
    
  });


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
        sameSite: 'lax',
        maxAge: COOKIE_AGE
      }
    })
  )

  app.use(xss()); 

  app.use(cookieParse());

  app.use(helmet());

  mongoose.set('sanitizeFilter', true);

  await app.listen(configService.get<number>("PORT"));


  
}

bootstrap();
