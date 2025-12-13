import type StudentInterface from '@/types/StudentInterface';

export const getStudentsApi = async (): Promise<StudentInterface[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}students`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const students = await response.json() as StudentInterface[];
    return students;
  }
  catch (err) {
    console.log('>>> getGroupsApi', err);
    return [] as StudentInterface[];
  }
};

export const deleteStudentApi = async (studentId: number): Promise<number> => {
  console.log('deleteStudentApi', studentId);
  debugger;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}students/${studentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    console.log('deleteStudentApi ok', studentId);
    debugger;

    return studentId;
  }
  catch (err) {
    console.log('>>> deleteStudentApi', err);
    return -1;
  }
};

export const addStudentApi = async (student: StudentInterface): Promise<StudentInterface> => {
  debugger;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/';
    const response = await fetch(`${apiUrl}students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });

    debugger; 

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const result = await response.json() as StudentInterface;
    
    debugger; 

    return result;
  }
  catch (err) {
    debugger; 
    console.log('>>> addStudentApi', err);
    throw err;
  }
};
