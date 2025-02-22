import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from './suppliers.entity';

@Entity('supplier_evaluations')
export class SupplierEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, { nullable: false })
  @JoinColumn()
  supplier: Supplier;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  rating: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  evaluationType: 'QUALITY' | 'DELIVERY' | 'PRICE' | 'SERVICE';

  @Column({ type: 'text', nullable: false })
  comments: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  evaluatedBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}