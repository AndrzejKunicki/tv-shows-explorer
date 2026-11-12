import styles from './Discover.module.css';
import { DiscoverRow } from './DiscoverRow/DiscoverRow';
import { usePresenter } from './usePresenter';

/** Discovery rows for people who don't have a title in mind. */
export const Discover = () => {
  const { rows, hasRows } = usePresenter();

  if (!hasRows) {
    return null;
  }

  return (
    <div className={styles.discover}>
      {rows.map((row) => (
        <DiscoverRow key={row.id} id={row.id} title={row.title} subtitle={row.subtitle} shows={row.shows} />
      ))}
    </div>
  );
};
