import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Product } from '../../products/entity/products.entity';
import { User } from '../../../modules/users/entity/users.entity';
import { WishListItem } from './wishlist-item.entity';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @OneToOne(() => User, (user) => user.wishlist)
  @JoinColumn()
  user: User;

  @OneToMany(() => WishListItem, (wishListItem) => wishListItem.wishlist, {
    cascade: true,
  })
  wishListItems?: WishListItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: Date;
}
