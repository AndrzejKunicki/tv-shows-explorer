import type { RootState } from '@src/store/store';

const selectShows = (state: RootState) => state.shows;

export const selectItems = (state: RootState) => selectShows(state).items;
export const selectQuery = (state: RootState) => selectShows(state).query;
export const selectStatus = (state: RootState) => selectShows(state).status;
export const selectError = (state: RootState) => selectShows(state).error;
export const selectSelectedGenre = (state: RootState) => selectShows(state).selectedGenre;
export const selectPage = (state: RootState) => selectShows(state).page;
export const selectPageCount = (state: RootState) => selectShows(state).pageCount;
export const selectGenres = (state: RootState) => selectShows(state).genres;
export const selectDraft = (state: RootState) => selectShows(state).draft;
export const selectSortBy = (state: RootState) => selectShows(state).sortBy;
