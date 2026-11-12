import type { Show } from '@src/api/types';
import styles from './DiscoverRow.module.css';
import { PosterCard } from './PosterCard/PosterCard';
import { usePresenter } from './usePresenter';

interface DiscoverRowProps {
  id: string;
  title: string;
  subtitle: string;
  shows: Show[];
}

export const DiscoverRow = ({ id, title, subtitle, shows }: DiscoverRowProps) => {
  const { trackRef, titleId, prevLabel, nextLabel, handlePrev, handleNext } = usePresenter({ id, title });

  return (
    <section className={styles.row} aria-labelledby={titleId}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} onClick={handlePrev} aria-label={prevLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button type="button" className={styles.arrow} onClick={handleNext} aria-label={nextLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      <ul className={styles.track} ref={trackRef}>
        {shows.map((show) => (
          <li key={show.id} className={styles.item}>
            <PosterCard show={show} />
          </li>
        ))}
      </ul>
    </section>
  );
};
