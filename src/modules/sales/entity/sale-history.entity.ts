import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity('sale_history')
export class SaleHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sale, { nullable: false })
  @JoinColumn()
  sale: Sale;

  @Column({ type: 'varchar', length: 20, nullable: false })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;
}