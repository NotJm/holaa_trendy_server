import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from './users.entity';

@Entity()
export class Incidents {
    @PrimaryGeneratedColumn('increment', {
        name: 'incident_id',
        type: 'bigint'
    })
    id?: number

    @Column()
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt?: Date;

    @ManyToOne(() => User, (user) => user.incidents)
    user: User;
    


}