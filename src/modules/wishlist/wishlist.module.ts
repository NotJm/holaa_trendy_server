import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { Module } from '@nestjs/common';
import { Wishlist } from './entity/wishlist.entity';
import { WishListItem } from './entity/wishlist-item.entity';
import { UsersService } from '../users/users.service';
import { ProductService } from '../products/product.service';
import { User } from '../users/entity/users.entity';
import { Product } from '../products/entity/products.entity';
import { PwnedService } from '../../common/providers/pwned.service';
import { IncidentService } from '../users/incident.service';
import { CookieService } from '../../common/providers/cookie.service';
import { TokenService } from '../../common/providers/token.service';
import { JwtService } from '@nestjs/jwt';
import { CategoryService } from '../categories/category.service';
import { SubCategoryService } from '../sub-categories/sub-category.service';
import { SizesService } from '../sizes/sizes.service';
import { ColorsService } from '../colors/colors.service';
import { ProductImages } from '../products/entity/products-images.entity';
import { NewArrivals } from '../products/entity/new-arrivals.entity';
import { BestOffers } from '../products/entity/best-offers.entity';
import { BestSellers } from '../products/entity/best-sellers.entity';
import { Category } from '../categories/entity/category.entity';
import { Color } from '../colors/entity/colors.entity';
import { Size } from '../sizes/entity/sizes.entity';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { HttpModule } from '@nestjs/axios';
import { Incidents } from '../users/entity/incidents.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Wishlist,
      WishListItem,
      User,
      Incidents,
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
    JwtService,
  ],
  exports: [WishlistService],
})
export class WishlistModule {}
