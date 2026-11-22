import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Show } from '@src/api/types';

export type FavoritesStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

/** A copy of the favorites kept on the server; it changes only after the server has confirmed a change. */
export interface FavoritesState {
  /** The most recently added first, like the server sends them. */
  items: Show[];
  status: FavoritesStatus;
}

export const initialState: FavoritesState = { items: [], status: 'idle' };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoritesRequested: (state) => {
      state.status = 'loading';
    },
    favoritesLoaded: (state, action: PayloadAction<Show[]>) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },
    favoritesFailed: (state) => {
      state.status = 'failed';
    },
    favoriteAdded: (state, action: PayloadAction<Show>) => {
      const others = state.items.filter((show) => show.id !== action.payload.id);
      state.items = [action.payload, ...others];
    },
    favoriteRemoved: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((show) => show.id !== action.payload);
    },
  },
});

export const { favoritesRequested, favoritesLoaded, favoritesFailed, favoriteAdded, favoriteRemoved } =
  favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
