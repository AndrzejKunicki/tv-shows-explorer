import { makeShow } from '#src/api/testShows.ts';
import { addFavorite } from '#src/tasks/addFavorite.ts';
import { listFavorites } from '#src/tasks/listFavorites.ts';
import { removeFavorite } from '#src/tasks/removeFavorite.ts';
import { request } from '#src/testServer.ts';

vi.mock('#src/tasks/addFavorite.ts', () => ({ addFavorite: vi.fn() }));
vi.mock('#src/tasks/listFavorites.ts', () => ({ listFavorites: vi.fn() }));
vi.mock('#src/tasks/removeFavorite.ts', () => ({ removeFavorite: vi.fn() }));

describe('favorites routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listFavorites).mockReturnValue([makeShow(2, []), makeShow(1, [])]);
    vi.mocked(addFavorite).mockResolvedValue({ ok: true, show: makeShow(7, []) });
  });

  it('GET /api/favorites returns the favorite shows', async () => {
    const response = await request('/api/favorites');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([makeShow(2, []), makeShow(1, [])]);
  });

  it('PUT /api/favorites/:id adds the show and returns it', async () => {
    const response = await request('/api/favorites/7', { method: 'PUT' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(makeShow(7, []));
    expect(addFavorite).toHaveBeenCalledWith(7);
  });

  it('PUT /api/favorites/:id answers 404 for an unknown show', async () => {
    vi.mocked(addFavorite).mockResolvedValue({ ok: false, error: 'not-found' });

    const response = await request('/api/favorites/999', { method: 'PUT' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Show 999 was not found' });
  });

  it('DELETE /api/favorites/:id removes the show', async () => {
    const response = await request('/api/favorites/7', { method: 'DELETE' });

    expect(response.status).toBe(204);
    expect(removeFavorite).toHaveBeenCalledWith(7);
  });

  it('answers 400 for an id that is not a whole number from 1', async () => {
    const wrong = await request('/api/favorites/abc', { method: 'PUT' });
    const zero = await request('/api/favorites/0', { method: 'DELETE' });

    expect(wrong.status).toBe(400);
    expect(zero.status).toBe(400);
    expect(addFavorite).not.toHaveBeenCalled();
    expect(removeFavorite).not.toHaveBeenCalled();
  });
});
