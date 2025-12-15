import { Student } from './entity/Student.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import AppDataSource from './AppDataSource';

// Получаем репозиторий только после инициализации DataSource
const getStudentRepository = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error('DataSource is not initialized. Call dbInit() first.');
  }
  return AppDataSource.getRepository(Student);
};

/**
 * Получение студентов
 * @returns Promise<StudentInterface[]>
 */
export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const studentRepository = getStudentRepository();
  return await studentRepository.find({
    relations: ['group']
  });
};

/**
 * Удаления студента
 * @param studentId ИД удаляемого студента
 * @returns Promise<number>
 */
export const deleteStudentDb = async (studentId: number): Promise<number> => {
  const studentRepository = getStudentRepository();
  await studentRepository.delete(studentId);
  return studentId;
};

/**
 * Добавление студента
 * @param studentField поля студента
 * @returns Promise<StudentInterface>
 */
export const addStudentDb = async (studentFields: Omit<StudentInterface, 'id'>): Promise<StudentInterface> => {
  const studentRepository = getStudentRepository();
  
  // Создаем студента только с необходимыми полями, без связанных объектов
  const studentData: any = {
    firstName: studentFields.firstName,
    lastName: studentFields.lastName,
    middleName: studentFields.middleName,
    contacts: studentFields.contacts || '',
    groupId: studentFields.groupId,
  };
  
  if (studentFields.uuid) {
    studentData.uuid = studentFields.uuid;
  }

  // insert, чтобы избежать построения графа зависимостей (циклы при save)
  const insertResult = await studentRepository.insert(studentData);
  const newId = insertResult.identifiers[0]?.id;

  // Загружаем студента с группой для возврата полных данных
  return await studentRepository.findOne({
    where: { id: newId },
    relations: ['group']
  }) as StudentInterface;
};

/**
 * Добавление рандомных студента
 * @param amount количество рандомных записей
 * @returns Promise<StudentInterface>
 */
export const addRandomStudentsDb = async (amount: number = 10): Promise<StudentInterface[]> => {
  const students: StudentInterface[] = [];

  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();

    const newStudent = await addStudentDb({
      ...fio,
      contacts: 'contact',
      groupId: 1,
    });
    students.push(newStudent);
  }

  return students;
};