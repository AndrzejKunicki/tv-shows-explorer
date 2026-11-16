import type { AppThunk } from '@src/store/store';
import { findCachedResults, toCacheKey } from './searchCache';
import { fetchShows, resultsRestored, searchCleared } from './showsSlice';

type FetchRequest = ReturnType<ReturnType<typeof fetchShows>>;

/**
 * The only search request in flight. There is one search field in the app, so one slot is enough;
 * every new search (fetch, cache hit or clearing) aborts it first, so an outdated response
 * can never overwrite newer results.
 */
let pendingRequest: FetchRequest | null = null;

/** Aborts the search request in flight, if any (e.g. when the search field unmounts). */
export const abortSearch = (): AppThunk => () => {
  pendingRequest?.abort();
  pendingRequest = null;
};

/** Searches shows for the query, reusing cached responses when possible. */
export const searchQuery =
  (rawQuery: string): AppThunk =>
  (dispatch, getState) => {
    dispatch(abortSearch());

    const query = rawQuery.trim();
    if (!query) {
      dispatch(searchCleared());

      return;
    }

    const cached = findCachedResults(getState().shows.cache, toCacheKey(query));
    if (cached) {
      dispatch(resultsRestored({ query, items: cached }));

      return;
    }

    pendingRequest = dispatch(fetchShows(query));
  };
