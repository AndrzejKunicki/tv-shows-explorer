import { describe, expect, it } from 'vitest';
import { initialState as discoverInitialState } from '@src/store/discover/discoverSlice';
import type { RootState } from '@src/store/store';
import {
  selectDraft,
  selectError,
  selectGenres,
  selectItems,
  selectPage,
  selectPageCount,
  selectQuery,
  selectSelectedGenre,
  selectSortBy,
  selectStatus,
} from './selectors';
import { initialState, type ShowsState } from './showsSlice';
import { testShows } from './testShows';

const rootState = (shows: Partial<ShowsState>): RootState => ({
  shows: { ...initialState, ...shows },
  discover: discoverInitialState,
});

describe('shows selectors', () => {
  it('read the results page sent by the server', () => {
    const state = rootState({ items: testShows, page: 2, pageCount: 3, genres: ['Crime', 'Drama'] });

    expect(selectItems(state)).toBe(testShows);
    expect(selectPage(state)).toBe(2);
    expect(selectPageCount(state)).toBe(3);
    expect(selectGenres(state)).toEqual(['Crime', 'Drama']);
  });

  it('read the search parameters', () => {
    const state = rootState({ query: 'lost', selectedGenre: 'Drama', sortBy: 'rating', draft: 'los' });

    expect(selectQuery(state)).toBe('lost');
    expect(selectSelectedGenre(state)).toBe('Drama');
    expect(selectSortBy(state)).toBe('rating');
    expect(selectDraft(state)).toBe('los');
  });

  it('read the status and the error', () => {
    const state = rootState({ status: 'failed', error: 'boom' });

    expect(selectStatus(state)).toBe('failed');
    expect(selectError(state)).toBe('boom');
  });
});
