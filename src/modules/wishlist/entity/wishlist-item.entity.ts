import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { Product } from '../../products/entity/products.entity';

@Entity('wishlist_item')
export class WishListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.wishListItems, {
    onDelete: 'CASCADE',
  })
  wishlist: Wishlist;

  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  product: Product;
}
