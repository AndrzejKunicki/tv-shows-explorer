import { makeShow } from '@src/store/shows/testShows';
import { createStore, type RootState } from '@src/store/store';
import type { FavoritesState } from './favoritesSlice';
import { selectFavoriteCount, selectFavorites, selectFavoritesStatus, selectIsFavorite } from './selectors';

const rootState = (favorites: FavoritesState): RootState => ({ ...createStore().getState(), favorites });

describe('favorites selectors', () => {
  const state = rootState({ items: [makeShow(1, []), makeShow(2, [])], status: 'succeeded' });

  it('return the favorites, their number and the status', () => {
    expect(selectFavorites(state)).toEqual([makeShow(1, []), makeShow(2, [])]);
    expect(selectFavoriteCount(state)).toBe(2);
    expect(selectFavoritesStatus(state)).toBe('succeeded');
  });

  it('tell whether a show is a favorite', () => {
    expect(selectIsFavorite(state, 2)).toBe(true);
    expect(selectIsFavorite(state, 3)).toBe(false);
  });
});
