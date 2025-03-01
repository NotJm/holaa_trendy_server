import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity('colors')
export class Color {
    @PrimaryGeneratedColumn('uuid')
    id?: number;

    @Column({ type: 'varchar', length: 30 })
    name: string;

    @Column({ name: 'hex_code', type: 'varchar', length: 7 })
    hexCode: string

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

}