import { Group } from './entity/Group.entity';
import { Student } from './entity/Student.entity';
import AppDataSource from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';
import type StudentInterface from '@/types/StudentInterface';

// Получаем репозитории только после инициализации DataSource
const getGroupRepository = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error('DataSource is not initialized. Call dbInit() first.');
  }
  return AppDataSource.getRepository(Group);
};

const getStudentRepository = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error('DataSource is not initialized. Call dbInit() first.');
  }
  return AppDataSource.getRepository(Student);
};

/**
 * Получение групп
 * @returns  Promise<GroupInterface[]>
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const groupRepository = getGroupRepository();
  const studentRepository = getStudentRepository();
  
  const groups = await groupRepository.find();
  
  const groupsWithStudents = await Promise.all(
    groups.map(async (group) => {
      const students = await studentRepository.find({
        where: { groupId: group.id }
      });
      return {
        ...group,
        students
      };
    })
  );
  
  return groupsWithStudents;
};

/**
 * Получение группы со студентами
 * @returns  Promise<GroupInterface>
 */
export const getGroupWithStudentsDb = async (groupId: number): Promise<GroupInterface | null> => {
  const groupRepository = getGroupRepository();
  const studentRepository = getStudentRepository();
  
  const group = await groupRepository.findOne({
    where: { id: groupId }
  });
  
  if (!group) return null;
  
  const students = await studentRepository.find({
    where: { groupId: group.id }
  });
  
  return {
    ...group,
    students
  };
};

/**
 * Добавление группы
 * @returns  Promise<GroupInterface>
 */
export const addGroupsDb = async (groupFields: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  const groupRepository = getGroupRepository();
  const group = new Group();
  const newGroup = await groupRepository.save({
    ...group,
    ...groupFields,
  });

  return newGroup;
};