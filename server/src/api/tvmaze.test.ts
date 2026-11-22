import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from './testShows.ts';
import { fetchSchedule, fetchShow, fetchShowIndex, searchShows, TvmazeError } from './tvmaze.ts';

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

  it('fetchShow requests one show by id', async () => {
    respondWith(makeShow(7, []));

    const show = await fetchShow(7);

    expect(fetchMock).toHaveBeenCalledWith('https://api.tvmaze.com/shows/7');
    expect(show).toEqual(makeShow(7, []));
  });

  it('throws a TvmazeError with the status on an error status', async () => {
    respondWith({}, 404);

    const error = await fetchShow(999).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(TvmazeError);
    expect(error).toMatchObject({ status: 404, message: 'TVmaze API error: 404' });
  });
});
