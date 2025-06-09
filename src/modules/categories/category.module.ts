import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entity/category.entity';
import { CategoryStockInitial } from './entity/category_stock_initial.entity';
import { CategorySaleTrend } from './entity/category_sale_trend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryStockInitial, CategorySaleTrend])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
