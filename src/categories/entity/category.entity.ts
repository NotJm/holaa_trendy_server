import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from '../../products/entity/products.entity';
import { SubCategory } from '../../sub-categories/entity/sub-categories.entity';

/**
 * @property {number} id - Codigo del tipo de producto
 * @property {string} name - Nombre del tipo de producto
 * @property {string} description - Descripcion del tipo de producto
 */
@Entity('category')
export class Category {
  @PrimaryColumn()
  code: string;

  @Column({ nullable: false })
  description: string;

  @ManyToMany(() => SubCategory, (subCategory) => subCategory.categories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinTable({
    name: 'categories_to_subcategories',
    joinColumn: { name: 'category_code', referencedColumnName: 'code' },
    inverseJoinColumn: {
      name: 'sub_category_code',
      referencedColumnName: 'code',
    },
  })
  subCategories?: SubCategory[];

  @OneToMany(() => Products, (products) => products.category)
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
