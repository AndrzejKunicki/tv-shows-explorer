import type { Show } from '@src/api/types';
import styles from './FavoriteStar.module.css';
import { usePresenter } from './logic/usePresenter';

/** Star button that adds the show to the favorites or removes it; the parent positions it. */
export const FavoriteStar = (props: { show: Show }) => {
  const { isFavorite, isPending, label, handleClick } = usePresenter(props);

  return (
    <button
      type="button"
      className={styles.star}
      data-active={isFavorite}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      disabled={isPending}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
      </svg>
    </button>
  );
};
