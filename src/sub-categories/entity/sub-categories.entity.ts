import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entity/category.entity';
import { Products } from '../../products/entity/products.entity';

@Entity('sub_category')
export class SubCategory {
  @PrimaryColumn({ name: 'code' })
  code: string;

  @ManyToMany(() => Category, (category) => category.subCategories, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinTable({
    name: 'categories_to_subcategories',
    joinColumn: { name: 'sub_category_code', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'category_code', referencedColumnName: 'code' },
  })
  categories?: Category[];

  @ManyToMany(() => Products, (product) => product.subCategories)
  products?: Products[];

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
