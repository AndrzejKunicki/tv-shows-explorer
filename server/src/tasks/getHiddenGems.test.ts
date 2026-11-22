import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makePoster } from '#src/api/testShows.ts';
import { GEM_MAX_WEIGHT, GEM_MIN_COUNT, GEM_MIN_RATING, getHiddenGems } from './getHiddenGems.ts';
import { getShowIndex } from './getShowIndex.ts';

vi.mock('./getShowIndex.ts', () => ({ getShowIndex: vi.fn() }));
const getShowIndexMock = vi.mocked(getShowIndex);

/** Picks pages 3 and 4 (see `pickGemPages`). */
const randomPages = vi.fn();
const gems = (from: number, count: number) =>
  Array.from({ length: count }, (_, index) => makePoster(from + index, GEM_MIN_RATING + index / 100, 50));

describe('getHiddenGems', () => {
  beforeEach(() => {
    getShowIndexMock.mockReset();
    randomPages.mockReset().mockReturnValueOnce(0.2).mockReturnValueOnce(0.3);
  });

  it('merges the random index pages and keeps well rated, less popular shows, best first', async () => {
    getShowIndexMock.mockResolvedValueOnce([...gems(1, 4), makePoster(90, 9.5, GEM_MAX_WEIGHT)]);
    getShowIndexMock.mockResolvedValueOnce([...gems(10, 3), makePoster(91, GEM_MIN_RATING - 0.1, 50)]);

    const shows = await getHiddenGems(randomPages);

    expect(getShowIndexMock.mock.calls.map((call) => call[0])).toEqual([3, 4]);
    expect(shows.map((show) => show.id)).toEqual([4, 3, 12, 2, 11, 1, 10]);
  });

  it('keeps the gems of the pages that loaded when some fail', async () => {
    getShowIndexMock.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(gems(1, GEM_MIN_COUNT));

    const shows = await getHiddenGems(randomPages);

    expect(shows).toHaveLength(GEM_MIN_COUNT);
  });

  it('returns no row when there are too few gems', async () => {
    getShowIndexMock.mockResolvedValue(gems(1, (GEM_MIN_COUNT - 1) / 2));

    expect(await getHiddenGems(randomPages)).toEqual([]);
  });

  it('fails only when every page fails', async () => {
    getShowIndexMock.mockRejectedValue(new Error('offline'));

    await expect(getHiddenGems(randomPages)).rejects.toThrow('offline');
  });
});
