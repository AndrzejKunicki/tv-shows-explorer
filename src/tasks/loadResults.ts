import { searchShows } from '@src/api/showsApi';
import { showsStore } from '@src/store/shows/showsStore';
import { startSearchRequest } from './searchRequest';

export type LoadResultsResult = { error: string | null };

/**
 * Loads the results page for the query, genre, sort order and page in the store; the server filters,
 * sorts and paginates. A newer search or results request aborts this one.
 */
export const loadResults = async (): Promise<LoadResultsResult> => {
  const signal = startSearchRequest();

  try {
    const page = await searchShows(showsStore.getSearchParams(), signal);
    showsStore.receiveResults(page);

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
