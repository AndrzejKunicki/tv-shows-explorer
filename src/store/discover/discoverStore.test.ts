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
    expect(discoverStore.getFeedStatus('index')).toBe('idle');

    discoverStore.startFeed('index');

    expect(discoverStore.getFeedStatus('index')).toBe('loading');
  });

  it('stores the shows of a loaded feed', () => {
    discoverStore.setFeed('gems', testShows);

    expect(store.getState().discover.gems).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('marks a feed as failed', () => {
    discoverStore.startFeed('schedule');
    discoverStore.failFeed('schedule');

    expect(discoverStore.getFeedStatus('schedule')).toBe('failed');
  });
});
