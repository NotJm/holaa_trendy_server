import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './purchase.entity';

@Entity('purchase_history')
export class PurchaseHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Purchase, { nullable: false })
  @JoinColumn()
  purchase: Purchase;

  @Column({ type: 'varchar', length: 20, nullable: false })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;
}