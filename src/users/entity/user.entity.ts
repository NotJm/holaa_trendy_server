import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ROLE } from '../../constants/contants';
import { Address } from "./address.entity";

 @Entity('users')
 export class Users {
    @PrimaryGeneratedColumn("uuid", {
        name: 'user_id',
    })
    id?: string;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false, length: 10 })
    phone?: string;

    @OneToOne(() => Address)
    @JoinColumn()
    address?: Address

    @Column({ nullable: false, length: 10, type: 'enum', enum: Object.values(ROLE), default: ROLE.USER })
    role?: ROLE

    @Column({ nullable: false, type: 'boolean', default: false })
    isVerified?: boolean;

    @Column({ nullable: false, type: 'boolean', default: false })
    isBlocked?: boolean;

    @Column({ nullable: true, type: 'date', default: null })
    blockExpiresAt?: Date;

 }