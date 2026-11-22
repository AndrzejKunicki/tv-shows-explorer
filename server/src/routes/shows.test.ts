import { beforeEach, describe, expect, it, vi } from 'vitest';
import { findShowsPage } from '#src/tasks/findShowsPage.ts';
import { request } from '#src/testServer.ts';

vi.mock('#src/tasks/findShowsPage.ts', () => ({ findShowsPage: vi.fn() }));

const searchPage = { query: 'lost', items: [], page: 2, pageCount: 3, total: 9, genres: ['Drama'] };

describe('shows routes', () => {
  beforeEach(() => {
    vi.mocked(findShowsPage).mockReset().mockResolvedValue(searchPage);
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
});
