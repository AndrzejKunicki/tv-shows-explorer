import { showsStore } from '@src/store/shows/showsStore';
import { loadResults, type LoadResultsResult } from './loadResults';
import { cancelSearch } from './searchRequest';

/** Searches shows for the query (first page, all genres, current sort order); an empty query clears the search. */
export const findShows = async (rawQuery: string): Promise<LoadResultsResult> => {
  cancelSearch();

  const query = rawQuery.trim();
  if (!query) {
    showsStore.clearSearch();

    return { error: null };
  }

  // E.g. a space typed after the last word: same query, so keep the results, genre and page as they are
  if (showsStore.hasResultsFor(query)) {
    return { error: null };
  }

  showsStore.startSearch(query);
  const result = await loadResults();

  return result;
};
