import type { Show } from '@src/api/types';
import { FavoriteStar } from '@src/components/FavoriteStar/FavoriteStar';
import styles from './FavoriteItem.module.css';
import { usePresenter } from './logic/usePresenter';

/** One favorite in the list: poster, name (opens TVMaze) and the star to remove it. */
export const FavoriteItem = (props: { show: Show }) => {
  const { name, url, imageUrl, meta } = usePresenter(props);

  return (
    <div className={styles.item}>
      {imageUrl ? (
        <img className={styles.poster} src={imageUrl} alt="" loading="lazy" />
      ) : (
        <div className={styles.poster} />
      )}
      <div className={styles.body}>
        <a className={styles.name} href={url} target="_blank" rel="noreferrer">
          {name}
        </a>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
      <FavoriteStar show={props.show} />
    </div>
  );
};
