import { FavoriteItem } from './FavoriteItem/FavoriteItem';
import styles from './FavoritesPanel.module.css';
import { usePresenter } from './logic/usePresenter';

/** Side panel with the list of favorite shows. */
export const FavoritesPanel = ({ onClose }: { onClose: () => void }) => {
  const { shows, message, closeRef } = usePresenter();

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <aside id="favorites-panel" className={styles.panel} role="dialog" aria-modal="true" aria-label="Favorites">
        <header className={styles.header}>
          <h2 className={styles.title}>Favorites</h2>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close favorites"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        {message && <p className={styles.message}>{message}</p>}
        <ul className={styles.list}>
          {shows.map((show) => (
            <li key={show.id}>
              <FavoriteItem show={show} />
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};
