import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from '../../../users/entity/users.entity';

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

    @ManyToOne(() => Users, (user) => user.incidents)
    user: Users;
    


}