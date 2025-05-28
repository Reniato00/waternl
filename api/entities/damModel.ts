// api/models/Dam.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Dam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name?: string;

  @Column()
  location?: string;

  @Column('float')
  capacity?: number;

  @Column('float')
  currentLevel?: number;

  @Column()
  constructionDate?: Date;

  @Column({ type: 'datetime', nullable: true })
  lastUpdate?: Date;
}
