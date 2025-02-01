import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryService } from 'src/sub-categories/sub-category.service';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entity/category.entity';
import { Colors } from '../colors/entity/colors.entity';
import { Sizes } from '../sizes/entity/sizes.entity';
import { SubCategory } from '../sub-categories/entity/sub-categories.entity';
import { Products } from './entity/products.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SizesService } from '../sizes/sizes.service';
import { ColorsService } from '../colors/colors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Category, SubCategory, Sizes, Colors]),
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
