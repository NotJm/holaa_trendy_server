import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieService } from '../../common/providers/cookie.service';
import { PwnedService } from '../../common/providers/pwned.service';
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
import { WishListItem } from './entity/wishlist-item.entity';
import { Wishlist } from './entity/wishlist.entity';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { IpInfoService } from '../../common/providers/ipinfo.service';

@Module({
  imports: [
    HttpModule,
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
    UsersService,
    PwnedService,
    IncidentService,
    CookieService,
    TokenService,
    IpInfoService,
    JwtService,
  ],
  exports: [WishlistService],
})
export class WishlistModule {}
