import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ROLE } from '../../../common/constants/contants';
import { RefreshToken } from '../../auth/entity/refresh-token.entity';
import { Cart } from '../../cart/entity/cart.entity';
import { Wishlist } from '../../wishlist/entity/wishlist.entity';
import { Incidents } from './incidents.entity';
import { Address } from './user-address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 13, default: '' })
  phone: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Object.values(ROLE),
    default: ROLE.USER,
  })
  role?: ROLE;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  secret: string;

  @Column({ name: 'is_activated', type: 'boolean', nullable: false, default: false })
  isActivated?: boolean;

  @Column({ name: 'is_blocked', type: 'boolean', nullable: false, default: false })
  isBlocked?: boolean;

  @Column({ name: 'block_expires_at', type: 'time with time zone', nullable: true, default: null })
  blockExpiresAt?: Date;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist?: Wishlist[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @OneToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  addressId?: Address;

  @OneToMany(() => Incidents, (incident) => incident.user, { nullable: true })
  incidents?: Incidents[];

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart?: Cart;
}
