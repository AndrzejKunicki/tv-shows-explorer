import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchShows } from '@src/api/showsApi';
import { genreSelected, pageChanged, sortChanged } from '@src/store/shows/showsSlice';
import { makeSearchPage, testShows } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { findShows } from './findShows';
import { cancelSearch } from './searchRequest';
import { deferredRequest } from './testSearchRequests';

vi.mock('@src/api/showsApi', () => ({ searchShows: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const searchShowsMock = vi.mocked(searchShows);

describe('findShows', () => {
  let store: AppStore;

  beforeEach(() => {
    cancelSearch();
    searchShowsMock.mockReset();
    store = resetAppStore();
  });

  it('searches the first page of all genres, keeping the sort order', async () => {
    searchShowsMock.mockResolvedValue(makeSearchPage({ query: 'Banana', items: testShows.slice(0, 3) }));
    store.dispatch(sortChanged('rating'));
    store.dispatch(genreSelected('Drama'));
    store.dispatch(pageChanged(3));

    const result = await findShows('  Banana ');

    expect(result).toEqual({ error: null });
    expect(searchShowsMock.mock.calls[0][0]).toEqual({ query: 'Banana', genre: null, sort: 'rating', page: 1 });
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'Banana', items: testShows.slice(0, 3) });
  });

  it('does nothing when the results of the same query are shown (a space typed at the end)', async () => {
    searchShowsMock.mockResolvedValue(makeSearchPage({ query: 'banana', pageCount: 3 }));
    await findShows('banana');
    store.dispatch(genreSelected('Drama'));
    store.dispatch(pageChanged(2));

    await findShows('banana ');

    expect(searchShowsMock).toHaveBeenCalledTimes(1);
    expect(store.getState().shows).toMatchObject({ selectedGenre: 'Drama', page: 2 });
  });

  it('searches the same query again after a failure', async () => {
    searchShowsMock.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(makeSearchPage({ query: 'lost' }));

    await findShows('lost');
    await findShows('lost');

    expect(searchShowsMock).toHaveBeenCalledTimes(2);
    expect(store.getState().shows.status).toBe('succeeded');
  });

  it('is loading while the request is in flight', () => {
    deferredRequest(searchShowsMock);

    findShows('lost');

    expect(store.getState().shows).toMatchObject({ status: 'loading', query: 'lost' });
  });

  it('returns the error when the request fails', async () => {
    searchShowsMock.mockRejectedValue(new Error('Network down'));

    const result = await findShows('lost');

    expect(result).toEqual({ error: 'Network down' });
    expect(store.getState().shows).toMatchObject({ status: 'failed', error: 'Network down' });
  });

  it('clears the results for an empty query without a request, aborting the one in flight', async () => {
    const lost = deferredRequest(searchShowsMock);

    findShows('lost');
    await findShows('   ');

    expect(lost.signal?.aborted).toBe(true);
    expect(searchShowsMock).toHaveBeenCalledTimes(1);
    expect(store.getState().shows).toMatchObject({ status: 'idle', query: '', items: [] });
  });
});
