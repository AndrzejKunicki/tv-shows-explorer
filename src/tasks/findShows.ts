import { searchShows } from '@src/api/tvmaze';
import { findCachedResults, toCacheKey } from '@src/store/shows/searchCache';
import { selectCache } from '@src/store/shows/selectors';
import {
  resultsReceived,
  resultsRestored,
  searchCleared,
  searchFailed,
  searchStarted,
} from '@src/store/shows/showsSlice';
import { store } from '@src/store/store';
import { cancelSearch, startSearchRequest } from './searchRequest';

export type FindShowsResult = { error: string | null };

/** Searches shows for the query, reusing cached responses; an empty query clears the search. */
export const findShows = async (rawQuery: string): Promise<FindShowsResult> => {
  cancelSearch();

  const query = rawQuery.trim();
  if (!query) {
    store.dispatch(searchCleared());

    return { error: null };
  }

  const cached = findCachedResults(selectCache(store.getState()), toCacheKey(query));
  if (cached) {
    store.dispatch(resultsRestored({ query, items: cached }));

    return { error: null };
  }

  const signal = startSearchRequest();
  store.dispatch(searchStarted(query));

  try {
    const items = await searchShows(query, signal);
    store.dispatch(resultsReceived({ query, items }));

    return { error: null };
  } catch (error) {
    // Aborted on purpose: a newer search (or clearing) already owns the state
    if (signal.aborted) {
      return { error: null };
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    store.dispatch(searchFailed(message));

    return { error: message };
  }
};
