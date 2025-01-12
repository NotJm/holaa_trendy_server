import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from '../../users/entity/users.entity';

@Entity('user_refresh_token')
export class RefreshToken {
    @PrimaryGeneratedColumn('increment', {
        type: 'bigint'
    })
    id: number;

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id'})
    userId: Users

    @Column({ unique: true, nullable: false })
    token: string;

    @Column({ nullable: true, type: 'date', default: null})
    expiresAt: Date;
}