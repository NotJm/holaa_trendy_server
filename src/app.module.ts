import { WishlistModule } from './modules/wishlist/wishlist.module';
import { WishlistController } from './modules/wishlist/wishlist.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module'
import { ormConfig } from './common/config/orm.config';
import { LoggerApp } from './common/providers/logger.service';
import { AllDataBaseExceptionsFilter } from './exceptions/database.exception.filter';
import { AllHttpExceptionsFilter } from './exceptions/http.exception.filter';
import { CorsMiddleware } from './middleware/cors.middleware';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { CartModule } from './modules/cart/cart.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { ColorsModule } from './modules/colors/colors.module';
import { SubCategoriyModule } from './modules/sub-categories/sub-category.module';
import { CategoryModule } from './modules/categories/category.module';
import { SettingsModule } from './modules/settings/settings.module';
import { MFAModule } from './modules/mfa/mfa.module';
import { ProductModule } from './modules/products/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    WishlistModule,
    PurchaseModule,
    WishlistModule,
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ormConfig(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [WishlistController, AppController],
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
      useClass: LoggerApp,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
