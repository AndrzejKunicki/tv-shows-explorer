import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addFavorite, removeFavorite } from '@src/api/favoritesApi';
import { favoritesStore } from '@src/store/favorites/favoritesStore';
import { makeShow } from '@src/store/shows/testShows';
import { toggleFavorite } from './toggleFavorite';

vi.mock('@src/api/favoritesApi', () => ({ addFavorite: vi.fn(), removeFavorite: vi.fn() }));
vi.mock('@src/store/favorites/favoritesStore', () => ({
  favoritesStore: { isFavorite: vi.fn(), add: vi.fn(), remove: vi.fn() },
}));
const store = vi.mocked(favoritesStore);
const show = makeShow(7, []);

describe('toggleFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a show on the server and keeps the show sent back', async () => {
    store.isFavorite.mockReturnValue(false);
    vi.mocked(addFavorite).mockResolvedValue({ ...show, name: 'From server' });

    const result = await toggleFavorite(show);

    expect(result).toEqual({ error: null, isFavorite: true });
    expect(addFavorite).toHaveBeenCalledWith(7);
    expect(store.add).toHaveBeenCalledWith({ ...show, name: 'From server' });
  });

  it('removes a favorite on the server, then locally', async () => {
    store.isFavorite.mockReturnValue(true);
    vi.mocked(removeFavorite).mockResolvedValue(undefined);

    const result = await toggleFavorite(show);

    expect(result).toEqual({ error: null, isFavorite: false });
    expect(removeFavorite).toHaveBeenCalledWith(7);
    expect(store.remove).toHaveBeenCalledWith(7);
  });

  it('changes nothing locally when the server fails', async () => {
    store.isFavorite.mockReturnValue(false);
    vi.mocked(addFavorite).mockRejectedValue(new Error('API error: 502'));

    const result = await toggleFavorite(show);

    expect(result).toEqual({ error: 'API error: 502', isFavorite: false });
    expect(store.add).not.toHaveBeenCalled();
  });
});
