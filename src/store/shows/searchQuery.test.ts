import { beforeEach, describe, expect, it, vi } from 'vitest';
import { searchShows } from '@src/api/tvmaze';
import { createStore } from '@src/store/store';
import { findCachedResults, searchQuery } from './searchQuery';
import { makeShow, testShows } from './testShows';

vi.mock('@src/api/tvmaze', () => ({ searchShows: vi.fn() }));
const searchShowsMock = vi.mocked(searchShows);

const search = async (store: ReturnType<typeof createStore>, query: string) => {
  await store.dispatch(searchQuery(query));
};

describe('findCachedResults', () => {
  const cache = { banana: testShows, murder: [] };

  it('returns exact hit', () => {
    expect(findCachedResults(cache, 'banana')).toBe(testShows);
  });

  it('returns cached empty result for the same query', () => {
    expect(findCachedResults(cache, 'murder')).toEqual([]);
  });

  it('returns null when a request is needed', () => {
    expect(findCachedResults(cache, 'banan')).toBeNull();
    expect(findCachedResults(cache, 'bananas')).toBeNull();
    expect(findCachedResults(cache, 'murderxyz')).toBeNull();
  });

  it('ignores keys inherited from Object.prototype', () => {
    expect(findCachedResults(cache, 'constructor')).toBeNull();
    expect(findCachedResults(cache, 'tostring')).toBeNull();
  });
});

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

  it('fetches queries named like Object.prototype members (constructor)', async () => {
    searchShowsMock.mockResolvedValue(testShows);
    const store = createStore();

    await search(store, 'constructor');

    expect(searchShowsMock).toHaveBeenCalledTimes(1);
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', items: testShows });
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
    expect(store.getState().shows.cache.banana).toEqual(testShows);
  });
});
