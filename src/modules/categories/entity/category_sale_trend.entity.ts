import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('category_sale_trend', { synchronize: false })
export class CategorySaleTrend {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  categoryId: string;

  @Column({ name: 'category_name', type: 'varchar', nullable: false })
  categoryName: string;

  @Column({ type: 'int', nullable: false })
  month: number;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ name: 'total_sales', type: 'int', nullable: false })
  totalSales: number;

  @Column({ name: 'total_order', type: 'int', nullable: false })
  totalOrder: number;
}