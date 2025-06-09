import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/users.entity';
import { ACTIONS_TYPE } from '../../../common/constants/contants';

@Entity('audit')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    name: 'action',
    nullable: false,
    enum: Object.values(ACTIONS_TYPE),
  })
  action: ACTIONS_TYPE;

  @Column({ type: 'varchar' })
  module: string;

  @Column({ type: 'varchar', name: 'entity_id', nullable: true })
  entityId: string;

  @Column({ type: 'json', name: 'old_value', nullable: true })
  oldValue: any;

  @Column({ type: 'json', name: 'new_value', nullable: true })
  newValue: any;

  @Column({
    type: 'cidr',
    name: 'ip_address',
    nullable: true,
  })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
