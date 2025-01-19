import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products-types')
export class ProductsTypes {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string

}