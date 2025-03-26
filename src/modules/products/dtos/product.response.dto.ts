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
    images: product.images?.map(image => image.url) || [], // Evita error si images es undefined
    description: product.description,
    price: product.price, 
    discount: product.discount, 
    finalPrice: product.finalPrice, 
    stock: product.stock,
    categoryName: product.category?.name || null, // Evita error si category es undefined
    subCategoryName: product.subCategories?.map(subCat => subCat.name) || [], // Evita error si subCategories es undefined
    sizesNames: product.sizes?.map(size => size.size) || [], // Evita error si sizes es undefined
    colorsNames: product.colors?.map(color => color.hexCode) || [], // Evita error si colors es undefined
  });
}
