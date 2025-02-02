import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entity/sub-categories.entity';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { Category } from '../categories/entity/category.entity';
import { CategoryService } from '../categories/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory, Category])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, CategoryService],
})
export class SubCategoriyModule {}
