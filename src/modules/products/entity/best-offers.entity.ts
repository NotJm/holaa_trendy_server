import { Check, ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'best_offers', synchronize: false })
@Check(
  '"price"::numeric > 0.0 AND "stock" > 0 AND "discount"::numeric >= 0 AND "discount"::numeric <= 100',
)
export class BestOffers {
  @ViewColumn({ name: 'code' })
  code: string;

  @ViewColumn({ name: 'product_name' })
  productName: string;

  @ViewColumn({ name: 'img_uri' })
  imgUri: string;

  @ViewColumn({ name: 'product_images'})
  images: string[]

  @ViewColumn()
  description: string;

  @ViewColumn()
  price: number;

  @ViewColumn()
  discount: number;

  @ViewColumn({
    name: 'final_price',
  })
  finalPrice?: number;

  @ViewColumn({ name: 'category_name' })
  categoryName: string;

  @ViewColumn({
    name: 'subcategories_names',
  })
  subCategoriesNames: string[];

  @ViewColumn({
    name: 'color_name',
  })
  colorName: string;

  @ViewColumn({
    name: 'sizes_names',
  })
  sizesNames: string[];
}
