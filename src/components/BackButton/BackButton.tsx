'use client';

import { useRouter } from 'next/navigation';
import styles from './BackButton.module.scss';

interface Props {
  href?: string;
  children?: React.ReactNode;
}

const BackButton = ({ href, children = '← Назад' }: Props): React.ReactElement => {
  const router = useRouter();

  const handleClick = (): void => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button className={styles.BackButton} onClick={handleClick}>
      {children}
    </button>
  );
};

export default BackButton;