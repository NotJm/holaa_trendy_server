import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import xss from 'xss-clean';
import csurf from 'csurf';
import requestIp from 'request-ip'
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.use(xss());

  app.use(helmet());

  app.use(requestIp.mw());

  // app.enableCors({
  //   origin: 'http://localhost:4200',
  //   credentials: true,
  // });

  await app.listen(
    configService.get<number>('PORT'),
    configService.get<string>('HOSTNAME'),
  );

  console.log(
    `Listen in http://${configService.get<string>('HOSTNAME')}:${configService.get<number>('PORT')}`,
  );
}

bootstrap();
