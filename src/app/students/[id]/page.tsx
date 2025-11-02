'use client';

import { useParams } from 'next/navigation';
import useStudents from '@/hooks/useStudents';
import BackButton from '@/components/BackButton/BackButton';
import Page from '@/components/layout/Page/Page';
import styles from './page.module.scss';

const StudentDetailPage = (): React.ReactElement => {
  const params = useParams();
  const id = Number(params.id);
  const { students } = useStudents();

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <Page>
        <BackButton href="/students">← К списку студентов</BackButton>
        <div>Студент не найден</div>
      </Page>
    );
  }

  return (
    <Page>
      <BackButton href="/students">← К списку студентов</BackButton>
      
      <div className={styles.studentInfo}>
        <h1>Информация о студенте</h1>
        
        <div className={styles.field}>
          <label>ID:</label>
          <span>{student.id}</span>
        </div>
        
        <div className={styles.field}>
          <label>Фамилия:</label>
          <span>{student.lastName}</span>
        </div>
        
        <div className={styles.field}>
          <label>Имя:</label>
          <span>{student.firstName}</span>
        </div>
        
        <div className={styles.field}>
          <label>Отчество:</label>
          <span>{student.middleName}</span>
        </div>
        
        <div className={styles.field}>
          <label>Группа ID:</label>
          <span>{student.groupId}</span>
        </div>
        
       
      </div>
    </Page>
  );
};

export default StudentDetailPage;