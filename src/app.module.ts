import {
    MiddlewareConsumer,
    Module,
    NestModule
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './categories/category.module';
import { ColorsModule } from './colors/colors.module';
import { LoggerApp } from './common/providers/logger.service';
import { ormConfig } from './config/orm.config';
import { AllDataBaseExceptionsFilter } from './exceptions/database.exception.filter';
import { AllHttpExceptionsFilter } from './exceptions/http.exception.filter';
import { MFAModule } from './mfa/mfa.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { ProductModule } from './products/product.module';
import { SettingsModule } from './settings/settings.module';
import { SizesModule } from './sizes/sizes.module';
import { SubCategoriyModule } from './sub-categories/sub-category.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CartModule,
    SizesModule,
    ColorsModule,
    SubCategoriyModule,
    CategoryModule,
    SettingsModule,
    MFAModule,
    ProductModule,
    AuthModule,
    UsersModule,
    MFAModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ormConfig(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllDataBaseExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    {
      provide: 'LoggerService',
      useClass: LoggerApp
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
