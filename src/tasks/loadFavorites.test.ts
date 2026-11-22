import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchFavorites } from '@src/api/favoritesApi';
import { makeShow } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { loadFavorites } from './loadFavorites';

vi.mock('@src/api/favoritesApi', () => ({ fetchFavorites: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const fetchFavoritesMock = vi.mocked(fetchFavorites);

describe('loadFavorites', () => {
  let store: AppStore;

  beforeEach(() => {
    fetchFavoritesMock.mockReset();
    store = resetAppStore();
  });

  it('stores the favorites from the server', async () => {
    fetchFavoritesMock.mockResolvedValue([makeShow(1, [])]);

    const result = await loadFavorites();

    expect(result).toEqual({ error: null });
    expect(store.getState().favorites).toEqual({ items: [makeShow(1, [])], status: 'succeeded' });
  });

  it('loads only once, even when called twice (StrictMode effects)', async () => {
    fetchFavoritesMock.mockResolvedValue([]);

    await Promise.all([loadFavorites(), loadFavorites()]);
    await loadFavorites();

    expect(fetchFavoritesMock).toHaveBeenCalledTimes(1);
  });

  it('returns the error, and loads again on the next call', async () => {
    fetchFavoritesMock.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([makeShow(2, [])]);

    const failed = await loadFavorites();

    expect(failed).toEqual({ error: 'offline' });
    expect(store.getState().favorites.status).toBe('failed');

    await loadFavorites();

    expect(store.getState().favorites.items).toEqual([makeShow(2, [])]);
  });
});
