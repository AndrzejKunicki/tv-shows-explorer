import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { PAGE_SIZE } from './showsSlice';

const selectShows = (state: RootState) => state.shows;

export const selectItems = (state: RootState) => selectShows(state).items;
export const selectQuery = (state: RootState) => selectShows(state).query;
export const selectStatus = (state: RootState) => selectShows(state).status;
export const selectError = (state: RootState) => selectShows(state).error;
export const selectSelectedGenre = (state: RootState) => selectShows(state).selectedGenre;
export const selectPage = (state: RootState) => selectShows(state).page;

export const selectGenres = createSelector([selectItems], (items) =>
  [...new Set(items.flatMap((show) => show.genres))].sort((a, b) => a.localeCompare(b)),
);

export const selectFilteredShows = createSelector(
  [selectItems, selectSelectedGenre],
  (items, genre) => (genre ? items.filter((show) => show.genres.includes(genre)) : items),
);

export const selectPageCount = createSelector([selectFilteredShows], (shows) =>
  Math.ceil(shows.length / PAGE_SIZE),
);

export const selectPagedShows = createSelector([selectFilteredShows, selectPage], (shows, page) =>
  shows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
);
