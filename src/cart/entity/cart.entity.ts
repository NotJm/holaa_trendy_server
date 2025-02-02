import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Products } from '../../products/entity/products.entity';
import { Users } from '../../users/entity/users.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.carts)
  user: Users;

  @ManyToMany(() => Products)
  @JoinTable({
    name: 'cart_products',
    joinColumn: { name: 'card_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_code', referencedColumnName: 'code' }
  })
  product: Products[];

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}