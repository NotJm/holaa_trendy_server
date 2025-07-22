import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../categories/category.module';
import { Category } from '../categories/entity/category.entity';
import { CategorySaleTrend } from '../categories/entity/category_sale_trend.entity';
import { CategoryStockInitial } from '../categories/entity/category_stock_initial.entity';
import { ColorsModule } from '../colors/colors.module';
import { Color } from '../colors/entity/colors.entity';
import { BestOffers } from '../products/entity/best-offers.entity';
import { BestSellers } from '../products/entity/best-sellers.entity';
import { NewArrivals } from '../products/entity/new-arrivals.entity';
import { ProductImages } from '../products/entity/products-images.entity';
import { Product } from '../products/entity/products.entity';
import { ProductModule } from '../products/product.module';
import { Size } from '../sizes/entity/sizes.entity';
import { SizesModule } from '../sizes/sizes.module';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { SubCategoryModule } from '../sub-categories/sub-category.module';
import { Address } from '../users/entity/user-address.entity';
import { Incident } from '../users/entity/user-incident.entity';
import { User } from '../users/entity/users.entity';
import { UsersModule } from '../users/users.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from './entity/cart.entity';
import { ProductVariant } from '../products/entity/product-variant.entity';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    SizesModule,
    ColorsModule,
    ProductModule,
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
      Address,
      ProductVariant,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
