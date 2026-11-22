import { searchShows } from '#src/api/tvmaze.ts';
import type { SearchPage, SortBy } from '#src/api/types.ts';
import { getCached } from './getCached.ts';
import { filterByGenre, listGenres, paginate, sortShows } from './showList.ts';

export interface FindShowsPageParams {
  query: string;
  genre: string | null;
  sort: SortBy;
  page: number;
}

/**
 * Searches TVmaze (through the cache) and returns one page of the results of the genre, sorted.
 * The genre list always comes from all results, so the user can switch to another genre.
 */
export const findShowsPage = async ({ query, genre, sort, page }: FindShowsPageParams): Promise<SearchPage> => {
  const trimmed = query.trim();
  // "Banana " and "banana" are the same TVmaze request
  const shows = await getCached(`search:${trimmed.toLowerCase()}`, () => searchShows(trimmed));
  const sorted = sortShows(filterByGenre(shows, genre), sort);
  const result = paginate(sorted, page);
  const genres = listGenres(shows);

  return { query: trimmed, ...result, total: shows.length, genres };
};
