import { describe, expect, it, vi } from 'vitest';
import { makePoster, makeShow } from '#src/api/testShows.ts';
import { getShowIndex } from './getShowIndex.ts';
import { getTopRated, TOP_RATED_COUNT } from './getTopRated.ts';

vi.mock('./getShowIndex.ts', () => ({ getShowIndex: vi.fn() }));
const getShowIndexMock = vi.mocked(getShowIndex);

describe('getTopRated', () => {
  it('returns rated shows with a poster from the first index page, highest rated first', async () => {
    getShowIndexMock.mockResolvedValue([makePoster(1, 7), makePoster(2, null), makeShow(3, [], 9), makePoster(4, 8.5)]);

    const shows = await getTopRated();

    expect(getShowIndexMock).toHaveBeenCalledWith(0);
    expect(shows.map((show) => show.id)).toEqual([4, 1]);
  });

  it('returns at most enough shows for the row and the poster wall', async () => {
    getShowIndexMock.mockResolvedValue(Array.from({ length: 60 }, (_, index) => makePoster(index + 1, 8)));

    const shows = await getTopRated();

    expect(shows).toHaveLength(TOP_RATED_COUNT);
  });
});
