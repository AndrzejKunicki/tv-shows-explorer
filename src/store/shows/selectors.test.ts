import { describe, expect, it } from 'vitest';
import type { RootState } from '@src/store/store';
import {
  selectCache,
  selectCurrentPage,
  selectFilteredShows,
  selectGenres,
  selectPageCount,
  selectPagedShows,
} from './selectors';
import { initialState as discoverInitialState } from '@src/store/discover/discoverSlice';
import { initialState, type ShowsState } from './showsSlice';
import { makeShow, testShows } from './testShows';

const rootState = (shows: Partial<ShowsState>): RootState => ({
  shows: { ...initialState, items: testShows, status: 'succeeded', ...shows },
  discover: discoverInitialState,
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

  it('keeps an out-of-range page within the existing pages', () => {
    expect(selectCurrentPage(rootState({ page: 0 }))).toBe(1);
    expect(selectCurrentPage(rootState({ page: -2 }))).toBe(1);
    expect(selectCurrentPage(rootState({ page: 99 }))).toBe(3);
    expect(selectCurrentPage(rootState({ page: 2, items: [] }))).toBe(1);
    expect(ids(selectPagedShows(rootState({ page: 99 })))).toEqual([7]);
  });

  it('has no pages for empty results', () => {
    expect(selectPageCount(rootState({ items: [] }))).toBe(0);
  });

  it('sorts by rating on request, unrated shows last', () => {
    const rated = (id: number, average: number | null) => ({ ...makeShow(id, []), rating: { average } });
    const items = [rated(1, 6), rated(2, null), rated(3, 9), rated(4, 7.5)];

    expect(ids(selectFilteredShows(rootState({ items })))).toEqual([1, 2, 3, 4]);
    expect(ids(selectFilteredShows(rootState({ items, sortBy: 'rating' })))).toEqual([3, 4, 1, 2]);
  });
});

describe('selectCache', () => {
  it('returns the cached search responses', () => {
    const cache = [{ key: 'lost', shows: testShows }];
    const state: RootState = { shows: { ...initialState, cache }, discover: discoverInitialState };

    expect(selectCache(state)).toBe(cache);
  });
});
