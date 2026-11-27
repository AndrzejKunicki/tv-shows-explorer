import {
  draftChanged,
  genreReset,
  genreSelected,
  initialState,
  pageChanged,
  resultsReceived,
  searchCleared,
  searchFailed,
  searchStarted,
  showsReducer,
  sortChanged,
  type ShowsState,
} from './showsSlice';
import { makeSearchPage, testShows } from './testShows';

describe('showsSlice', () => {
  it('starts empty and idle', () => {
    expect(showsReducer(undefined, { type: 'init' })).toEqual(initialState);
  });

  it('resets genre and page when a new search starts', () => {
    const state: ShowsState = { ...initialState, selectedGenre: 'Crime', page: 3 };
    const next = showsReducer(state, searchStarted('murder'));

    expect(next).toMatchObject({ status: 'loading', query: 'murder', selectedGenre: null, page: 1, error: null });
  });

  it('stores the page sent by the server', () => {
    const page = makeSearchPage({ query: 'murder', items: testShows.slice(0, 3), page: 2, pageCount: 3, genres: ['Crime'] });
    const next = showsReducer(showsReducer(initialState, searchStarted('murder')), resultsReceived(page));

    expect(next).toMatchObject({
      status: 'succeeded',
      query: 'murder',
      items: page.items,
      page: 2,
      pageCount: 3,
      genres: ['Crime'],
      error: null,
    });
  });

  it('stores the error on failure and drops the results', () => {
    const withResults = showsReducer(initialState, resultsReceived(makeSearchPage({ items: testShows, pageCount: 3 })));
    const next = showsReducer(withResults, searchFailed('boom'));

    expect(next).toMatchObject({ status: 'failed', error: 'boom', items: [], pageCount: 0 });
  });

  it('selecting and resetting the genre goes back to the first page', () => {
    const state: ShowsState = { ...initialState, page: 2 };

    expect(showsReducer(state, genreSelected('Comedy'))).toMatchObject({ selectedGenre: 'Comedy', page: 1 });
    expect(showsReducer(state, genreReset())).toMatchObject({ selectedGenre: null, page: 1 });
  });

  it('changes the sort order and goes back to the first page', () => {
    const state: ShowsState = { ...initialState, page: 3 };

    expect(showsReducer(state, sortChanged('rating'))).toMatchObject({ sortBy: 'rating', page: 1 });
  });

  it('changes the page', () => {
    expect(showsReducer(initialState, pageChanged(2)).page).toBe(2);
  });

  it('clears the search but keeps the field text and the sort order', () => {
    const state: ShowsState = { ...initialState, items: testShows, query: 'q', draft: ' ', sortBy: 'rating' };

    expect(showsReducer(state, searchCleared())).toEqual({ ...initialState, draft: ' ', sortBy: 'rating' });
  });

  it('stores the search field text', () => {
    expect(showsReducer(initialState, draftChanged('Lost')).draft).toBe('Lost');
  });
});
