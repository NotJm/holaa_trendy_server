import { Color } from "src/modules/colors/entity/colors.entity";
import { Size } from "src/modules/sizes/entity/sizes.entity";
import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Product } from "./products.entity";

@Entity('products_variants')
@Check('"stock" > 0')
@Unique(['product', 'size', 'color'])
export class ProductVariant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Product, (product) => product.productVariant, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'product_id'})
  product: Product;

  @ManyToOne(() => Size, { eager: true})
  @JoinColumn({ name: 'size_id'})
  size: Size

  @ManyToOne(() => Color, { eager: true })
  @JoinColumn({ name: 'color_id'})
  color: Color;
  
  @Column({ type: 'int', default: 0})
  stock: number;


}