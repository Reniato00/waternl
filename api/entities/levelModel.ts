import { Column, PrimaryGeneratedColumn ,Entity } from "typeorm";

@Entity()
export class Level {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    damId: number;
    @Column('float')
    level: number;
    @Column()
    timestamp: Date;
}