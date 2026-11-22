import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { searchShows } from '#src/api/tvmaze.ts';
import { cacheStorage } from '#src/storage/cache.ts';
import { findShowsPage } from './findShowsPage.ts';

vi.mock('#src/api/tvmaze.ts', () => ({ searchShows: vi.fn() }));
const searchShowsMock = vi.mocked(searchShows);

const results = [
  makeShow(1, ['Drama'], 6),
  makeShow(2, ['Crime'], 9),
  makeShow(3, ['Drama', 'Crime'], 8),
  makeShow(4, ['Drama'], 7),
  makeShow(5, ['Comedy'], null),
];

describe('findShowsPage', () => {
  beforeEach(() => {
    cacheStorage.clear();
    searchShowsMock.mockReset().mockResolvedValue(results);
  });

  it('returns the first page of all results with every genre', async () => {
    const page = await findShowsPage({ query: ' Lost ', genre: null, sort: 'relevance', page: 1 });

    expect(searchShowsMock).toHaveBeenCalledWith('Lost');
    expect(page).toEqual({
      query: 'Lost',
      items: results.slice(0, 3),
      page: 1,
      pageCount: 2,
      total: 5,
      genres: ['Comedy', 'Crime', 'Drama'],
    });
  });

  it('filters by genre and sorts by rating before paginating', async () => {
    const page = await findShowsPage({ query: 'lost', genre: 'Drama', sort: 'rating', page: 1 });

    expect(page.items.map((show) => show.id)).toEqual([3, 4, 1]);
    expect(page).toMatchObject({ pageCount: 1, total: 5, genres: ['Comedy', 'Crime', 'Drama'] });
  });

  it('returns a later page', async () => {
    const page = await findShowsPage({ query: 'lost', genre: null, sort: 'relevance', page: 2 });

    expect(page.items.map((show) => show.id)).toEqual([4, 5]);
  });

  it('asks TVmaze once for the same query, whatever the case, spaces, genre, sort or page', async () => {
    await findShowsPage({ query: 'banana', genre: null, sort: 'relevance', page: 1 });
    await findShowsPage({ query: ' Banana ', genre: 'Drama', sort: 'rating', page: 2 });

    expect(searchShowsMock).toHaveBeenCalledTimes(1);
  });
});
