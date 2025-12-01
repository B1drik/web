import type StudentInterface from '@/types/StudentInterface';
import Link from 'next/link';
import styles from './Student.module.scss';

interface Props {
  student: StudentInterface;
  onDelete: (id: number) => void;
}

const Student = ({ student, onDelete }: Props): React.ReactElement => {
  const onDeleteHandler = (): void => {
    onDelete(student.id);
  };

  const modifier = student.isDeleted ? '--isDeleted' : student.isNew ? '--isNew' : '';

  return (
    <div className={`${styles.Student} ${styles[modifier]}`}>
      <Link href={`/students/${student.id}`} className={styles.link}>
        {`${student.id || 'xxxx'} - ${student.lastName} ${student.firstName} ${student.middleName}`}
      </Link>
      <div className={styles.groupInfo}>
        {student.group ? `Группа: ${student.group.name}` : `ID группы: ${student.groupId}`}
      </div>
      <button onClick={onDeleteHandler}>Удалить</button>
    </div>
  );
};

export default Student;