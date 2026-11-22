import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchPage, Show, SortBy } from '@src/api/types';

export type { SortBy } from '@src/api/types';
export type SearchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ShowsState {
  /** Text in the search field; also set by the "Popular on TV today" suggestions. */
  draft: string;
  sortBy: SortBy;
  query: string;
  selectedGenre: string | null;
  page: number;
  /** The current page of results, filtered and sorted by the server. */
  items: Show[];
  pageCount: number;
  /** Genres of all results of the query, so the user can switch to another one. */
  genres: string[];
  status: SearchStatus;
  error: string | null;
}

export const initialState: ShowsState = {
  draft: '',
  sortBy: 'relevance',
  query: '',
  selectedGenre: null,
  page: 1,
  items: [],
  pageCount: 0,
  genres: [],
  status: 'idle',
  error: null,
};

const showsSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {
    // Keeps what the user controls: field text and sort order
    searchCleared: (state) => ({ ...initialState, draft: state.draft, sortBy: state.sortBy }),
    draftChanged: (state, action: PayloadAction<string>) => {
      state.draft = action.payload;
    },
    sortChanged: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    genreSelected: (state, action: PayloadAction<string>) => {
      state.selectedGenre = action.payload;
      state.page = 1;
    },
    genreReset: (state) => {
      state.selectedGenre = null;
      state.page = 1;
    },
    pageChanged: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    searchStarted: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.status = 'loading';
      state.error = null;
      state.selectedGenre = null;
      state.page = 1;
    },
    resultsReceived: (state, action: PayloadAction<SearchPage>) => {
      const { query, items, page, pageCount, genres } = action.payload;
      Object.assign(state, { query, items, page, pageCount, genres, status: 'succeeded', error: null });
    },
    searchFailed: (state, action: PayloadAction<string>) => {
      state.items = [];
      state.pageCount = 0;
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  searchCleared,
  draftChanged,
  sortChanged,
  genreSelected,
  genreReset,
  pageChanged,
  searchStarted,
  resultsReceived,
  searchFailed,
} = showsSlice.actions;
export const showsReducer = showsSlice.reducer;
