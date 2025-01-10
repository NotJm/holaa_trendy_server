import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import helmet from 'helmet';
import xss from 'xss-clean';
import csurf from 'csurf';
import cookieParse from 'cookie-parser';
import requestIp from 'request-ip'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(cookieParse());

  app.useGlobalPipes(new ValidationPipe());

  app.use(xss());

  app.use(csurf())

  app.use(helmet());

  app.use(requestIp.mw());

  mongoose.set('sanitizeFilter', true);

  await app.listen(
    configService.get<number>('PORT'),
    configService.get<string>('HOSTNAME'),
  );

  console.log(
    `Listen in http://${configService.get<string>('HOSTNAME')}:${configService.get<number>('PORT')}`,
  );
}

bootstrap();
