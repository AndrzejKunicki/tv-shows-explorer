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
    const result = await loadFeed('topRated', async () => testShows);

    expect(result).toEqual({ error: null });
    expect(store.getState().discover.topRated).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('marks the feed as loading while it loads', () => {
    loadFeed('topRated', () => new Promise(() => {}));

    expect(store.getState().discover.topRated.status).toBe('loading');
  });

  it('loads a feed only once, even when called twice (StrictMode effects)', async () => {
    const load = vi.fn(async () => testShows);

    await Promise.all([loadFeed('topRated', load), loadFeed('topRated', load)]);
    await loadFeed('topRated', load);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('marks the feed as failed and returns the error', async () => {
    const result = await loadFeed('airingToday', async () => {
      throw new Error('offline');
    });

    expect(result).toEqual({ error: 'offline' });
    expect(store.getState().discover.airingToday).toEqual({ status: 'failed', shows: [] });
  });

  it('retries a failed feed on the next call', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(testShows);

    await loadFeed('hiddenGems', load);
    await loadFeed('hiddenGems', load);

    expect(load).toHaveBeenCalledTimes(2);
    expect(store.getState().discover.hiddenGems).toEqual({ status: 'succeeded', shows: testShows });
  });
});
