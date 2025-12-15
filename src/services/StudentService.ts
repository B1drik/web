import AppDataSource from '@/db/AppDataSource';
import { Student } from '@/db/entity/Student.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';

export class StudentService {
  private get repository(): ReturnType<typeof AppDataSource.getRepository> {
    // Check if AppDataSource is initialized
    // if (!AppDataSource.isInitialized) {
    //   throw new Error('AppDataSource is not initialized');
    // }
    // await dbInit();
    return AppDataSource.getRepository(Student);
  }

  async getStudents(): Promise<StudentInterface[]> {
    const students = await this.repository.find({ relations: ['group'] });
    return students as StudentInterface[];
  }

  async getStudentById(id: number): Promise<Student | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['group'],
    }) as Student | null;
  }

  async deleteStudent(studentId: number): Promise<number> {
    await this.repository.delete(studentId);
    return studentId;
  }

  async addStudent(studentFields: Omit<StudentInterface, 'id'>): Promise<StudentInterface> {
    // Используем insert, чтобы избежать построения графа зависимостей (циклы при save)
    const insertResult = await this.repository.insert({
      firstName: studentFields.firstName,
      lastName: studentFields.lastName,
      middleName: studentFields.middleName,
      contacts: studentFields.contacts ?? '',
      groupId: studentFields.groupId,
      uuid: studentFields.uuid,
    });

    const newId = insertResult.identifiers[0]?.id;
    return await this.repository.findOne({
      where: { id: newId },
      relations: ['group'],
    }) as StudentInterface;
  }

  async addRandomStudents(amount: number = 10): Promise<StudentInterface[]> {
    const students: StudentInterface[] = [];

    for (let i = 0; i < amount; i++) {
      const fio = getRandomFio();

      const newStudent = await this.addStudent({
        ...fio,
        contacts: 'contact',
        groupId: Math.floor(Math.random() * 4) + 1,
      });
      students.push(newStudent);

      console.log(newStudent);
    }

    return students;
  }
}

export const studentService = new StudentService();

