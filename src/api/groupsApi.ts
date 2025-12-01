import type GroupInterface from '@/types/GroupInterface';

export const getGroupsApi = async (): Promise<GroupInterface[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const groups = await response.json() as GroupInterface[];
    return groups;
  }
  catch (err) {
    console.log('>>> getGroupsApi', err);
    return [] as GroupInterface[];
  }
};

export const getGroupWithStudentsApi = async (groupId: number): Promise<GroupInterface> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups/${groupId}/students`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const group = await response.json() as GroupInterface;
    return group;
  }
  catch (err) {
    console.log('>>> getGroupWithStudentsApi', err);
    throw err;
  }
};