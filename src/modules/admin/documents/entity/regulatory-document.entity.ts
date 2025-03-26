import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DOCUMENT_STATE, DOCUMENT_TYPE } from '../../../../common/constants/contants';

@Entity('regulatory_documents')
export class RegulatoryDocument {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', nullable: false })
  url: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;

  @Column({ name: 'version', type: 'varchar', nullable: false, default: "1.0" })
  version: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: Object.values(DOCUMENT_TYPE),
  })
  type: DOCUMENT_TYPE;

  @Column({
    name: 'state',
    type: 'enum',
    enum: Object.values(DOCUMENT_STATE),
    default: DOCUMENT_STATE.ACTIVED,
  })
  state: DOCUMENT_STATE;

  @Column({ name: 'effective_date', type: 'timestamptz', nullable: false })
  effectiveDate: Date;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;
}
