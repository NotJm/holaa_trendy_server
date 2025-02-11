import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ShippingHistory } from './shipping-history.entity';
import { Address } from '../../users/entity/user-address.entity';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Address, { nullable: false })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ type: 'varchar', length: 100, nullable: false })
  recipientName: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  recipientPhone: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  shippingMethod: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ type: 'date', nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'PENDING' })
  status: string;

  @OneToMany(() => ShippingHistory, (history) => history.shipping)
  shippingHistory: ShippingHistory[];

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;
}