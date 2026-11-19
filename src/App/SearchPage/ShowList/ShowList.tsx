import { ShowCard } from './ShowCard/ShowCard';
import styles from './ShowList.module.css';
import { usePresenter } from './logic/usePresenter';

export const ShowList = () => {
  const { shows } = usePresenter();

  return (
    <ul className={styles.list}>
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  );
};
