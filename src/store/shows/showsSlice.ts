import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { searchShows } from '@src/api/tvmaze';
import type { Show } from '@src/api/types';

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
  currentRequestId: string | null;
  /** Responses already received, keyed by normalized query (see `toCacheKey`). */
  cache: Record<string, Show[]>;
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
  currentRequestId: null,
  cache: {},
};

export const toCacheKey = (query: string) => query.trim().toLowerCase();

export const fetchShows = createAsyncThunk('shows/fetch', (query: string, { signal }) =>
  searchShows(query, signal),
);

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
    resultsRestored: (state, action: PayloadAction<{ query: string; items: Show[] }>) => {
      state.query = action.payload.query;
      state.items = action.payload.items;
      state.status = 'succeeded';
      state.error = null;
      state.selectedGenre = null;
      state.page = 1;
      state.currentRequestId = null;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.pending, (state, action) => {
        state.query = action.meta.arg;
        state.status = 'loading';
        state.error = null;
        state.selectedGenre = null;
        state.page = 1;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.cache[toCacheKey(action.meta.arg)] = action.payload;
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }
        state.items = action.payload;
        state.status = 'succeeded';
        state.currentRequestId = null;
      })
      .addCase(fetchShows.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }
        state.items = [];
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
        state.currentRequestId = null;
      });
  },
});

export const {
  searchCleared,
  draftChanged,
  sortChanged,
  resultsRestored,
  genreSelected,
  genreReset,
  pageChanged,
} = showsSlice.actions;
export const showsReducer = showsSlice.reducer;
