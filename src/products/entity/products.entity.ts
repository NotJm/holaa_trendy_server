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
import { Category } from '../../categories/entity/category.entity';
import { Colors } from '../../colors/entity/colors.entity';
import { Sizes } from '../../sizes/entity/sizes.entity';
import { SubCategory } from '../../sub-categories/entity/sub-categories.entity';
import { Cart } from '../../cart/entity/cart.entity';

@Entity('products')
@Check('"price"::numeric > 0.0 AND "stock" > 0 ')
export class Products {
  @PrimaryColumn('varchar')
  code: string;

  @Index()
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'img_uri' })
  imgUri: string;

  @Column({
    type: 'simple-array',
    name: 'images',
    default: [],
    array: true,
    nullable: true,
  })
  images: string[];

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'money', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @ManyToMany(() => Sizes, { eager: true, cascade: true })
  @JoinTable({
    name: 'products_sizes',
    joinColumn: { name: 'product_code', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'size_code', referencedColumnName: 'size' },
  })
  sizes: Sizes[];

  @ManyToMany(() => Colors, { eager: true, cascade: true })
  @JoinTable({
    name: 'products_colors',
    joinColumn: { name: 'product_codee', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'color_code', referencedColumnName: 'color' },
  })
  colors: Colors[];

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
    name: 'products_subcategories',
    joinColumn: { name: 'product_code', referencedColumnName: 'code' },
    inverseJoinColumn: {
      name: 'subcategory_code',
      referencedColumnName: 'code',
    },
  })
  subCategories: SubCategory[];

  @OneToMany(() => Cart, (cart) => cart.product)
  cartItems?: Cart[];

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
}
