import { describe, expect, it } from 'vitest';
import type { RootState } from '../store';
import {
  selectFilteredShows,
  selectGenres,
  selectPageCount,
  selectPagedShows,
} from './selectors';
import { initialState, type ShowsState } from './showsSlice';
import { testShows } from './testShows';

const rootState = (shows: Partial<ShowsState>): RootState => ({
  shows: { ...initialState, items: testShows, status: 'succeeded', ...shows },
});

const ids = (shows: { id: number }[]) => shows.map((show) => show.id);

describe('shows selectors', () => {
  it('collects unique sorted genres', () => {
    expect(selectGenres(rootState({}))).toEqual(['Adventure', 'Comedy', 'Crime', 'Drama', 'Mystery']);
  });

  it('returns all shows without selected genre', () => {
    expect(selectFilteredShows(rootState({}))).toHaveLength(testShows.length);
  });

  it('filters shows by selected genre', () => {
    expect(ids(selectFilteredShows(rootState({ selectedGenre: 'Comedy' })))).toEqual([2, 4]);
  });

  it('paginates by 3 items', () => {
    expect(selectPageCount(rootState({}))).toBe(3);
    expect(ids(selectPagedShows(rootState({ page: 1 })))).toEqual([1, 2, 3]);
    expect(ids(selectPagedShows(rootState({ page: 3 })))).toEqual([7]);
  });

  it('paginates the filtered list', () => {
    const state = rootState({ selectedGenre: 'Crime' });

    expect(selectPageCount(state)).toBe(1);
    expect(ids(selectPagedShows(state))).toEqual([1, 3, 7]);
  });

  it('has no pages for empty results', () => {
    expect(selectPageCount(rootState({ items: [] }))).toBe(0);
  });
});
