import { searchShows } from '@src/api/tvmaze';
import { showsStore } from '@src/store/shows/showsStore';
import { cancelSearch, startSearchRequest } from './searchRequest';

export type FindShowsResult = { error: string | null };

/** Searches shows for the query, reusing cached responses; an empty query clears the search. */
export const findShows = async (rawQuery: string): Promise<FindShowsResult> => {
  cancelSearch();

  const query = rawQuery.trim();
  if (!query) {
    showsStore.clearSearch();

    return { error: null };
  }

  const cached = showsStore.getCachedResults(query);
  if (cached) {
    showsStore.restoreResults(query, cached);

    return { error: null };
  }

  const signal = startSearchRequest();
  showsStore.startSearch(query);

  try {
    const items = await searchShows(query, signal);
    showsStore.receiveResults(query, items);

    return { error: null };
  } catch (error) {
    // Aborted on purpose: a newer search (or clearing) already owns the state
    if (signal.aborted) {
      return { error: null };
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    showsStore.failSearch(message);

    return { error: message };
  }
};
