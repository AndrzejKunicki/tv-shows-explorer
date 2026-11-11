import { GenreChips } from './GenreChips/GenreChips';
import { Pagination } from './Pagination/Pagination';
import { SearchBar } from './SearchBar/SearchBar';
import styles from './SearchPage.module.css';
import { ShowList } from './ShowList/ShowList';
import { usePresenter } from './usePresenter';

export const SearchPage = () => {
  const { message, isError, hasResults } = usePresenter();

  return (
    <section className={styles.page}>
      <SearchBar />
      {message && <p className={isError ? styles.error : styles.message}>{message}</p>}
      {hasResults && (
        <>
          <GenreChips />
          <ShowList />
          <Pagination />
        </>
      )}
    </section>
  );
};
