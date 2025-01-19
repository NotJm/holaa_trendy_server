import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ROLE } from '../../common/constants/contants';
import { Incidents } from './incidents.entity';
import { Address } from "./user-address.entity";

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

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, length: 13, default: "" })
    phone: string;

    @Column({ nullable: false, type: 'enum', enum: Object.values(ROLE), default: ROLE.USER })
    role?: ROLE

    @Column({ nullable: false, type: 'boolean', default: false })
    isVerified?: boolean;

    @Column({ nullable: false, type: 'boolean', default: false })
    isBlocked?: boolean;

    @Column({ nullable: true, type: 'time with time zone', default: null })
    blockExpiresAt?: Date;

    @OneToOne(() => Address)
    @JoinColumn({ name: "address_id" })
    address?: Address

    @OneToMany(() => Incidents, (incident) => incident.user, { nullable: true })
    incidents?: Incidents[];

 }