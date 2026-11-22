import type { SearchPage, SearchParams, SortBy } from '@src/api/types';
import { store } from '@src/store/store';
import {
  selectPage,
  selectPageCount,
  selectQuery,
  selectSelectedGenre,
  selectSortBy,
  selectStatus,
} from './selectors';
import {
  draftChanged,
  genreReset,
  genreSelected,
  pageChanged,
  resultsReceived,
  searchCleared,
  searchFailed,
  searchStarted,
  sortChanged,
} from './showsSlice';

/**
 * Search data for tasks: named reads and writes in terms of the domain. It is the only place where
 * tasks meet the Redux API, so switching the state library changes this file, not the tasks.
 */
export const showsStore = {
  getPage: () => selectPage(store.getState()),
  getPageCount: () => selectPageCount(store.getState()),
  getSelectedGenre: () => selectSelectedGenre(store.getState()),
  getSortBy: () => selectSortBy(store.getState()),
  /** Whether the results of exactly this query are already shown. */
  hasResultsFor: (query: string) => {
    const state = store.getState();
    const hasResults = selectQuery(state) === query && selectStatus(state) === 'succeeded';

    return hasResults;
  },
  /** What the current results page is made of: query, genre, sort order and page. */
  getSearchParams: (): SearchParams => {
    const state = store.getState();
    const params = {
      query: selectQuery(state),
      genre: selectSelectedGenre(state),
      sort: selectSortBy(state),
      page: selectPage(state),
    };

    return params;
  },

  setDraft: (text: string) => {
    store.dispatch(draftChanged(text));
  },
  setPage: (page: number) => {
    store.dispatch(pageChanged(page));
  },
  setSort: (sort: SortBy) => {
    store.dispatch(sortChanged(sort));
  },
  selectGenre: (genre: string) => {
    store.dispatch(genreSelected(genre));
  },
  resetGenre: () => {
    store.dispatch(genreReset());
  },
  clearSearch: () => {
    store.dispatch(searchCleared());
  },
  startSearch: (query: string) => {
    store.dispatch(searchStarted(query));
  },
  receiveResults: (page: SearchPage) => {
    store.dispatch(resultsReceived(page));
  },
  failSearch: (message: string) => {
    store.dispatch(searchFailed(message));
  },
};
