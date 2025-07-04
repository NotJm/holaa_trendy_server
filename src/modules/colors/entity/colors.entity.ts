import { Product } from 'src/modules/products/entity/products.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id?: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ name: 'hex_code', type: 'varchar', length: 7 })
  hexCode: string;

  @OneToMany(() => Product, (products) => products.color)
  products?: Product[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
