import type { Show } from '@src/api/types';
import { FavoriteStar } from '@src/components/FavoriteStar/FavoriteStar';
import { RatingBadge } from '@src/components/RatingBadge/RatingBadge';
import styles from './PosterCard.module.css';
import { usePresenter } from './logic/usePresenter';

/** Compact show card for the discovery rows; opens the show page on TVMaze. */
export const PosterCard = (props: { show: Show }) => {
  const { name, url, imageUrl, rating, meta } = usePresenter(props);

  return (
    <article className={styles.card}>
      <a className={styles.link} href={url} target="_blank" rel="noreferrer">
        <div className={styles.media}>
          {rating && <RatingBadge rating={rating} />}
          {imageUrl && <img className={styles.image} src={imageUrl} alt="" loading="lazy" />}
        </div>
        <h3 className={styles.name}>{name}</h3>
        {meta && <p className={styles.meta}>{meta}</p>}
      </a>
      {/* Outside the link: a button inside a link is not allowed */}
      <div className={styles.star}>
        <FavoriteStar show={props.show} />
      </div>
    </article>
  );
};
