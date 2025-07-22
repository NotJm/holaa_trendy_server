import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';
import { CartItem } from '../cart/entity/cart-item.entity';
import { Cart } from '../cart/entity/cart.entity';
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
import { SaleItem } from './entity/sale-item.entity';
import { Sale } from './entity/sale.entity';
import { StockDepletionTime } from './entity/stock-depletion-time.entity';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UsersModule,
    CartModule,
    TypeOrmModule.forFeature([
      Sale,
      SaleItem,
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
      StockDepletionTime,
    ]),
  ],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
