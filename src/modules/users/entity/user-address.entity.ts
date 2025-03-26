import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid', { name: 'address_id' })
  id?: string;

  @Column({ nullable: false, default: '' })
  address: string;

  @Column({ nullable: false, length: 10, default: '' })
  postCode: string;

  @Column({ nullable: false, default: '' })
  state: string;

  @Column({ nullable: false, default: '' })
  municipality: string;

  @Column({ nullable: false, default: '' })
  town: string;

  @Column({ nullable: false, default: '' })
  colony: string;

  @Column({ nullable: false, default: '' })
 description: string;

 @OneToOne(() => User, (user) => user.address)
 user: User;
}
