import { describe, expect, it } from 'vitest';
import {
  draftChanged,
  fetchShows,
  sortChanged,
  genreReset,
  genreSelected,
  initialState,
  pageChanged,
  resultsRestored,
  searchCleared,
  showsReducer,
  type ShowsState,
} from './showsSlice';
import { testShows } from './testShows';

const pending = (requestId: string, query = 'murder') =>
  fetchShows.pending(requestId, query);
const fulfilled = (requestId: string, query = 'murder') =>
  fetchShows.fulfilled(testShows, requestId, query);

describe('showsSlice', () => {
  it('starts empty and idle', () => {
    expect(showsReducer(undefined, { type: 'init' })).toEqual(initialState);
  });

  it('resets genre and page when a new search starts', () => {
    const state: ShowsState = { ...initialState, selectedGenre: 'Crime', page: 3 };
    const next = showsReducer(state, pending('r1'));

    expect(next).toMatchObject({ status: 'loading', query: 'murder', selectedGenre: null, page: 1 });
  });

  it('stores results of the latest request', () => {
    const next = showsReducer(showsReducer(initialState, pending('r1')), fulfilled('r1'));

    expect(next.status).toBe('succeeded');
    expect(next.items).toHaveLength(testShows.length);
  });

  it('ignores responses of outdated requests', () => {
    let state = showsReducer(initialState, pending('old', 'a'));
    state = showsReducer(state, pending('new', 'b'));
    state = showsReducer(state, fulfilled('old', 'a'));

    expect(state.status).toBe('loading');
    expect(state.items).toEqual([]);
  });

  it('stores error on failure', () => {
    let state = showsReducer(initialState, pending('r1'));
    state = showsReducer(state, fetchShows.rejected(new Error('boom'), 'r1', 'murder'));

    expect(state).toMatchObject({ status: 'failed', error: 'boom', items: [] });
  });

  it('selecting and resetting genre goes back to first page', () => {
    const state: ShowsState = { ...initialState, page: 2 };

    expect(showsReducer(state, genreSelected('Comedy'))).toMatchObject({ selectedGenre: 'Comedy', page: 1 });
    expect(showsReducer(state, genreReset())).toMatchObject({ selectedGenre: null, page: 1 });
  });

  it('caches responses by normalized query, also outdated ones', () => {
    let state = showsReducer(initialState, pending('old', ' Murder '));
    state = showsReducer(state, pending('new', 'b'));
    state = showsReducer(state, fulfilled('old', ' Murder '));

    expect(state.cache.murder).toEqual(testShows);
    expect(state.items).toEqual([]);
  });

  it('restores cached results and invalidates the pending request', () => {
    const state = showsReducer(
      { ...initialState, selectedGenre: 'Crime', page: 2, currentRequestId: 'r1', status: 'loading' },
      resultsRestored({ query: 'banana', items: testShows }),
    );

    expect(state).toMatchObject({ status: 'succeeded', query: 'banana', page: 1, currentRequestId: null });
    expect(state.selectedGenre).toBeNull();
  });

  it('changes page and clears search but keeps cache, field text and sort order', () => {
    const cache = { murder: testShows };
    const state: ShowsState = { ...initialState, items: testShows, cache, draft: ' ', sortBy: 'rating' };

    expect(showsReducer(initialState, pageChanged(2)).page).toBe(2);
    expect(showsReducer(state, searchCleared())).toEqual({ ...initialState, cache, draft: ' ', sortBy: 'rating' });
  });

  it('stores the search field text', () => {
    expect(showsReducer(initialState, draftChanged('Lost')).draft).toBe('Lost');
  });

  it('changes sort order and goes back to first page', () => {
    const state: ShowsState = { ...initialState, page: 3 };

    expect(showsReducer(state, sortChanged('rating'))).toMatchObject({ sortBy: 'rating', page: 1 });
  });
});
