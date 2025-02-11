import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entity/users.entity";

@Entity('user_refresh_token')
export class RefreshToken {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  @Index()
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date

  @CreateDateColumn({
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @ManyToOne(() => User, user => user.refreshTokens)
  user: User;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @Column({ type: 'varchar', nullable: true })
  deviceInfo: string;

  @Column({ type: 'inet', nullable: true })
  ipAddress: string;


}