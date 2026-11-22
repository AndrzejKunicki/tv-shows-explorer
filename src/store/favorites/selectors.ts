import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@src/store/store';

export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectFavoritesStatus = (state: RootState) => state.favorites.status;
export const selectFavoriteCount = (state: RootState) => state.favorites.items.length;

const selectFavoriteIds = createSelector([selectFavorites], (shows) => new Set(shows.map((show) => show.id)));

export const selectIsFavorite = (state: RootState, id: number) => selectFavoriteIds(state).has(id);
