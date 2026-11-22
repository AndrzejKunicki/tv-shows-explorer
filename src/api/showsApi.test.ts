import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { fetchAiringToday, fetchHiddenGems, fetchTopRated, searchShows } from './showsApi';
import type { SearchPage } from './types';

const fetchMock = vi.fn<typeof fetch>();

const respondWith = (body: unknown, status = 200) => {
  // A body can be read only once, so every call gets a fresh response
  fetchMock.mockImplementation(async () => new Response(JSON.stringify(body), { status }));
};

const searchPage: SearchPage = { query: 'lost', items: [], page: 1, pageCount: 0, total: 0, genres: [] };

describe('shows api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('searchShows sends the query, sort and page and returns the page', async () => {
    const signal = new AbortController().signal;
    respondWith(searchPage);

    const page = await searchShows({ query: 'law & order', genre: null, sort: 'rating', page: 2 }, signal);

    expect(fetchMock).toHaveBeenCalledWith('/api/shows/search?q=law+%26+order&sort=rating&page=2', { signal });
    expect(page).toEqual(searchPage);
  });

  it('searchShows sends the genre when one is selected', async () => {
    respondWith(searchPage);

    await searchShows({ query: 'lost', genre: 'Science-Fiction', sort: 'relevance', page: 1 });

    expect(fetchMock.mock.calls[0][0]).toBe('/api/shows/search?q=lost&sort=relevance&page=1&genre=Science-Fiction');
  });

  it.each([
    ['fetchAiringToday', fetchAiringToday, '/api/discover/airing-today'],
    ['fetchTopRated', fetchTopRated, '/api/discover/top-rated'],
    ['fetchHiddenGems', fetchHiddenGems, '/api/discover/hidden-gems'],
  ])('%s requests its discover row', async (_name, fetchRow, url) => {
    respondWith([makeShow(1, [])]);

    const shows = await fetchRow();

    expect(fetchMock.mock.calls[0][0]).toBe(url);
    expect(shows).toEqual([makeShow(1, [])]);
  });

  it('throws the error message sent by the server', async () => {
    respondWith({ error: 'TVmaze API error: 503' }, 502);

    await expect(fetchTopRated()).rejects.toThrow('TVmaze API error: 503');
  });

  it('throws the status when the error has no message', async () => {
    fetchMock.mockResolvedValue(new Response('Bad gateway', { status: 502 }));

    await expect(fetchAiringToday()).rejects.toThrow('API error: 502');
  });
});
