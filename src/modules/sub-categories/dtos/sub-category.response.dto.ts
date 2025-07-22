import { Expose, plainToInstance } from 'class-transformer';
import { SubCategory } from '../entity/sub-categories.entity';

export class SubCategoryResponse {
  @Expose()
  name: string;

  @Expose()
  categoriesNames: string[];
}

export const toSubCategoryResponse = (
  subCategory: SubCategory,
): SubCategoryResponse => {
  return plainToInstance(SubCategoryResponse, {
    name: subCategory.name,
    categoriesNames: subCategory.categories.map((cat) => cat.name)
  })
};


