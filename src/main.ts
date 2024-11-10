import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParse from 'cookie-parser';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  
  app.use(cookieParse());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));
    
  app.use(xss()); 

  app.use(helmet());

  mongoose.set('sanitizeFilter', true);

  await app.listen(configService.get<number>("PORT"));

  console.log(`Listen in http://localhost:${configService.get<number>("PORT")}`,);
  
}

bootstrap();
