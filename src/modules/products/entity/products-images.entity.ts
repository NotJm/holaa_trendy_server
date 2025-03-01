import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products.entity";
import { Exclude } from "class-transformer";

@Entity('products_to_images')
export class ProductImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Product, {  onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_code', referencedColumnName: 'code' })
  @Exclude()
  product: Product;
}