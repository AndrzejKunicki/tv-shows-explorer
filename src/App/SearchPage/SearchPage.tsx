import { Discover } from './Discover/Discover';
import { GenreChips } from './GenreChips/GenreChips';
import { Hero } from './Hero/Hero';
import { Pagination } from './Pagination/Pagination';
import { PopularToday } from './PopularToday/PopularToday';
import { SearchBar } from './SearchBar/SearchBar';
import styles from './SearchPage.module.css';
import { ShowList } from './ShowList/ShowList';
import { ShowReel } from './ShowReel/ShowReel';
import { SortSelect } from './SortSelect/SortSelect';
import { usePresenter } from './usePresenter';

export const SearchPage = () => {
  const { message, isError, hasResults, showDiscover } = usePresenter();

  return (
    <section className={styles.page}>
      <ShowReel />
      <Hero />
      <SearchBar />
      <PopularToday />
      {message && <p className={isError ? styles.error : styles.message}>{message}</p>}
      {hasResults && (
        <>
          <div className={styles.toolbar}>
            <GenreChips />
            <SortSelect />
          </div>
          <ShowList />
          <Pagination />
        </>
      )}
      {showDiscover && <Discover />}
    </section>
  );
};
