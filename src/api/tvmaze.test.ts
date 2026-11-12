import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { fetchSchedule, fetchShowIndex, searchShows } from './tvmaze';

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
    const signal = new AbortController().signal;
    respondWith([{ score: 1, show: makeShow(1, []) }]);

    const shows = await searchShows('law & order', signal);

    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=law%20%26%20order', { signal });
    expect(shows).toEqual([makeShow(1, [])]);
  });

  it('fetchShowIndex requests the given page (first page by default)', async () => {
    respondWith([makeShow(2, [])]);

    const shows = await fetchShowIndex();
    await fetchShowIndex(3);

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://api.tvmaze.com/shows?page=0',
      'https://api.tvmaze.com/shows?page=3',
    ]);
    expect(shows).toEqual([makeShow(2, [])]);
  });

  it('fetchSchedule requests the schedule of a country', async () => {
    const episodes = [{ id: 10, show: makeShow(3, []) }];
    respondWith(episodes);

    const result = await fetchSchedule('US');

    expect(fetchMock.mock.calls[0][0]).toBe('https://api.tvmaze.com/schedule?country=US');
    expect(result).toEqual(episodes);
  });

  it('throws on an error response', async () => {
    respondWith({}, 500);

    await expect(searchShows('lost')).rejects.toThrow('TVmaze API error: 500');
    await expect(fetchShowIndex()).rejects.toThrow('TVmaze API error: 500');
    await expect(fetchSchedule('US')).rejects.toThrow('TVmaze API error: 500');
  });
});
