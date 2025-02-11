import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity('user_otp')
export class UserOtp {
    @PrimaryGeneratedColumn('increment', {
        name: "otp_id",
        type: "integer",
    })
    id?: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id"})
    userId: User;

    @Column({ nullable: false })
    useCase: "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD";

    @Column({ nullable: false, length: 6, default: '' })
    otp: string;

    @Column({ nullable: true, type: 'date', default: null})
    expiresAt: Date;


}