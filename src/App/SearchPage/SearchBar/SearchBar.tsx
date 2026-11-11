import styles from './SearchBar.module.css';
import { usePresenter } from './usePresenter';

export const SearchBar = () => {
  const { value, isLoading, handleChange, handleSubmit } = usePresenter();

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <input
        className={styles.input}
        type="search"
        placeholder="Search TV shows, e.g. Murder"
        aria-label="Search TV shows"
        value={value}
        onChange={handleChange}
        autoFocus
      />
      <button className={styles.button} type="submit" disabled={isLoading}>
        Search
      </button>
    </form>
  );
};
