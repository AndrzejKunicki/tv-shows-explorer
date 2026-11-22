import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { PAGE_SIZE } from './showsSlice';
import { showsStore } from './showsStore';
import { makeShow, testShows } from './testShows';

vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

const manyShows = Array.from({ length: PAGE_SIZE * 2 }, (_, index) => makeShow(index + 1, ['Drama']));

describe('showsStore', () => {
  let store: AppStore;

  beforeEach(() => {
    store = resetAppStore();
  });

  it('runs a search: started, received and cached', () => {
    showsStore.startSearch('lost');

    expect(store.getState().shows).toMatchObject({ status: 'loading', query: 'lost' });

    showsStore.receiveResults('lost', testShows);

    expect(store.getState().shows).toMatchObject({ status: 'succeeded', items: testShows });
    expect(showsStore.getCachedResults(' LOST ')).toEqual(testShows);
    expect(showsStore.getCachedResults('other')).toBeNull();
  });

  it('stores a failed search', () => {
    showsStore.startSearch('lost');
    showsStore.failSearch('Network down');

    expect(store.getState().shows).toMatchObject({ status: 'failed', error: 'Network down', items: [] });
  });

  it('restores results and clears the search', () => {
    showsStore.restoreResults('lost', testShows);

    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'lost', items: testShows });

    showsStore.clearSearch();

    expect(store.getState().shows).toMatchObject({ status: 'idle', query: '', items: [] });
  });

  it('reads and writes the page', () => {
    showsStore.restoreResults('q', manyShows);
    showsStore.setPage(2);

    expect(showsStore.getPage()).toBe(2);
    expect(showsStore.getPageCount()).toBe(2);
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
