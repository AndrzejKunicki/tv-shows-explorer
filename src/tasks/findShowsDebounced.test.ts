import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { searchShows } from '@src/api/tvmaze';
import { makeShow, testShows } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { findShows } from './findShows';
import { findShowsDebounced, SEARCH_DEBOUNCE_MS } from './findShowsDebounced';
import { cancelSearch } from './searchRequest';
import { deferredRequest } from './testSearchRequests';

vi.mock('@src/api/tvmaze', () => ({ searchShows: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const searchShowsMock = vi.mocked(searchShows);

describe('findShowsDebounced', () => {
  let store: AppStore;

  beforeEach(() => {
    vi.useFakeTimers();
    searchShowsMock.mockReset().mockResolvedValue(testShows);
    store = resetAppStore();
  });

  afterEach(() => {
    cancelSearch();
    vi.useRealTimers();
  });

  it('searches once the text has not changed for the debounce time', async () => {
    findShowsDebounced('lost');
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS - 1);

    expect(searchShowsMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);

    expect(searchShowsMock).toHaveBeenCalledWith('lost', expect.anything());
    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'lost', items: testShows });
  });

  it('searches only for the last text typed within the debounce time', async () => {
    findShowsDebounced('lo');
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS - 1);
    findShowsDebounced('lost');
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);

    expect(searchShowsMock).toHaveBeenCalledTimes(1);
    expect(searchShowsMock).toHaveBeenCalledWith('lost', expect.anything());
  });

  it('does not search when cancelled', async () => {
    findShowsDebounced('lost');
    cancelSearch();
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);

    expect(searchShowsMock).not.toHaveBeenCalled();
  });

  it('typing aborts the request in flight at once, so its late response never shows', async () => {
    const old = deferredRequest(searchShowsMock);
    findShows('breaking');

    findShowsDebounced('lost');
    old.resolve([makeShow(99, [])]);
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS - 1);

    expect(old.signal?.aborted).toBe(true);
    expect(store.getState().shows).toMatchObject({ status: 'loading', query: 'breaking', items: [] });

    await vi.advanceTimersByTimeAsync(1);

    expect(store.getState().shows).toMatchObject({ status: 'succeeded', query: 'lost', items: testShows });
  });
});
