import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Category } from '../../categories/entity/category.entity';
import { Product } from '../../products/entity/products.entity';

@Entity('sub_categories')
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @ManyToMany(() => Category, (category) => category.subCategories, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  categories?: Category[];

  @ManyToMany(() => Product, (product) => product.subCategories)
  products?: Product[];

  @CreateDateColumn({
    nullable: false,
    type: 'timestamptz', 
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;
}
