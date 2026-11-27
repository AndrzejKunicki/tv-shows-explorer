import { makeShow } from '@src/store/shows/testShows';
import { addFavorite, fetchFavorites, removeFavorite } from './favoritesApi';
import { request } from './request';

vi.mock('./request', () => ({ request: vi.fn() }));
const requestMock = vi.mocked(request);

describe('favorites api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('fetchFavorites requests the list', async () => {
    requestMock.mockResolvedValue([makeShow(1, [])]);

    const shows = await fetchFavorites();

    expect(requestMock).toHaveBeenCalledWith('/api/favorites');
    expect(shows).toEqual([makeShow(1, [])]);
  });

  it('addFavorite sends PUT with the show id and returns the show', async () => {
    requestMock.mockResolvedValue(makeShow(7, []));

    const show = await addFavorite(7);

    expect(requestMock).toHaveBeenCalledWith('/api/favorites/7', { method: 'PUT' });
    expect(show).toEqual(makeShow(7, []));
  });

  it('removeFavorite sends DELETE with the show id', async () => {
    requestMock.mockResolvedValue(undefined);

    await removeFavorite(7);

    expect(requestMock).toHaveBeenCalledWith('/api/favorites/7', { method: 'DELETE' });
  });
});
