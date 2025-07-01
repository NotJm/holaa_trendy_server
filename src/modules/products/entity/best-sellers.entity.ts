import { Check, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('best_sellers', { synchronize: false })
@Check(
  '"price"::numeric > 0.0 AND "discount"::numeric >= 0 AND "discount"::numeric <= 100' ,
)
export class BestSellers {
  @PrimaryColumn({ name: 'product_code' })
  code: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'img_uri', type: 'varchar', nullable: false })
  imgUri: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({
    name: 'final_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  finalPrice?: number;

  @Column({ name: 'category_name', type: 'varchar', nullable: false })
  categoryName: string;

  @Column({ name: 'subcategory_name', type: 'varchar', nullable: false })
  subCategoryName: string;

  @Column({
    name: 'colors_names',
    type: 'character varying',
    array: true,
    nullable: false,
  })
  colorsNames: string[];

  @Column({
    name: 'sizes_names',
    type: 'character varying',
    array: true,
    nullable: false,
  })
  sizesNames: string[];
}
