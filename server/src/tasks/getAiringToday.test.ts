import { makePoster, makeShow } from '#src/api/testShows.ts';
import { getAiringToday } from './getAiringToday.ts';
import { getTodayShows } from './getTodayShows.ts';
import { DISCOVER_ROW_SIZE } from './showRanking.ts';

vi.mock('./getTodayShows.ts', () => ({ getTodayShows: vi.fn() }));
const getTodayShowsMock = vi.mocked(getTodayShows);

describe('getAiringToday', () => {
  it('returns the US shows with a poster, each once, most popular first', async () => {
    getTodayShowsMock.mockResolvedValue([makePoster(1, 7, 60), makeShow(2, []), makePoster(3, null, 90), makePoster(1, 7, 60)]);

    const shows = await getAiringToday();

    expect(getTodayShowsMock).toHaveBeenCalledWith('US');
    expect(shows.map((show) => show.id)).toEqual([3, 1]);
  });

  it('returns at most one row of shows', async () => {
    getTodayShowsMock.mockResolvedValue(Array.from({ length: 30 }, (_, index) => makePoster(index + 1, 8)));

    const shows = await getAiringToday();

    expect(shows).toHaveLength(DISCOVER_ROW_SIZE);
  });
});
