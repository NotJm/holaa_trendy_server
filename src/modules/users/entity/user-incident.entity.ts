import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  INCIDENT_STATE,
  INCIDENTS_TYPE,
} from '../../../common/constants/contants';
import { User } from './users.entity';

@Entity('user_incident')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, (user) => user.incidents)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Object.values(INCIDENTS_TYPE),
    default: INCIDENTS_TYPE.LOGIN_FAILED,
  })
  type: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Object.values(INCIDENT_STATE),
    default: INCIDENT_STATE.PENDING,
  })
  state: string;

  @Column({
    type: 'cidr',
    nullable: false,
  })
  ip: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  geolocalization: string;

  @Column({ name: 'user_agent', type: 'varchar', nullable: false })
  userAgent: string;

  @Column({ name: 'attempts_failed', type: 'integer', nullable: false })
  failedAttempts: number;

  @Column({
    name: 'report_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  reportDate?: Date;

  @Column({ name: 'resolution_date', type: 'timestamp', default: null })
  resolutionDate?: Date;
}
