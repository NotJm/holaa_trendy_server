import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/entity/category.entity';
import { CategorySaleTrend } from '../categories/entity/category_sale_trend.entity';
import { CategoryStockInitial } from '../categories/entity/category_stock_initial.entity';
import { SubCategory } from './entity/sub-categories.entity';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubCategory,
      Category,
      CategoryStockInitial,
      CategorySaleTrend,
    ]),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, CategoryService],
  exports: [SubCategoryService]
})
export class SubCategoryModule {}
