import { LogService } from './common/services/log.service';
import { SocialModule } from './admin/social/social.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CorsMiddleware } from './middleware/cors.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PolicyModule } from './admin/politicas/policy.module';
import { DrModule } from './admin/dr/dr.module';

@Module({
  imports: [
    PolicyModule, 
    AuthModule,
    SocialModule,
    UsersModule,
    DrModule,

    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('DATABASE'),
      }),
      inject: [ConfigService],
    }),

  ],
  controllers: [AppController], 
  providers: [
        LogService, AppService],
  exports: [LogService]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
