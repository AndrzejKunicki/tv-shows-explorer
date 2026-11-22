import { beforeEach, describe, expect, it, vi } from 'vitest';
import { testShows } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { discoverStore } from './discoverStore';

vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('discoverStore', () => {
  let store: AppStore;

  beforeEach(() => {
    store = resetAppStore();
  });

  it('reads the status of a feed', () => {
    expect(discoverStore.getFeedStatus('topRated')).toBe('idle');

    discoverStore.startFeed('topRated');

    expect(discoverStore.getFeedStatus('topRated')).toBe('loading');
  });

  it('stores the shows of a loaded feed', () => {
    discoverStore.setFeed('hiddenGems', testShows);

    expect(store.getState().discover.hiddenGems).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('marks a feed as failed', () => {
    discoverStore.startFeed('airingToday');
    discoverStore.failFeed('airingToday');

    expect(discoverStore.getFeedStatus('airingToday')).toBe('failed');
  });
});
