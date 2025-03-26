import { Column, Entity, PrimaryGeneratedColumn, ViewEntity } from 'typeorm';


@ViewEntity('stock_depletion_time', { synchronize: false })
export class StockDepletionTime {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', name: 'Nombre de la categoría', nullable: false })
  categoryName: string;

  @Column({ type: 'bigint', name: "Stock Inicial", nullable: false })
  stockInit: number;

  @Column({ type: 'bigint', name: 'Ventas Marzo', nullable: false })
  salesMarch: number;

  @Column({ type: 'bigint', name: 'Ventas Abril', nullable: false })
  salesApril: number;

  @Column({ type: 'bigint', name: 'Tiempo Agotamiento', nullable: false })
  stockOut: number

}