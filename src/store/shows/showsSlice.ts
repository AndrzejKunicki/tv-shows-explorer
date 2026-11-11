import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { searchShows } from '../../api/tvmaze';
import type { Show } from '../../api/types';

export const PAGE_SIZE = 3;

export type SearchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ShowsState {
  query: string;
  items: Show[];
  status: SearchStatus;
  error: string | null;
  selectedGenre: string | null;
  page: number;
  currentRequestId: string | null;
}

export const initialState: ShowsState = {
  query: '',
  items: [],
  status: 'idle',
  error: null,
  selectedGenre: null,
  page: 1,
  currentRequestId: null,
};

export const fetchShows = createAsyncThunk('shows/fetch', (query: string, { signal }) =>
  searchShows(query, signal),
);

const showsSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {
    searchCleared: () => initialState,
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
        if (state.currentRequestId !== action.meta.requestId) return;
        state.items = action.payload;
        state.status = 'succeeded';
        state.currentRequestId = null;
      })
      .addCase(fetchShows.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.items = [];
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
        state.currentRequestId = null;
      });
  },
});

export const { searchCleared, genreSelected, genreReset, pageChanged } = showsSlice.actions;
export const showsReducer = showsSlice.reducer;
