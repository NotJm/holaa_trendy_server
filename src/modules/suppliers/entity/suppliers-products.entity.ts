import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from './suppliers.entity';
import { Product } from '../../products/entity/products.entity';

@Entity('supplier_products')
export class SupplierProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, { nullable: false })
  @JoinColumn()
  supplier: Supplier;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn()
  product: Product;

  @Column({ type: 'varchar', length: 100, nullable: true })
  supplierProductCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  purchasePrice: number;

  @Column({ type: 'int', nullable: true })
  minimumOrderQuantity: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}