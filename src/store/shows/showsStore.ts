import type { Show } from '@src/api/types';
import { store } from '@src/store/store';
import { findCachedResults, toCacheKey } from './searchCache';
import { selectCache, selectCurrentPage, selectPageCount, selectSelectedGenre } from './selectors';
import {
  draftChanged,
  genreReset,
  genreSelected,
  pageChanged,
  resultsReceived,
  resultsRestored,
  searchCleared,
  searchFailed,
  searchStarted,
} from './showsSlice';

/**
 * Search data for tasks: named reads and writes in terms of the domain. It is the only place where
 * tasks meet the Redux API, so switching the state library changes this file, not the tasks.
 */
export const showsStore = {
  getPage: () => selectCurrentPage(store.getState()),
  getPageCount: () => selectPageCount(store.getState()),
  getSelectedGenre: () => selectSelectedGenre(store.getState()),
  /** Results already fetched for the same normalized query, or `null`. */
  getCachedResults: (query: string) => findCachedResults(selectCache(store.getState()), toCacheKey(query)),

  setDraft: (text: string) => {
    store.dispatch(draftChanged(text));
  },
  setPage: (page: number) => {
    store.dispatch(pageChanged(page));
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
  receiveResults: (query: string, items: Show[]) => {
    store.dispatch(resultsReceived({ query, items }));
  },
  restoreResults: (query: string, items: Show[]) => {
    store.dispatch(resultsRestored({ query, items }));
  },
  failSearch: (message: string) => {
    store.dispatch(searchFailed(message));
  },
};
