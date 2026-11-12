import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSchedule, fetchShowIndex } from '@src/api/tvmaze';
import { testShows } from '@src/store/shows/testShows';
import { createStore } from '@src/store/store';
import { fetchGems, fetchIndex, fetchTodaySchedule } from './discoverSlice';

vi.mock('@src/api/tvmaze', () => ({ fetchShowIndex: vi.fn(), fetchSchedule: vi.fn(), searchShows: vi.fn() }));
const fetchShowIndexMock = vi.mocked(fetchShowIndex);
const fetchScheduleMock = vi.mocked(fetchSchedule);

describe('discover slice', () => {
  // Braces matter: a function returned from beforeEach is run by Vitest as teardown
  beforeEach(() => {
    fetchShowIndexMock.mockReset();
    fetchScheduleMock.mockReset();
  });

  it('stores the first index page', async () => {
    fetchShowIndexMock.mockResolvedValue(testShows);
    const store = createStore();

    await store.dispatch(fetchIndex());

    expect(fetchShowIndexMock.mock.calls[0][0]).toBe(0);
    expect(store.getState().discover.index).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('fetches a feed only once, even when dispatched twice (StrictMode effects)', async () => {
    fetchShowIndexMock.mockResolvedValue(testShows);
    const store = createStore();

    await Promise.all([store.dispatch(fetchIndex()), store.dispatch(fetchIndex())]);
    await store.dispatch(fetchIndex());

    expect(fetchShowIndexMock).toHaveBeenCalledTimes(1);
  });

  it('marks a feed as failed when the request fails', async () => {
    fetchShowIndexMock.mockRejectedValue(new Error('offline'));
    const store = createStore();

    await store.dispatch(fetchIndex());

    expect(store.getState().discover.index).toEqual({ status: 'failed', shows: [] });
  });

  it('keeps the shows of the schedule episodes', async () => {
    fetchScheduleMock.mockResolvedValue(testShows.map((show, index) => ({ id: 100 + index, show })));
    const store = createStore();

    await store.dispatch(fetchTodaySchedule());

    expect(fetchScheduleMock.mock.calls[0][0]).toBe('US');
    expect(store.getState().discover.schedule.shows).toEqual(testShows);
  });

  it('merges the requested index pages into the gems feed', async () => {
    fetchShowIndexMock.mockImplementation(async (page = 0) => testShows.filter((show) => show.id % 2 === page % 2));
    const store = createStore();

    await store.dispatch(fetchGems([3, 4]));

    expect(fetchShowIndexMock.mock.calls.map((call) => call[0])).toEqual([3, 4]);
    expect(store.getState().discover.gems.shows).toHaveLength(testShows.length);
  });
});
