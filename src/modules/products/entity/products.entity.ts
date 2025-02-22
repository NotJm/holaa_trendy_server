import {
  BeforeInsert,
  BeforeUpdate,
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
import { Color } from '../../colors/entity/colors.entity';
import { Size } from '../../sizes/entity/sizes.entity';
import { SubCategory } from '../../sub-categories/entity/sub-categories.entity';
import { ProductImages } from './products-images.entity';

@Entity('products')
@Check('"price"::numeric > 0.0 AND "stock" > 0 AND "discount"::numeric >= 0 AND "discount"::numeric <= 100')
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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  finalPrice?: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @OneToMany(() => ProductImages, (productImage) => productImage.product, {
    cascade: true,
  })
  images?: ProductImages[];

  @ManyToMany(() => Size, { eager: true, cascade: true })
  @JoinTable({
    name: 'products_to_sizes',
    joinColumn: { name: 'product_id', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'size_id', referencedColumnName: 'id' },
  })
  sizes: Size[];

  @ManyToMany(() => Color, { eager: true, cascade: true })
  @JoinTable({
    name: 'products_to_colors',
    joinColumn: { name: 'product_id', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'color_id', referencedColumnName: 'id' },
  })
  colors: Color[];

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

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems?: CartItem[];

  @CreateDateColumn({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateFinalPrice() {
    this.finalPrice = this.price * (1 - this.discount / 100);
  }
}
