import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import { ormConfig } from './common/config/orm.config';
import { throttlerConfig } from './common/config/throttler.config';
import { AuditInterceptor } from './common/interceptor/audit.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { RedisModule } from './common/microservice/redis/redis.module';
import { DataBaseExceptionsFilter } from './exceptions/database.exception.filter';
import { HttpExceptionsFilter } from './exceptions/http.exception.filter';
import { CorsMiddleware } from './middleware/cors.middleware';
import { FaviconMiddleware } from './middleware/favicon.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/categories/category.module';
import { ColorsModule } from './modules/colors/colors.module';
import { ProductModule } from './modules/products/product.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { SaleModule } from './modules/sales/sale.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { SubCategoryModule } from './modules/sub-categories/sub-category.module';
import { UsersModule } from './modules/users/users.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { RecommendationModule } from './modules/products/recommendations/recommendations.module';

@Module({
  imports: [
    AuditModule,
    SaleModule,
    RedisModule,
    WishlistModule,
    PurchaseModule,
    CloudinaryModule,
    RecommendationModule,
    ProductModule,
    CartModule,
    SizesModule,
    ColorsModule,
    SubCategoryModule,
    CategoryModule,
    SettingsModule,
    AuthModule,
    UsersModule,
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
    AuditInterceptor,
    {
      provide: APP_FILTER,
      useClass: DataBaseExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(FaviconMiddleware).forRoutes('*');
  }
}
