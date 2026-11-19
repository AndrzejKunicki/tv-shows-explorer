import { findShows } from './findShows';
import { scheduleSearch } from './searchRequest';

export const SEARCH_DEBOUNCE_MS = 300;

/** Searches once the text has not changed for `SEARCH_DEBOUNCE_MS`; a newer search cancels it. */
export const findShowsDebounced = (query: string) => {
  scheduleSearch(() => findShows(query), SEARCH_DEBOUNCE_MS);
};
