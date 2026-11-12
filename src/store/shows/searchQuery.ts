import type { Show } from '@src/api/types';
import type { AppThunk } from '@src/store/store';
import { fetchShows, resultsRestored, searchCleared, toCacheKey } from './showsSlice';

export type FetchRequest = ReturnType<ReturnType<typeof fetchShows>>;

/**
 * Returns results already fetched for exactly the same query (e.g. "banana" -> "banan" -> "banana"),
 * or `null` when the API has to be called.
 */
export const findCachedResults = (cache: Record<string, Show[]>, key: string): Show[] | null =>
  Object.hasOwn(cache, key) ? cache[key] : null;

/**
 * Searches shows for the query, reusing cached responses when possible.
 * Returns the API request (so the caller can abort it) or `null` when no request was sent.
 */
export const searchQuery =
  (rawQuery: string): AppThunk<FetchRequest | null> =>
  (dispatch, getState) => {
    const query = rawQuery.trim();
    if (!query) {
      dispatch(searchCleared());

      return null;
    }

    const cached = findCachedResults(getState().shows.cache, toCacheKey(query));
    if (cached) {
      dispatch(resultsRestored({ query, items: cached }));

      return null;
    }

    const request = dispatch(fetchShows(query));

    return request;
  };
