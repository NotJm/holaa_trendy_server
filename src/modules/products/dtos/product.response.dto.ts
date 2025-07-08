import { Expose, plainToInstance } from 'class-transformer';
import { IColor } from 'src/modules/colors/interface/color.interface';
import { BestOffers } from '../entity/best-offers.entity';
import { BestSellers } from '../entity/best-sellers.entity';
import { NewArrivals } from '../entity/new-arrivals.entity';
import { Product } from '../entity/products.entity';
import { IProductVariantsSizes } from '../interface/variants.interface';

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
  categoryName: string;

  @Expose()
  subCategoriesNames: string[];

  @Expose()
  color: IColor;

  @Expose()
  variants: IProductVariantsSizes[];
}

export class FeaturedProductResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  imgUri: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  discount: number;

  @Expose()
  finalPrice: number;

  @Expose()
  categoryName: string;

  @Expose()
  subCategoriesNames: string[];

  @Expose()
  colorName: string;

  @Expose()
  sizeNames: string[];
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
    categoryName: product.category.name || "",
    subCategoriesNames: product.subCategories.map((subCat) => subCat.name) || [],
    color: {
      name: product.color.name,
      hexCode: product.color.hexCode,
    },
    variants:
      product.variants.map((variant) => {
        return {
          sizeName: variant.size.name || "",
          stock: variant.stock,
        };
      }) || [],
  });
};

export const toFeaturedProductResponseDto = (
  featured: BestOffers | BestSellers | NewArrivals,
) => {
  return plainToInstance(FeaturedProductResponseDto, {
    code: featured.code,
    name: featured.productName,
    imgUri: featured.imgUri,
    description: featured.description,
    price: featured.price,
    discount: featured.discount,
    finalPrice: featured.finalPrice,
    categoryName: featured.categoryName,
    subCategoriesNames: featured.subCategoriesNames,
    colorName: featured.colorName,
    sizeNames: featured.sizesNames
  });
};
