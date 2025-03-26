import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entity/products.entity';
import { Sale } from './sale.entity';

@Entity('sale_items')
export class SaleItem {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Sale, sale => sale.saleItems, { nullable: false })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number; 

}