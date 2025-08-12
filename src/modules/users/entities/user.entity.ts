import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'viewer' })
  role: 'admin' | 'editor' | 'viewer';

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}