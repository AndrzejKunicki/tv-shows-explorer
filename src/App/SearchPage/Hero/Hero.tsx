import styles from './Hero.module.css';
import { usePresenter } from './usePresenter';

export const Hero = () => {
  const { isCompact } = usePresenter();

  return (
    <header className={styles.hero} data-compact={isCompact}>
      <p className={styles.logo}>TV Shows Explorer</p>
      <h1 className={styles.headline}>Not sure what to watch? Start here.</h1>
      <p className={styles.lead}>
        Explore thousands of TV shows, discover hidden gems and find your next favorite series.
      </p>
    </header>
  );
};
