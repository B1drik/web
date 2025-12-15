import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Group } from './Group.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: '' })
  uuid?: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  middleName!: string;

  @Column({ default: '' })
  contacts?: string;

  @Column()
  groupId!: number;

  // Используем функцию-стрелку для ленивой загрузки Group
  // Это работает в production, так как TypeORM вызывает функцию во время выполнения
  @ManyToOne(() => require('./Group.entity').Group, { nullable: true, cascade: false })
  @JoinColumn({ name: 'groupId' })
  group?: Group;
}