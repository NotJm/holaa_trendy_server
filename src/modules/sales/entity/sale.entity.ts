import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { SaleItem } from './sale-item.entity';
import { User } from '../../../modules/users/entity/users.entity';
import { Shipping } from '../../shipping/entity/shipping.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'PENDING' })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'PROCESSING' })
  saleStatus: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  customer: User;

  @OneToMany(() => SaleItem, item => item.sale)
  items: SaleItem[];

  @OneToOne(() => Shipping, { nullable: false })
  @JoinColumn()
  shipping: Shipping;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;
}