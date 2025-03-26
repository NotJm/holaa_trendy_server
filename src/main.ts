import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression'
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.use(compression());

  // TODO Implementar proteccion contra ataques XSS, CSRF, IP SPOOFING, DDOS, etc


  await app.listen(
    configService.get<number>('PORT'),
    configService.get<string>('HOSTNAME'),
  );

  console.log(
    `Listen in http://${configService.get<string>('HOSTNAME')}:${process.env.PORT}`,
  );
}

bootstrap();
