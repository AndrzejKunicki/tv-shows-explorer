import styles from './Backdrop.module.css';

/** Decorative cinema background: projector beam with floating dust, film strips and a vignette. */
export const Backdrop = () => (
  <div className={styles.backdrop} aria-hidden="true">
    <div className={styles.beam} />
    <div className={styles.dustLayer}>
      <div className={styles.dust} />
      <div className={styles.dustFar} />
    </div>
    <div className={styles.stripLeft} />
    <div className={styles.stripRight} />
    <div className={styles.vignette} />
  </div>
);
