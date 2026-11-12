import styles from './SearchBar.module.css';
import { usePresenter } from './usePresenter';

export const SearchBar = () => {
  const { value, inputRef, handleChange, handleSubmit, handleKeyDown } = usePresenter();

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        placeholder="Find your next favorite series…"
        aria-label="Search TV shows by title"
        aria-keyshortcuts="/"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <kbd className={styles.hint} aria-hidden="true">/</kbd>
    </form>
  );
};
