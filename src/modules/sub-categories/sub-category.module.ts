import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entity/sub-categories.entity';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { Category } from '../categories/entity/category.entity';
import { CategoryService } from '../categories/category.service';
import { CategoryStockInitial } from '../categories/entity/category_stock_initial.entity';
import { CategorySaleTrend } from '../categories/entity/category_sale_trend.entity';

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
})
export class SubCategoriyModule {}
