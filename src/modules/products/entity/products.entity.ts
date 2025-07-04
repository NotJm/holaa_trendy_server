import { Color } from 'src/modules/colors/entity/colors.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from '../../cart/entity/cart-item.entity';
import { Category } from '../../categories/entity/category.entity';
import { SubCategory } from '../../sub-categories/entity/sub-categories.entity';
import { ProductVariant as ProductVariantSize } from './product-variant.entity';
import { ProductImages } from './products-images.entity';

@Entity('products')
@Check(
  '"price"::numeric > 0.0 AND "discount"::numeric >= 0 AND "discount"::numeric <= 100',
)
export class Product {
  @PrimaryColumn('varchar')
  code: string;

  @Index()
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'img_uri' })
  imgUri: string;

  @Column({ type: 'text' })
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

  @OneToMany(() => ProductImages, (productImage) => productImage.product, {
    cascade: true,
  })
  images?: ProductImages[];

  @ManyToOne(() => Color, (color) => color.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true
  })
  @JoinColumn({ name: 'color' })
  color: Color

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'category' })
  category: Category;

  @ManyToMany(() => SubCategory, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinTable({
    name: 'products_to_subcategories',
    joinColumn: { name: 'product_id', referencedColumnName: 'code' },
    inverseJoinColumn: {
      name: 'subcategory_id',
      referencedColumnName: 'id',
    },
  })
  subCategories: SubCategory[];

  @OneToMany(() => ProductVariantSize, (pvz) => pvz.product, {
    cascade: true,
  })
  variants: ProductVariantSize[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems?: CartItem[];

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;
}
