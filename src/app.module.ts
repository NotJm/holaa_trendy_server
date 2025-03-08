import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { ormConfig } from './common/config/orm.config';
import { throttlerConfig } from './common/config/throttler.config';
import { AllDataBaseExceptionsFilter } from './exceptions/database.exception.filter';
import { AllHttpExceptionsFilter } from './exceptions/http.exception.filter';
import { CorsMiddleware } from './middleware/cors.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/categories/category.module';
import { ColorsModule } from './modules/colors/colors.module';
import { MFAModule } from './modules/mfa/mfa.module';
import { ProductModule } from './modules/products/product.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { SubCategoriyModule } from './modules/sub-categories/sub-category.module';
import { UsersModule } from './modules/users/users.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    WishlistModule,
    PurchaseModule,
    CloudinaryModule,
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
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ormConfig(configService),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot(throttlerConfig())
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
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
