import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@src/store/store';
import { PAGE_SIZE } from './showsSlice';

const selectShows = (state: RootState) => state.shows;

export const selectItems = (state: RootState) => selectShows(state).items;
export const selectQuery = (state: RootState) => selectShows(state).query;
export const selectStatus = (state: RootState) => selectShows(state).status;
export const selectError = (state: RootState) => selectShows(state).error;
export const selectSelectedGenre = (state: RootState) => selectShows(state).selectedGenre;
export const selectPage = (state: RootState) => selectShows(state).page;
export const selectDraft = (state: RootState) => selectShows(state).draft;
export const selectSortBy = (state: RootState) => selectShows(state).sortBy;
export const selectCache = (state: RootState) => selectShows(state).cache;

export const selectGenres = createSelector([selectItems], (items) =>
  [...new Set(items.flatMap((show) => show.genres))].sort((a, b) => a.localeCompare(b)),
);

/** Shows of the selected genre, in API order (best match) or by rating (unrated last). */
export const selectFilteredShows = createSelector(
  [selectItems, selectSelectedGenre, selectSortBy],
  (items, genre, sortBy) => {
    const filtered = genre ? items.filter((show) => show.genres.includes(genre)) : items;
    const sorted =
      sortBy === 'rating'
        ? [...filtered].sort((a, b) => (b.rating.average ?? -1) - (a.rating.average ?? -1))
        : filtered;

    return sorted;
  },
);

export const selectPageCount = createSelector([selectFilteredShows], (shows) =>
  Math.ceil(shows.length / PAGE_SIZE),
);

/** The stored page kept within 1..pageCount, so an out-of-range value never shows an empty list. */
export const selectCurrentPage = createSelector([selectPage, selectPageCount], (page, pageCount) => {
  const lastPage = Math.max(pageCount, 1);
  const currentPage = Math.min(Math.max(page, 1), lastPage);

  return currentPage;
});

export const selectPagedShows = createSelector([selectFilteredShows, selectCurrentPage], (shows, page) =>
  shows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
);
