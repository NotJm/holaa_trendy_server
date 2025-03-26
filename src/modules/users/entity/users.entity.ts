import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ACCOUNT_STATE, ROLE } from '../../../common/constants/contants';
import { RefreshToken } from '../../auth/entity/refresh-token.entity';
import { Cart } from '../../cart/entity/cart.entity';
import { Wishlist } from '../../wishlist/entity/wishlist.entity';
import { Address } from './user-address.entity';
import { Incident } from './user-incident.entity';

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

  @Column({ type: 'varchar', unique: true, nullable: false, length: 13, default: '' })
  phone: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Object.values(ROLE),
    default: ROLE.USER,
  })
  role?: ROLE;

  @Column({
    name: 'account_state',
    type: 'enum',
    enum: Object.values(ACCOUNT_STATE),
    default: ACCOUNT_STATE.DESACTIVED,
  })
  accountState?: ACCOUNT_STATE;

  @Column({
    name: 'block_expires_at',
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  blockExpiresAt?: Date;

  @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
  wishlist?: Wishlist[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @OneToOne(() => Address, (address) => address.user)
  @JoinColumn({ name: 'address_id' })
  address?: Address;

  @OneToMany(() => Incident, (incident) => incident.user, { nullable: true })
  incidents?: Incident[];

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart?: Cart;
}
