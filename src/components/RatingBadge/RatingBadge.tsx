import styles from './RatingBadge.module.css';

/** Viewer rating from TVMaze, shown on a poster corner. `rating` is already formatted, e.g. "8.4". */
export const RatingBadge = ({ rating }: { rating: string }) => (
  <span className={styles.badge}>
    <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
    </svg>
    <span className={styles.srOnly}>Rated </span>
    {rating}
    <span className={styles.srOnly}> out of 10</span>
  </span>
);
