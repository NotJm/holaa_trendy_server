import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entity/category.entity';
import { ColorsService } from '../colors/colors.service';
import { Color } from '../colors/entity/colors.entity';
import { Size } from '../sizes/entity/sizes.entity';
import { SizesService } from '../sizes/sizes.service';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { ProductImages } from './entity/products-images.entity';
import { Product } from './entity/products.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SubCategoryService } from '../sub-categories/sub-category.service';
import { NewArrivals } from './entity/new-arrivals.entity';
import { BestOffers } from './entity/best-offers.entity';
import { BestSellers } from './entity/best-sellers.entity';
import { CategoryStockInitial } from '../categories/entity/category_stock_initial.entity';
import { CategorySaleTrend } from '../categories/entity/category_sale_trend.entity';

@Module({
  imports: [
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
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    CategoryService,
    SubCategoryService,
    SizesService,
    ColorsService,
  ],
})
export class ProductModule {}
