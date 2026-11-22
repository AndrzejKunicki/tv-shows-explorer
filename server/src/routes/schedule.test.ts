import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { getTodayShows } from '#src/tasks/getTodayShows.ts';
import { request } from '#src/testServer.ts';

vi.mock('#src/tasks/getTodayShows.ts', () => ({ getTodayShows: vi.fn() }));

describe('schedule route', () => {
  beforeEach(() => {
    vi.mocked(getTodayShows).mockReset().mockResolvedValue([makeShow(1, [])]);
  });

  it('returns the shows airing today in the US by default', async () => {
    const response = await request('/api/schedule');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([makeShow(1, [])]);
    expect(getTodayShows).toHaveBeenCalledWith('US');
  });

  it('accepts another country and rejects a wrong code', async () => {
    await request('/api/schedule?country=gb');
    const wrong = await request('/api/schedule?country=USA');

    expect(getTodayShows).toHaveBeenCalledWith('GB');
    expect(wrong.status).toBe(400);
  });
});
