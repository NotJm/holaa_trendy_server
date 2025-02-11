import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Cart } from '../../cart/entity/cart.entity';
import { Shipping } from '../../shipping/entity/shipping.entity';

@Entity()
export class PurchaseHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'PENDING' })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'PROCESSING' })
  purchaseStatus: string;

  @ManyToOne(() => Cart, { nullable: false })
  @JoinColumn()
  cart: Cart;

  @OneToOne(() => Shipping, { nullable: false })
  @JoinColumn()
  shipping: Shipping;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;
}