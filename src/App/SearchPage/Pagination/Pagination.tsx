import styles from './Pagination.module.css';
import { usePresenter } from './logic/usePresenter';

export const Pagination = () => {
  const { isVisible, label, canGoPrev, canGoNext, handlePrev, handleNext } = usePresenter();

  if (!isVisible) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button className={styles.button} onClick={handlePrev} disabled={!canGoPrev}>
        ← Prev
      </button>
      <span className={styles.label}>{label}</span>
      <button className={styles.button} onClick={handleNext} disabled={!canGoNext}>
        Next →
      </button>
    </nav>
  );
};
