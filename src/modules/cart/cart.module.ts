import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpInfoService } from '../../common/microservice/ipinfo.service';
import { PwnedService } from '../../common/microservice/pwned.service';
import { CookieService } from '../../common/providers/cookie.service';
import { TokenService } from '../../common/providers/token.service';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entity/category.entity';
import { ColorsService } from '../colors/colors.service';
import { Color } from '../colors/entity/colors.entity';
import { BestOffers } from '../products/entity/best-offers.entity';
import { BestSellers } from '../products/entity/best-sellers.entity';
import { NewArrivals } from '../products/entity/new-arrivals.entity';
import { ProductImages } from '../products/entity/products-images.entity';
import { Product } from '../products/entity/products.entity';
import { ProductService } from '../products/product.service';
import { Size } from '../sizes/entity/sizes.entity';
import { SizesService } from '../sizes/sizes.service';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { SubCategoryService } from '../sub-categories/sub-category.service';
import { Incident } from '../users/entity/user-incident.entity';
import { User } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { UsersService } from '../users/users.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from './entity/cart.entity';
import { Argon2Service } from '../../common/providers/argon2.service';
import { RedisService } from '../../common/microservice/redis.service';
import { CategorySaleTrend } from '../categories/entity/category_sale_trend.entity';
import { CategoryStockInitial } from '../categories/entity/category_stock_initial.entity';
import { Address } from '../users/entity/user-address.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Cart,
      User,
      Product,
      Category,
      SubCategory,
      Color,
      Size,
      Incident,
      ProductImages,
      CartItem,
      NewArrivals,
      BestOffers,
      BestSellers,
      CategoryStockInitial,
      CategorySaleTrend,
      Address
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    CategoryService,
    SubCategoryService,
    ColorsService,
    SizesService,
    UsersService,
    ProductService,
    PwnedService,
    IncidentService,
    CookieService,
    TokenService,
    JwtService,
    IpInfoService,
    Argon2Service,
    RedisService
  ],
  exports: [CartService],
})
export class CartModule {}
