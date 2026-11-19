import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchShows } from '@src/api/tvmaze';
import { findCachedResults } from '@src/store/shows/searchCache';
import { makeShow, testShows } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { findShows } from './findShows';
import { cancelSearch } from './searchRequest';
import { deferredRequest, settle } from './testSearchRequests';

vi.mock('@src/api/tvmaze', () => ({ searchShows: vi.fn() }));
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

  it('fetches a new query, stores the results and returns no error', async () => {
    searchShowsMock.mockResolvedValue(testShows);

    const result = await findShows('  Banana ');

    expect(result).toEqual({ error: null });
    expect(searchShowsMock).toHaveBeenCalledTimes(1);
    expect(searchShowsMock.mock.calls[0][0]).toBe('Banana');
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'Banana', items: testShows });
  });

  it('stores and returns the error when the request fails', async () => {
    searchShowsMock.mockRejectedValue(new Error('Network down'));

    const result = await findShows('lost');

    expect(result).toEqual({ error: 'Network down' });
    expect(store.getState().shows).toMatchObject({ status: 'failed', error: 'Network down', items: [] });
  });

  it('shows the previous response instead of fetching again (banana -> banan -> banana)', async () => {
    searchShowsMock.mockResolvedValueOnce(testShows).mockResolvedValueOnce([makeShow(99, [])]);

    await findShows('banana');
    await findShows('banan');
    await findShows('banana');

    expect(searchShowsMock).toHaveBeenCalledTimes(2);
    expect(store.getState().shows.items).toEqual(testShows);
  });

  it('fetches a longer query even when a shorter one returned nothing (banana -> bananaxyz)', async () => {
    searchShowsMock.mockResolvedValueOnce([]).mockResolvedValueOnce(testShows);

    await findShows('banana');
    await findShows('bananaxyz');

    expect(searchShowsMock).toHaveBeenCalledTimes(2);
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'bananaxyz', items: testShows });
  });

  it('clears results for an empty query but keeps the cache', async () => {
    searchShowsMock.mockResolvedValue(testShows);

    await findShows('banana');
    await findShows('   ');

    expect(store.getState().shows).toMatchObject({ status: 'idle', items: [] });
    expect(findCachedResults(store.getState().shows.cache, 'banana')).toEqual(testShows);
  });

  it('aborts the previous request, so its late response never replaces newer results', async () => {
    const old = deferredRequest(searchShowsMock);
    searchShowsMock.mockResolvedValueOnce(testShows);

    const oldSearch = findShows('breaking bad');
    await findShows('lost');
    old.resolve([makeShow(99, [])]);
    await settle();

    expect(await oldSearch).toEqual({ error: null });
    expect(old.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'lost', items: testShows });
    expect(findCachedResults(store.getState().shows.cache, 'breaking bad')).toBeNull();
  });

  it('aborts the request in flight when the results come from the cache', async () => {
    searchShowsMock.mockResolvedValueOnce(testShows);
    await findShows('banana');
    const lost = deferredRequest(searchShowsMock);

    findShows('lost');
    await findShows('banana');

    expect(lost.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'banana', items: testShows });
  });

  it('is loading while the request is in flight and aborts it when the query is cleared', async () => {
    const lost = deferredRequest(searchShowsMock);

    findShows('lost');

    expect(store.getState().shows).toMatchObject({ status: 'loading', query: 'lost' });

    await findShows('');

    expect(lost.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ status: 'idle', error: null, items: [] });
  });
});
