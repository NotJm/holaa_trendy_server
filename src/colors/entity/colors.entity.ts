import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * @property {string} id - Codigo del color
 * @property {string} description - Descripcion del color
 */
@Entity('colors')
export class Colors {
    @PrimaryColumn()
    color: string;

    @Column()
    description: string
}