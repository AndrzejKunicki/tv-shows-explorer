import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchShows } from '@src/api/tvmaze';
import { createStore } from '@src/store/store';
import { findCachedResults } from './searchCache';
import { abortSearch, searchQuery } from './searchQuery';
import { deferredRequest, settle } from './testSearchRequests';
import { makeShow, testShows } from './testShows';

vi.mock('@src/api/tvmaze', () => ({ searchShows: vi.fn() }));
const searchShowsMock = vi.mocked(searchShows);

const search = async (store: ReturnType<typeof createStore>, query: string) => {
  store.dispatch(searchQuery(query));
  await settle();
};

describe('searchQuery', () => {
  // Braces matter: a function returned from beforeEach is run by Vitest as teardown
  beforeEach(() => {
    searchShowsMock.mockReset();
  });

  it('fetches a new query and stores the results', async () => {
    searchShowsMock.mockResolvedValue(testShows);
    const store = createStore();

    await search(store, '  Banana ');

    expect(searchShowsMock).toHaveBeenCalledTimes(1);
    expect(searchShowsMock.mock.calls[0][0]).toBe('Banana');
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'Banana' });
  });

  it('shows the previous response instead of fetching again (banana -> banan -> banana)', async () => {
    searchShowsMock.mockResolvedValueOnce(testShows).mockResolvedValueOnce([makeShow(99, [])]);
    const store = createStore();

    await search(store, 'banana');
    await search(store, 'banan');
    await search(store, 'banana');

    expect(searchShowsMock).toHaveBeenCalledTimes(2);
    expect(store.getState().shows.items).toEqual(testShows);
  });

  it('fetches a longer query even when a shorter one returned nothing (banana -> bananaxyz)', async () => {
    searchShowsMock.mockResolvedValueOnce([]).mockResolvedValueOnce(testShows);
    const store = createStore();

    await search(store, 'banana');
    await search(store, 'bananaxyz');

    expect(searchShowsMock).toHaveBeenCalledTimes(2);
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'bananaxyz', items: testShows });
  });

  it('clears results for an empty query but keeps the cache', async () => {
    searchShowsMock.mockResolvedValue(testShows);
    const store = createStore();

    await search(store, 'banana');
    await search(store, '   ');

    expect(store.getState().shows).toMatchObject({ status: 'idle', items: [] });
    expect(findCachedResults(store.getState().shows.cache, 'banana')).toEqual(testShows);
  });

  it('aborts the previous request, so its late response never replaces newer results', async () => {
    const old = deferredRequest(searchShowsMock);
    searchShowsMock.mockResolvedValueOnce(testShows);
    const store = createStore();

    store.dispatch(searchQuery('breaking bad'));
    await search(store, 'lost');
    old.resolve([makeShow(99, [])]);
    await settle();

    expect(old.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'lost', items: testShows });
    expect(findCachedResults(store.getState().shows.cache, 'breaking bad')).toBeNull();
  });

  it('aborts the request in flight when the results come from the cache', async () => {
    searchShowsMock.mockResolvedValueOnce(testShows);
    const store = createStore();
    await search(store, 'banana');
    const lost = deferredRequest(searchShowsMock);

    store.dispatch(searchQuery('lost'));
    await search(store, 'banana');

    expect(lost.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'banana', items: testShows });
  });

  it('aborts the request in flight when the query is cleared', async () => {
    const lost = deferredRequest(searchShowsMock);
    const store = createStore();

    store.dispatch(searchQuery('lost'));
    await search(store, '');

    expect(lost.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ status: 'idle', error: null, items: [] });
  });

  it('abortSearch stops the request in flight and leaves the loading state untouched', async () => {
    const lost = deferredRequest(searchShowsMock);
    const store = createStore();

    store.dispatch(searchQuery('lost'));
    store.dispatch(abortSearch());
    await settle();

    expect(lost.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ query: 'lost', error: null });
  });
});
