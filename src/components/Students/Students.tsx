'use client';

import { useRef } from 'react';
import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import AddStudent, { type FormFields, type AddStudentRef } from './AddStudent/AddStudent';
import { v4 as uuidv4 } from 'uuid';

const Students = (): React.ReactElement => {
  const addStudentRef = useRef<AddStudentRef>(null);

  const {
    students,
    deleteStudentMutate,
    addStudentMutate,
  } = useStudents({
    onAddSuccess: () => {
      alert('Студент успешно добавлен!');
      addStudentRef.current?.resetForm();
    },
  });

  /**
   * Удаление студента - обработчик события нажатия "удалить"
   * @param studentId Ид студента
   */
  const onDeleteHandler = (studentId: number): void => {
    if (confirm('Удалить студента?')) {
      console.log('onDeleteHandler', studentId);
      debugger;

      deleteStudentMutate(studentId);
    }
  };

  /**
   * Добавления студента - обработчик события нажатия "добавить"
   * @param studentFormField Форма студента
   */
  const onAddHandler = (studentFormField: FormFields): void => {
    console.log('Добавление студента', studentFormField);
    debugger;

    addStudentMutate({
      id: -1,
      ...studentFormField,
      uuid: uuidv4(),
    });
  };

  return (
    <div className={styles.Students}>
      <AddStudent ref={addStudentRef} onAdd={onAddHandler} />

      {students.map((student: StudentInterface) => (
        <Student
          key={student.id || student.uuid}
          student={student}
          onDelete={onDeleteHandler}
        />
      ))}
    </div>
  );
};

export default Students;