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

  showsStore.startSearch(query);
  const result = await loadResults();

  return result;
};
