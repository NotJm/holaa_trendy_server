import { Expose, plainToInstance } from 'class-transformer';
import { Product } from '../entity/products.entity';

export class ProductResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  imgUri: string;

  @Expose()
  images: string[];
  
  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  discount: number;

  @Expose()
  finalPrice: number;

  @Expose()
  stock: number;

  @Expose()
  categoryName: string;

  @Expose()
  subCategoryName: string[];
  
  @Expose()
  sizesNames: string[];

  @Expose()
  colorsNames: string[];

}

export function toProductResponseDto(product: Product): ProductResponseDto {
  return plainToInstance(ProductResponseDto, {
    code: product.code,
    name: product.name,
    imgUri: product.imgUri,
    images: product.images.map(image => image.url),
    description: product.description,
    price: product.price, 
    discount: product.discount, 
    finalPrice: product.finalPrice, 
    stock: product.stock,
    categoryName: product.category.name, 
    subCategoryName: product.subCategories.map(subCat => subCat.name), 
    sizesNames: product.sizes.map(size => size.size),
    colorsNames: product.colors.map(color => color.hexCode), 
  });
}
