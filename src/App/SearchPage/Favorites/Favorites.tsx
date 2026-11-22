import styles from './Favorites.module.css';
import { FavoritesPanel } from './FavoritesPanel/FavoritesPanel';
import { usePresenter } from './logic/usePresenter';

/** Button with the number of favorites in the corner; it opens the list. */
export const Favorites = () => {
  const { count, isOpen, buttonRef, buttonLabel, handleToggle, handleClose } = usePresenter();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-controls="favorites-panel"
        onClick={handleToggle}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
        <span className={styles.label}>Favorites</span>
        <span className={styles.count}>{count}</span>
      </button>
      {isOpen && <FavoritesPanel onClose={handleClose} />}
    </>
  );
};
