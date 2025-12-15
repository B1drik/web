import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Student } from './Student.entity';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  contacts!: string;

  // Используем функцию-стрелку для ленивой загрузки Student
  // Это работает в production, так как TypeORM вызывает функцию во время выполнения
  @OneToMany(() => require('./Student.entity').Student, (student: Student) => student.group, { cascade: false })
  students!: Student[];
}