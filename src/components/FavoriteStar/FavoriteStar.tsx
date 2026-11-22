import type { Show } from '@src/api/types';
import styles from './FavoriteStar.module.css';
import { usePresenter } from './logic/usePresenter';

const STAR_PATH = 'm12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z';

/** Star button that adds the show to the favorites or removes it; the parent positions it. */
export const FavoriteStar = (props: { show: Show }) => {
  const { isFavorite, isPending, isFilling, label, buttonRef, handleClick } = usePresenter(props);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.star}
      data-active={isFavorite}
      data-filling={isFilling}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
      aria-disabled={isPending}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path className={styles.outline} d={STAR_PATH} />
        <path className={styles.liquid} d={STAR_PATH} />
      </svg>
    </button>
  );
};
