import { BeforeInsert, BeforeUpdate, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity {
    @CreateDateColumn({ type: 'timestamptz' })
    createAt?: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updateAt?: Date;
}