import { Check, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('new_arrivals', { synchronize: false })
@Check(
  '"price"::numeric > 0.0  AND "discount"::numeric >= 0 AND "discount"::numeric <= 100',
)
export class NewArrivals {
  @PrimaryColumn({ name: 'code' })
  code: string;

  @Column({ type: 'varchar', name: 'product_name', nullable: false })
  productName: string;

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

  @Column({
    name: 'subcategories_names',
    type: 'character varying',
    nullable: false,
  })
  subCategoriesNames: string[];

  @Column({
    name: 'color_name',
    type: 'character varying',
    nullable: false,
  })
  colorName: string;

  @Column({
    name: 'sizes_names',
    type: 'character varying',
    nullable: false,
  })
  sizesNames: string[];
}
