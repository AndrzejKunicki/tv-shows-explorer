import { describe, expect, it } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { filterByGenre, listGenres, PAGE_SIZE, paginate, sortShows } from './showList.ts';

const shows = [makeShow(1, ['Drama', 'Crime'], 7), makeShow(2, ['Comedy'], null), makeShow(3, ['Crime'], 9)];
const many = Array.from({ length: PAGE_SIZE * 2 + 1 }, (_, index) => makeShow(index + 1, []));

describe('showList', () => {
  it('lists distinct genres alphabetically', () => {
    expect(listGenres(shows)).toEqual(['Comedy', 'Crime', 'Drama']);
  });

  it('filters by genre, or keeps all shows without one', () => {
    expect(filterByGenre(shows, 'Crime').map((show) => show.id)).toEqual([1, 3]);
    expect(filterByGenre(shows, null)).toBe(shows);
  });

  it('keeps API order for best match and sorts by rating with unrated last', () => {
    expect(sortShows(shows, 'relevance')).toBe(shows);
    expect(sortShows(shows, 'rating').map((show) => show.id)).toEqual([3, 1, 2]);
  });

  it('does not change the original list when sorting', () => {
    sortShows(shows, 'rating');

    expect(shows.map((show) => show.id)).toEqual([1, 2, 3]);
  });

  it('returns the requested page and the page count', () => {
    const result = paginate(many, 2);

    expect(result.page).toBe(2);
    expect(result.pageCount).toBe(3);
    expect(result.items.map((show) => show.id)).toEqual([4, 5, 6]);
  });

  it('keeps the page within 1..pageCount', () => {
    expect(paginate(many, 9)).toMatchObject({ page: 3, items: [many[6]] });
    expect(paginate(many, 0).page).toBe(1);
  });

  it('returns page 1 of 0 for no shows', () => {
    expect(paginate([], 3)).toEqual({ items: [], page: 1, pageCount: 0 });
  });
});
