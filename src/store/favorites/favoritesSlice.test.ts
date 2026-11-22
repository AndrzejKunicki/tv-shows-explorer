import { describe, expect, it } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import {
  favoriteAdded,
  favoriteRemoved,
  favoritesFailed,
  favoritesLoaded,
  favoritesReducer,
  favoritesRequested,
  initialState,
} from './favoritesSlice';

describe('favoritesSlice', () => {
  it('starts empty and idle', () => {
    expect(favoritesReducer(undefined, { type: 'init' })).toEqual(initialState);
  });

  it('stores the favorites loaded from the server', () => {
    const loading = favoritesReducer(initialState, favoritesRequested());
    const loaded = favoritesReducer(loading, favoritesLoaded([makeShow(1, [])]));

    expect(loading.status).toBe('loading');
    expect(loaded).toEqual({ items: [makeShow(1, [])], status: 'succeeded' });
  });

  it('marks a failed load', () => {
    expect(favoritesReducer(initialState, favoritesFailed()).status).toBe('failed');
  });

  it('puts an added show first, once', () => {
    const state = { ...initialState, items: [makeShow(1, []), makeShow(2, [])] };

    expect(favoritesReducer(state, favoriteAdded(makeShow(3, []))).items.map((show) => show.id)).toEqual([3, 1, 2]);
    expect(favoritesReducer(state, favoriteAdded(makeShow(2, []))).items.map((show) => show.id)).toEqual([2, 1]);
  });

  it('removes a show', () => {
    const state = { ...initialState, items: [makeShow(1, []), makeShow(2, [])] };

    expect(favoritesReducer(state, favoriteRemoved(1)).items.map((show) => show.id)).toEqual([2]);
  });
});
