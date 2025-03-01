import { Expose } from "class-transformer";
import { Category } from "../entity/category.entity";

export class CategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  desription: string;

  @Expose()
  imgUri: string;
}

export function toCategoryResponseDto(category: Category): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    desription: category.description,
    imgUri: category.imageUri,
  }
}