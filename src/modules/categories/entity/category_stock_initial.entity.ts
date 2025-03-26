import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('category_stock_initial', { synchronize: false })
export class CategoryStockInitial {
  @PrimaryGeneratedColumn('uuid', { name : 'category_id'})
  categoryId: string;

  @Column({ name: 'category_name', type: 'varchar', nullable: false })
  categoryName: string;

  @Column({ type: 'int', nullable: false })
  month: number;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ name: 'initial_stock', type: 'int', nullable: false })
  initialStock: number;


}
