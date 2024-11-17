import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParse from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {

  const httpsOptions = {
    key: fs.readFileSync("src/ssl/server.local-key.pem"),
    cert: fs.readFileSync("src/ssl/server.local.pem")
  }
  
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  const configService = app.get(ConfigService);
  
  app.use(cookieParse());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));
    
  app.use(xss()); 

  app.use(helmet());

  mongoose.set('sanitizeFilter', true);

  await app.listen(configService.get<number>("PORT"), "server.local");

  console.log(`Listen in https://server.local:${configService.get<number>("PORT")}`,);
  
}

bootstrap();
