import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  size: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
