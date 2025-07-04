import { Color } from "src/modules/colors/entity/colors.entity";
import { Size } from "src/modules/sizes/entity/sizes.entity";
import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Product } from "./products.entity";

@Entity('products_variants')
@Check('"stock" > 0')
@Unique(['product', 'size'])
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'product_code'})
  product: Product;

  @ManyToOne(() => Size, { eager: true })
  @JoinColumn({ name: 'size_id'})
  size: Size

  @Column({ type: 'int', default: 0})
  stock: number;


}