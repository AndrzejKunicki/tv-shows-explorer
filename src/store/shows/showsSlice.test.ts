import { describe, expect, it } from 'vitest';
import {
  fetchShows,
  genreReset,
  genreSelected,
  initialState,
  pageChanged,
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

  it('changes page and clears search', () => {
    expect(showsReducer(initialState, pageChanged(2)).page).toBe(2);
    expect(showsReducer({ ...initialState, items: testShows }, searchCleared())).toEqual(initialState);
  });
});
