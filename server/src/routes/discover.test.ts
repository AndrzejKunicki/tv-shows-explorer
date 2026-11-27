import { makePoster } from '#src/api/testShows.ts';
import { getAiringToday } from '#src/tasks/getAiringToday.ts';
import { getHiddenGems } from '#src/tasks/getHiddenGems.ts';
import { getTopRated } from '#src/tasks/getTopRated.ts';
import { request } from '#src/testServer.ts';

vi.mock('#src/tasks/getAiringToday.ts', () => ({ getAiringToday: vi.fn().mockResolvedValue([makePoster(1, 7)]) }));
vi.mock('#src/tasks/getTopRated.ts', () => ({ getTopRated: vi.fn().mockResolvedValue([makePoster(2, 9)]) }));
vi.mock('#src/tasks/getHiddenGems.ts', () => ({ getHiddenGems: vi.fn().mockResolvedValue([makePoster(3, 8)]) }));

describe('discover routes', () => {
  it('GET /api/discover/airing-today returns the shows airing today', async () => {
    const response = await request('/api/discover/airing-today');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([makePoster(1, 7)]);
    expect(getAiringToday).toHaveBeenCalledTimes(1);
  });

  it('GET /api/discover/top-rated returns the top rated shows', async () => {
    const response = await request('/api/discover/top-rated');

    expect(response.body).toEqual([makePoster(2, 9)]);
    expect(getTopRated).toHaveBeenCalledTimes(1);
  });

  it('GET /api/discover/hidden-gems returns the hidden gems', async () => {
    const response = await request('/api/discover/hidden-gems');

    expect(response.body).toEqual([makePoster(3, 8)]);
    expect(getHiddenGems).toHaveBeenCalledTimes(1);
  });
});
