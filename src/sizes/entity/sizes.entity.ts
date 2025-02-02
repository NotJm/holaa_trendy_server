import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * @property {string} id - Codigo de la talla
 * @property {string} description - Descripcion de la talla
 */
@Entity('sizes')
export class Sizes {
    @PrimaryColumn()
    size: string;

    @Column()
    description: string;

}