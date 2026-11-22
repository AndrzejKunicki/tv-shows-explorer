import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from './testShows.ts';
import { fetchSchedule, fetchShowIndex, searchShows } from './tvmaze.ts';

const fetchMock = vi.fn<typeof fetch>();

const respondWith = (body: unknown, status = 200) => {
  // A body can be read only once, so every call gets a fresh response
  fetchMock.mockImplementation(async () => new Response(JSON.stringify(body), { status }));
};

describe('tvmaze api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('searchShows encodes the query and unwraps the shows', async () => {
    respondWith([{ score: 1, show: makeShow(1, []) }]);

    const shows = await searchShows('law & order');

    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=law%20%26%20order');
    expect(shows).toEqual([makeShow(1, [])]);
  });

  it('fetchShowIndex requests the given page', async () => {
    respondWith([makeShow(2, [])]);

    const shows = await fetchShowIndex(3);

    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=3');
    expect(shows).toEqual([makeShow(2, [])]);
  });

  it('fetchSchedule requests the schedule of the country', async () => {
    respondWith([{ id: 10, show: makeShow(3, []) }]);

    const episodes = await fetchSchedule('US');

    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/schedule?country=US');
    expect(episodes).toEqual([{ id: 10, show: makeShow(3, []) }]);
  });

  it('throws on an error status', async () => {
    respondWith({}, 503);

    await expect(fetchShowIndex(0)).rejects.toThrow('TVmaze API error: 503');
  });
});
