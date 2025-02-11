import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn("increment", {
        name: 'address_id',
        type: 'bigint', 
    })
    id?: number;

    @Column({ nullable: false, default: "" })
    address: string

    @Column({ nullable: false, length: 10, default: "" })
    postCode: string;

    @Column({ nullable: false, default: "" })
    state: string;

    @Column({ nullable: false, default: "" })
    municipality: string;

    @Column({ nullable: false, default: "" })
    town: string;

    @Column({ nullable: false, default: "" })
    colony: string;

    @Column({ nullable: false, default: "" })
    description: string


}