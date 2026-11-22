import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { fetchSchedule } from '#src/api/tvmaze.ts';
import { cacheStorage } from '#src/storage/cache.ts';
import { getTodayShows } from './getTodayShows.ts';

vi.mock('#src/api/tvmaze.ts', () => ({ fetchSchedule: vi.fn() }));
const fetchScheduleMock = vi.mocked(fetchSchedule);

describe('getTodayShows', () => {
  beforeEach(() => {
    cacheStorage.clear();
    fetchScheduleMock.mockReset().mockResolvedValue([
      { id: 10, show: makeShow(1, []) },
      { id: 11, show: makeShow(2, []) },
    ]);
  });

  it('returns the shows of the episodes and asks TVmaze only once', async () => {
    const shows = await getTodayShows('US');
    await getTodayShows('US');

    expect(shows).toEqual([makeShow(1, []), makeShow(2, [])]);
    expect(fetchScheduleMock).toHaveBeenCalledTimes(1);
    expect(fetchScheduleMock).toHaveBeenCalledWith('US');
  });
});
