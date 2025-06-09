import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { nestjsConfig } from './common/config/nestjs.config';
import { AuditInterceptor } from './common/interceptor/audit.interceptor';
import csurf from 'csurf'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, nestjsConfig());

  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // app.use(csurf({ cookie: true }));

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(app.get(AuditInterceptor));

  app.use(compression());

  // TODO Implementar proteccion contra ataques XSS, CSRF, IP SPOOFING, DDOS, etc

  await app.listen(
    configService.get<number>('PORT'),
    configService.get<string>('HOSTNAME'),
  );

  console.log(
    `✅ Server running on http://${configService.get<string>('HOSTNAME')}:${configService.get<number>('PORT')}`,
  );
}

bootstrap();
