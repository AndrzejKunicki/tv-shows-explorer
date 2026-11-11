import styles from './ShowReel.module.css';
import { usePresenter } from './usePresenter';

/** Decorative wall of screens behind the start page, like trailer screens in a cinema lobby. */
export const ShowReel = () => {
  const { rows, hasRows, isHidden, handleImageLoad } = usePresenter();

  if (!hasRows) {
    return null;
  }

  return (
    <div className={isHidden ? `${styles.reel} ${styles.hidden}` : styles.reel} aria-hidden="true">
      <div className={styles.wall}>
        {rows.map((row) => (
          <div key={row.id} className={styles.track}>
            {row.posters.map((poster) => (
              <div
                key={poster.key}
                className={styles.screen}
                data-playing={poster.isPlaying}
                data-loaded={poster.isLoaded}
              >
                <img
                  className={styles.image}
                  src={poster.imageUrl}
                  alt=""
                  onLoad={() => handleImageLoad(poster.imageUrl)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
