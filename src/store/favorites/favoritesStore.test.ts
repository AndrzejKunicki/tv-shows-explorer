import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { favoritesStore } from './favoritesStore';

vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('favoritesStore', () => {
  let store: AppStore;

  beforeEach(() => {
    store = resetAppStore();
  });

  it('loads the favorites: loading, then the list', () => {
    favoritesStore.startLoading();

    expect(favoritesStore.getStatus()).toBe('loading');

    favoritesStore.setFavorites([makeShow(1, [])]);

    expect(store.getState().favorites).toEqual({ items: [makeShow(1, [])], status: 'succeeded' });
  });

  it('marks a failed load', () => {
    favoritesStore.failLoading();

    expect(favoritesStore.getStatus()).toBe('failed');
  });

  it('adds and removes a favorite', () => {
    favoritesStore.add(makeShow(1, []));

    expect(favoritesStore.isFavorite(1)).toBe(true);

    favoritesStore.remove(1);

    expect(favoritesStore.isFavorite(1)).toBe(false);
  });
});
