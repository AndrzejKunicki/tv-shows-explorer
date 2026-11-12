import styles from './PopularToday.module.css';
import { usePresenter } from './usePresenter';

/** One-click searches for the most popular shows airing today (real TVMaze schedule data). */
export const PopularToday = () => {
  const { names, isVisible, handleSelect } = usePresenter();

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.popular}>
      <span className={styles.label} id="popular-today-label">
        Popular on TV today
      </span>
      <ul className={styles.list} aria-labelledby="popular-today-label">
        {names.map((name) => (
          <li key={name}>
            <button type="button" className={styles.suggestion} onClick={() => handleSelect(name)}>
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
