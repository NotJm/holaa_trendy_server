import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('products')
export class Products {
    @PrimaryColumn({ name: 'code'})
    code: string;

    @Column({ name: 'img_uri', nullable: false })
    imgUri: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false, type: 'double', unsigned: true })
    price: number;

    @Column({ nullable: false, type: 'integer', unsigned: true })
    stock: number;

    @Column({ nullable: false, type: 'array', default: []})
    size: string[]
}