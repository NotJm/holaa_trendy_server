import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Shipping } from './shipping.entity';

@Entity()
export class ShippingHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shipping, (shipping) => shipping.shippingHistory, { nullable: false })
  @JoinColumn()
  shipping: Shipping;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;
}