import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ default: 0 })
  login_count: number;

  @Column({ default: 0 })
  pdf_download_count: number;

  @Column({ nullable: true })
  last_activity_at: Date;

  @CreateDateColumn()
  created_at: Date;
}