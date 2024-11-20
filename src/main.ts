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
    key: fs.readFileSync("src/ssl/holaatrendyserve-key.pem"),
    cert: fs.readFileSync("src/ssl/holaatrendyserve.pem")
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

  await app.listen(
    configService.get<number>("PORT"),
    configService.get<string>("HOSTNAME")
  );

  console.log(`Listen in https://${configService.get<string>("HOSTNAME")}:${configService.get<number>("PORT")}`,);
  
}

bootstrap();
