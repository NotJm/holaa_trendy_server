import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/users.entity';

@Entity('user_refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Column({ type: 'varchar', unique: true, nullable: false })
  @Index()
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp with time zone', nullable: true })
  expiresAt: Date;

  @Column({ name: 'revoked', type: 'boolean', default: false })
  revoked?: boolean;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent: string;

  @Column({ name: 'ip', type: 'cidr', nullable: true })
  ip: string;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;
}
