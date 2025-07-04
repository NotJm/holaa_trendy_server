import { ProductVariant } from 'src/modules/products/entity/product-variant.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entity/products.entity';
import { Cart } from './cart.entity';

@Entity('cart_item')
@Check('"quantity" > 0')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_code' })
  product: Product;

  @ManyToOne(() => ProductVariant, { eager: true })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;
}
