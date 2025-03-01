import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Product } from '../../products/entity/products.entity';
import { SubCategory } from '../../sub-categories/entity/sub-categories.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ type: 'varchar', unique: true, nullable: false})
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ name: 'img_uri', type: 'varchar', nullable: false, default: '' })
  imageUri: string

  @ManyToMany(() => SubCategory, (subCategory) => subCategory.categories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinTable({
    name: 'categories_to_subcategories',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'subcategory_id',
      referencedColumnName: 'id',
    },
  })
  subCategories?: SubCategory[];

  @OneToMany(() => Product, (products) => products.category)
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
