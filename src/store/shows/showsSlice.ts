import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Show } from '@src/api/types';
import { addToCache, toCacheKey, type CachedSearch } from './searchCache';

export const PAGE_SIZE = 3;

export type SearchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type SortBy = 'relevance' | 'rating';

export interface ShowsState {
  /** Text in the search field; also set by the "Popular on TV today" suggestions. */
  draft: string;
  sortBy: SortBy;
  query: string;
  items: Show[];
  status: SearchStatus;
  error: string | null;
  selectedGenre: string | null;
  page: number;
  /** Last responses, oldest first, keyed by normalized query (see `searchCache.ts`). */
  cache: CachedSearch[];
}

export const initialState: ShowsState = {
  draft: '',
  sortBy: 'relevance',
  query: '',
  items: [],
  status: 'idle',
  error: null,
  selectedGenre: null,
  page: 1,
  cache: [],
};

const showsSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {
    // Keeps what the user controls (field text, sort order) and the cache
    searchCleared: (state) => ({ ...initialState, cache: state.cache, draft: state.draft, sortBy: state.sortBy }),
    draftChanged: (state, action: PayloadAction<string>) => {
      state.draft = action.payload;
    },
    sortChanged: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    searchStarted: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.status = 'loading';
      state.error = null;
      state.selectedGenre = null;
      state.page = 1;
    },
    resultsReceived: (state, action: PayloadAction<{ query: string; items: Show[] }>) => {
      state.cache = addToCache(state.cache, toCacheKey(action.payload.query), action.payload.items);
      state.items = action.payload.items;
      state.status = 'succeeded';
    },
    searchFailed: (state, action: PayloadAction<string>) => {
      state.items = [];
      state.status = 'failed';
      state.error = action.payload;
    },
    resultsRestored: (state, action: PayloadAction<{ query: string; items: Show[] }>) => {
      state.query = action.payload.query;
      state.items = action.payload.items;
      state.status = 'succeeded';
      state.error = null;
      state.selectedGenre = null;
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
  },
});

export const {
  searchCleared,
  draftChanged,
  sortChanged,
  searchStarted,
  resultsReceived,
  searchFailed,
  resultsRestored,
  genreSelected,
  genreReset,
  pageChanged,
} = showsSlice.actions;
export const showsReducer = showsSlice.reducer;
