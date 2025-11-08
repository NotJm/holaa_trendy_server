import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entity/products.entity';
import { Order } from './orders.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_code' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

}
