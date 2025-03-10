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
import { ProductImages } from '../products/entity/products-images.entity';
import { Product } from '../products/entity/products.entity';
import { ProductService } from '../products/product.service';
import { Size } from '../sizes/entity/sizes.entity';
import { SizesService } from '../sizes/sizes.service';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { SubCategoryService } from '../sub-categories/sub-category.service';
import { Incidents } from '../users/entity/incidents.entity';
import { User } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { UsersService } from '../users/users.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from './entity/cart.entity';
import { NewArrivals } from '../products/entity/new-arrivals.entity';
import { BestOffers } from '../products/entity/best-offers.entity';
import { BestSellers } from '../products/entity/best-sellers.entity';

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
      Incidents,
      ProductImages,
      CartItem,
      NewArrivals,
      BestOffers,
      BestSellers
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
  ],
  exports: [CartService],
})
export class CartModule {}
