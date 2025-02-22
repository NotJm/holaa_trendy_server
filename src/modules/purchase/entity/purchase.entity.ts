import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';
import { Supplier } from '../../suppliers/entity/suppliers.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'PENDING' })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'ORDERED' })
  purchaseStatus: string;

  @ManyToOne(() => Supplier, { nullable: false })
  @JoinColumn()
  supplier: Supplier;

  @OneToMany(() => PurchaseItem, item => item.purchase)
  items: PurchaseItem[];

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  invoiceNumber: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;
}