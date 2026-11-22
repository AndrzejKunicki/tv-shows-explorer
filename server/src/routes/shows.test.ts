import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { findShowsPage } from '#src/tasks/findShowsPage.ts';
import { getShowIndex } from '#src/tasks/getShowIndex.ts';
import { request } from '#src/testServer.ts';

vi.mock('#src/tasks/findShowsPage.ts', () => ({ findShowsPage: vi.fn() }));
vi.mock('#src/tasks/getShowIndex.ts', () => ({ getShowIndex: vi.fn() }));

const searchPage = { query: 'lost', items: [], page: 2, pageCount: 3, total: 9, genres: ['Drama'] };

describe('shows routes', () => {
  beforeEach(() => {
    vi.mocked(findShowsPage).mockReset().mockResolvedValue(searchPage);
    vi.mocked(getShowIndex).mockReset().mockResolvedValue([makeShow(1, [])]);
  });

  it('GET /api/shows/search returns the requested page', async () => {
    const response = await request('/api/shows/search?q=lost&genre=Drama&sort=rating&page=2');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(searchPage);
    expect(findShowsPage).toHaveBeenCalledWith({ query: 'lost', genre: 'Drama', sort: 'rating', page: 2 });
  });

  it('GET /api/shows/search answers 400 for wrong parameters', async () => {
    const response = await request('/api/shows/search?q=lost&page=abc');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: expect.stringContaining('"page"') });
    expect(findShowsPage).not.toHaveBeenCalled();
  });

  it('GET /api/shows/index returns an index page', async () => {
    const response = await request('/api/shows/index?page=4');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([makeShow(1, [])]);
    expect(getShowIndex).toHaveBeenCalledWith(4);
  });

  it('GET /api/shows/index uses page 0 by default and rejects a negative page', async () => {
    await request('/api/shows/index');
    const wrong = await request('/api/shows/index?page=-1');

    expect(getShowIndex).toHaveBeenCalledWith(0);
    expect(wrong.status).toBe(400);
  });
});
