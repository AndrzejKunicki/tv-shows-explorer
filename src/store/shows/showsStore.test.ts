import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { showsStore } from './showsStore';
import { makeSearchPage, testShows } from './testShows';

vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('showsStore', () => {
  let store: AppStore;

  beforeEach(() => {
    store = resetAppStore();
  });

  it('runs a search: started, then the results page received', () => {
    showsStore.startSearch('lost');

    expect(store.getState().shows).toMatchObject({ status: 'loading', query: 'lost' });

    showsStore.receiveResults(makeSearchPage({ items: testShows, page: 2, pageCount: 3 }));

    expect(store.getState().shows).toMatchObject({ status: 'succeeded', items: testShows });
    expect(showsStore.getPage()).toBe(2);
    expect(showsStore.getPageCount()).toBe(3);
  });

  it('stores a failed search', () => {
    showsStore.startSearch('lost');
    showsStore.failSearch('Network down');

    expect(store.getState().shows).toMatchObject({ status: 'failed', error: 'Network down', items: [] });
  });

  it('clears the search', () => {
    showsStore.receiveResults(makeSearchPage({ items: testShows }));
    showsStore.clearSearch();

    expect(store.getState().shows).toMatchObject({ status: 'idle', query: '', items: [] });
  });

  it('returns the search parameters of the results page', () => {
    showsStore.startSearch('lost');
    showsStore.selectGenre('Drama');
    showsStore.setSort('rating');
    showsStore.setPage(2);

    expect(showsStore.getSearchParams()).toEqual({ query: 'lost', genre: 'Drama', sort: 'rating', page: 2 });
    expect(showsStore.getSortBy()).toBe('rating');
  });

  it('tells whether the results of the query are shown', () => {
    showsStore.startSearch('lost');

    expect(showsStore.hasResultsFor('lost')).toBe(false);

    showsStore.receiveResults(makeSearchPage({ query: 'lost' }));

    expect(showsStore.hasResultsFor('lost')).toBe(true);
    expect(showsStore.hasResultsFor('lost girl')).toBe(false);
  });

  it('selects and resets the genre', () => {
    showsStore.selectGenre('Drama');

    expect(showsStore.getSelectedGenre()).toBe('Drama');

    showsStore.resetGenre();

    expect(showsStore.getSelectedGenre()).toBeNull();
  });

  it('stores the search field text', () => {
    showsStore.setDraft('Lost');

    expect(store.getState().shows.draft).toBe('Lost');
  });
});
