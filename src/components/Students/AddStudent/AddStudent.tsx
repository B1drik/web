import type StudentInterface from '@/types/StudentInterface';
import type GroupInterface from '@/types/GroupInterface';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useImperativeHandle, forwardRef, useRef } from 'react';
import styles from './AddStudent.module.scss';
import useGroups from '@/hooks/useGroups';

export type FormFields = Pick<StudentInterface, 'firstName' | 'lastName' | 'middleName' | 'groupId'>;

interface Props {
  onAdd: (studentForm: FormFields) => void;
}

export interface AddStudentRef {
  resetForm: () => void;
}

const AddStudent = forwardRef<AddStudentRef, Props>(({ onAdd }, ref): React.ReactElement => {
  const { groups } = useGroups();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = studentForm => onAdd(studentForm);

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      reset();
    },
  }));

  return (
    <div className={styles.AddStudent}>
      <h2>Добавление Студентов</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          placeholder="Фамилия"
          {...register('lastName', { required: true })}
        />
        {errors.lastName && <div>Обязательное поле</div>}

        <input
          placeholder="Имя"
          {...register('firstName', { required: true })}
        />
        {errors.firstName && <div>Обязательное поле</div>}

        <input
          placeholder="Отчество"
          {...register('middleName', { required: true })}
        />
        {errors.middleName && <div>Обязательное поле</div>}

        <select
          {...register('groupId', { required: true })}
        >
          <option value="">Выберите группу</option>
          {groups.map((group: GroupInterface) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        {errors.groupId && <div>Обязательное поле</div>}

        <input type="submit" value="Добавить" />
      </form>

    </div>
  );
});

AddStudent.displayName = 'AddStudent';

export default AddStudent;