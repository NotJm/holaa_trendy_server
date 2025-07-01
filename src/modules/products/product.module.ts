import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../categories/category.module';
import { Category } from '../categories/entity/category.entity';
import { CategorySaleTrend } from '../categories/entity/category_sale_trend.entity';
import { CategoryStockInitial } from '../categories/entity/category_stock_initial.entity';
import { ColorsModule } from '../colors/colors.module';
import { Color } from '../colors/entity/colors.entity';
import { Size } from '../sizes/entity/sizes.entity';
import { SizesModule } from '../sizes/sizes.module';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { SubCategoryModule } from '../sub-categories/sub-category.module';
import { BestOffers } from './entity/best-offers.entity';
import { BestSellers } from './entity/best-sellers.entity';
import { NewArrivals } from './entity/new-arrivals.entity';
import { ProductVariant } from './entity/product-variant.entity';
import { ProductImages } from './entity/products-images.entity';
import { Product } from './entity/products.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    CategoryModule,
    SubCategoryModule,
    SizesModule,
    ColorsModule,
    TypeOrmModule.forFeature([
      Product,
      Category,
      SubCategory,
      Size,
      Color,
      ProductImages,
      NewArrivals,
      BestOffers,
      BestSellers,
      CategoryStockInitial,
      CategorySaleTrend,
      ProductVariant
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
