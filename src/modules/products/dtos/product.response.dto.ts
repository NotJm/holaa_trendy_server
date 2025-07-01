import { Expose, plainToInstance } from 'class-transformer';
import { Product } from '../entity/products.entity';
import { IProductVariantsInterface } from '../interface/variants.interface';

/**
 * Defined DTO for sending product information to the website
 */
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

  @Expose()
  variants: IProductVariantsInterface[];
}

/**
 * Handle the logic for creating a ProductResponseDto instance
 * @param product The product entity that contain information about product
 * @returns A new instance for sending to the website
 */
export const toProductResponseDto = (product: Product): ProductResponseDto => {
  return plainToInstance(ProductResponseDto, {
    code: product.code,
    name: product.name,
    imgUri: product.imgUri,
    images: product.images?.map((image) => image.url) || [],
    description: product.description,
    price: product.price,
    discount: product.discount,
    finalPrice: product.finalPrice,
    categoryName: product.category?.name || null,
    subCategoryName: product.subCategories?.map((subCat) => subCat.name) || [],
    variants: product.productVariant.map((variant) => {
      return {
        size: variant.size.size,
        color: variant.color.name,
        stock: variant.stock,
      };
    }),
  });
}
