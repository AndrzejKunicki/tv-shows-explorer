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
import { CACHE_LIMIT } from './searchCache';
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

  it('stores error on failure', () => {
    let state = showsReducer(initialState, pending('r1'));
    state = showsReducer(state, fetchShows.rejected(new Error('boom'), 'r1', 'murder'));

    expect(state).toMatchObject({ status: 'failed', error: 'boom', items: [] });
  });

  it('ignores an aborted request, because a newer search already owns the state', () => {
    let state = showsReducer(initialState, pending('old', 'a'));
    state = showsReducer(state, pending('new', 'b'));
    // RTK marks a rejection as `meta.aborted` when the error is an AbortError
    const aborted = fetchShows.rejected(new DOMException('Aborted', 'AbortError'), 'old', 'a');
    state = showsReducer(state, aborted);

    expect(aborted.meta.aborted).toBe(true);

    expect(state).toMatchObject({ status: 'loading', query: 'b', error: null, items: [] });
  });

  it('selecting and resetting genre goes back to first page', () => {
    const state: ShowsState = { ...initialState, page: 2 };

    expect(showsReducer(state, genreSelected('Comedy'))).toMatchObject({ selectedGenre: 'Comedy', page: 1 });
    expect(showsReducer(state, genreReset())).toMatchObject({ selectedGenre: null, page: 1 });
  });

  it('caches responses by normalized query', () => {
    const state = showsReducer(showsReducer(initialState, pending('r1', ' Murder ')), fulfilled('r1', ' Murder '));

    expect(state.cache).toEqual([{ key: 'murder', shows: testShows }]);
  });

  it(`keeps at most ${CACHE_LIMIT} cached responses`, () => {
    let state = initialState;
    for (let index = 0; index <= CACHE_LIMIT; index++) {
      state = showsReducer(state, fulfilled(`r${index}`, `q${index}`));
    }

    expect(state.cache).toHaveLength(CACHE_LIMIT);
    expect(state.cache[0].key).toBe('q1');
  });

  it('restores cached results and goes back to the first page of all genres', () => {
    const state = showsReducer(
      { ...initialState, selectedGenre: 'Crime', page: 2, status: 'loading' },
      resultsRestored({ query: 'banana', items: testShows }),
    );

    expect(state).toMatchObject({ status: 'succeeded', query: 'banana', page: 1, items: testShows });
    expect(state.selectedGenre).toBeNull();
  });

  it('changes page and clears search but keeps cache, field text and sort order', () => {
    const cache = [{ key: 'murder', shows: testShows }];
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
