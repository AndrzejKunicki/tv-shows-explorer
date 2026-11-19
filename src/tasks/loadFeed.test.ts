import { beforeEach, describe, expect, it, vi } from 'vitest';
import { testShows } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { loadFeed } from './loadFeed';

vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('loadFeed', () => {
  let store: AppStore;

  beforeEach(() => {
    store = resetAppStore();
  });

  it('stores the loaded shows and returns no error', async () => {
    const result = await loadFeed('index', async () => testShows);

    expect(result).toEqual({ error: null });
    expect(store.getState().discover.index).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('marks the feed as loading while it loads', () => {
    loadFeed('index', () => new Promise(() => {}));

    expect(store.getState().discover.index.status).toBe('loading');
  });

  it('loads a feed only once, even when called twice (StrictMode effects)', async () => {
    const load = vi.fn(async () => testShows);

    await Promise.all([loadFeed('index', load), loadFeed('index', load)]);
    await loadFeed('index', load);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('marks the feed as failed and returns the error', async () => {
    const result = await loadFeed('schedule', async () => {
      throw new Error('offline');
    });

    expect(result).toEqual({ error: 'offline' });
    expect(store.getState().discover.schedule).toEqual({ status: 'failed', shows: [] });
  });

  it('retries a failed feed on the next call', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(testShows);

    await loadFeed('gems', load);
    await loadFeed('gems', load);

    expect(load).toHaveBeenCalledTimes(2);
    expect(store.getState().discover.gems).toEqual({ status: 'succeeded', shows: testShows });
  });
});
