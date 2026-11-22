import type { Show, SortBy } from '#src/api/types.ts';

/** Shows per page of search results. */
export const PAGE_SIZE = 3;

/** Distinct genres of the shows, sorted alphabetically. */
export const listGenres = (shows: Show[]): string[] => {
  const genres = [...new Set(shows.flatMap((show) => show.genres))].sort((a, b) => a.localeCompare(b));

  return genres;
};

/** Shows of the genre; all shows when no genre is given. */
export const filterByGenre = (shows: Show[], genre: string | null): Show[] => {
  const filtered = genre ? shows.filter((show) => show.genres.includes(genre)) : shows;

  return filtered;
};

/** Shows in API order (best match) or by rating, unrated last. */
export const sortShows = (shows: Show[], sortBy: SortBy): Show[] => {
  const byRating = (a: Show, b: Show) => (b.rating.average ?? -1) - (a.rating.average ?? -1);
  const sorted = sortBy === 'rating' ? [...shows].sort(byRating) : shows;

  return sorted;
};

/** One page of the shows; the page is kept within 1..pageCount, so it is never empty when there are shows. */
export const paginate = (shows: Show[], page: number) => {
  const pageCount = Math.ceil(shows.length / PAGE_SIZE);
  const currentPage = Math.min(Math.max(page, 1), Math.max(pageCount, 1));
  const items = shows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return { items, page: currentPage, pageCount };
};
