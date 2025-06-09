import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpInfoService } from '../../common/microservice/ipinfo.service';
import { PwnedService } from '../../common/microservice/pwned.service';
import { RedisService } from '../../common/microservice/redis/redis.service';
import { Argon2Service } from '../../common/providers/argon2.service';
import { CookieService } from '../../common/providers/cookie.service';
import { TokenService } from '../auth/providers/token.service';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entity/category.entity';
import { CategorySaleTrend } from '../categories/entity/category_sale_trend.entity';
import { CategoryStockInitial } from '../categories/entity/category_stock_initial.entity';
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
import { Address } from '../users/entity/user-address.entity';
import { Incident } from '../users/entity/user-incident.entity';
import { User } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { UsersService } from '../users/users.service';
import { WishListItem } from './entity/wishlist-item.entity';
import { Wishlist } from './entity/wishlist.entity';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([
      Wishlist,
      WishListItem,
      User,
      Incident,
      Product,
      ProductImages,
      NewArrivals,
      BestOffers,
      BestSellers,
      Category,
      SubCategory,
      Color,
      Size,
      CategoryStockInitial,
      CategorySaleTrend,
      Address
    ]),
  ],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    ProductService,
    CategoryService,
    SubCategoryService,
    SizesService,
    ColorsService,
  ],
  exports: [WishlistService],
})
export class WishlistModule {}
