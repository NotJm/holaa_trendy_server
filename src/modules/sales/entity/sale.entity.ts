import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../modules/users/entity/users.entity';
import { SaleItem } from './sale-item.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.sale)
  saleItems?: SaleItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt?: Date;
}
