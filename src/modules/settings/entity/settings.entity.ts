import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {

    @PrimaryGeneratedColumn('increment', {
        name: 'setting_id'
    })
    id?: number;

} 