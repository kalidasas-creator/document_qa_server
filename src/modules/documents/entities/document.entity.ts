import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ default: 0 })
  ingestionPercent: number;
  @Column({ default: '' })
  ingestionStatus: string;
  @Column({ default: '' })
  detail: string;
  @CreateDateColumn()
  createdAt: Date;
}