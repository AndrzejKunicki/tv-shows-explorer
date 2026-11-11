import type { Show } from '@src/api/types';
import { RatingBadge } from '@src/components/RatingBadge/RatingBadge';
import styles from './ShowCard.module.css';
import { usePresenter } from './usePresenter';

export const ShowCard = (props: { show: Show }) => {
  const { name, url, imageUrl, rating, meta, genres, summary } = usePresenter(props);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {rating && <RatingBadge rating={rating} />}
        {imageUrl ? (
          <img className={styles.image} src={imageUrl} alt={name} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>
          <a href={url} target="_blank" rel="noreferrer">
            {name}
          </a>
        </h2>
        {meta && <p className={styles.meta}>{meta}</p>}
        {genres && <p className={styles.genres}>{genres}</p>}
        {summary && <p className={styles.summary}>{summary}</p>}
      </div>
    </article>
  );
};
