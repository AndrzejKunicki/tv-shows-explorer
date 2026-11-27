import { makeShow } from '@src/store/shows/testShows';
import { request } from './request';
import { fetchAiringToday, fetchHiddenGems, fetchTopRated, searchShows } from './showsApi';
import type { SearchPage } from './types';

vi.mock('./request', () => ({ request: vi.fn() }));
const requestMock = vi.mocked(request);

const searchPage: SearchPage = { query: 'lost', items: [], page: 1, pageCount: 0, total: 0, genres: [] };

describe('shows api', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('searchShows sends the query, sort and page and returns the page', async () => {
    const signal = new AbortController().signal;
    requestMock.mockResolvedValue(searchPage);

    const page = await searchShows({ query: 'law & order', genre: null, sort: 'rating', page: 2 }, signal);

    expect(requestMock).toHaveBeenCalledWith('/api/shows/search?q=law+%26+order&sort=rating&page=2', { signal });
    expect(page).toEqual(searchPage);
  });

  it('searchShows sends the genre when one is selected', async () => {
    requestMock.mockResolvedValue(searchPage);

    await searchShows({ query: 'lost', genre: 'Science-Fiction', sort: 'relevance', page: 1 });

    expect(requestMock.mock.calls[0][0]).toBe('/api/shows/search?q=lost&sort=relevance&page=1&genre=Science-Fiction');
  });

  it.each([
    ['fetchAiringToday', fetchAiringToday, '/api/discover/airing-today'],
    ['fetchTopRated', fetchTopRated, '/api/discover/top-rated'],
    ['fetchHiddenGems', fetchHiddenGems, '/api/discover/hidden-gems'],
  ])('%s requests its discover row', async (_name, fetchRow, url) => {
    requestMock.mockResolvedValue([makeShow(1, [])]);

    const shows = await fetchRow();

    expect(requestMock).toHaveBeenCalledWith(url);
    expect(shows).toEqual([makeShow(1, [])]);
  });
});
