import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchSchedule, fetchShowIndex } from '@src/api/tvmaze';
import { fetchGems, fetchIndex, fetchTodaySchedule } from '@src/store/discover/discoverSlice';
import { withPoster } from '@src/store/discover/testState';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { usePresenter } from './usePresenter';

vi.mock('@src/api/tvmaze', () => ({ fetchSchedule: vi.fn(), fetchShowIndex: vi.fn() }));
const fetchScheduleMock = vi.mocked(fetchSchedule);
const fetchShowIndexMock = vi.mocked(fetchShowIndex);

const gems = [1, 2, 3, 4, 5, 6].map((id) => withPoster(100 + id, 8, 50));

describe('Discover usePresenter', () => {
  beforeEach(() => {
    fetchScheduleMock.mockReset().mockResolvedValue([]);
    fetchShowIndexMock.mockReset().mockResolvedValue([]);
  });

  it('loads the schedule, the index and two gem pages on mount', () => {
    renderHookWithStore(usePresenter);

    expect(fetchScheduleMock).toHaveBeenCalledWith('US', expect.anything());
    expect(fetchShowIndexMock).toHaveBeenCalledWith(0, expect.anything());
    expect(fetchShowIndexMock).toHaveBeenCalledTimes(3);
  });

  it('has no rows while nothing is loaded', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current).toEqual({ rows: [], hasRows: false });
  });

  it('returns only rows that have shows, in a fixed order', () => {
    const store = createStore();
    store.dispatch(fetchIndex.fulfilled([withPoster(2, 9)], 'index'));
    store.dispatch(fetchGems.fulfilled(gems, 'gems', [1, 2]));

    const { result } = renderHookWithStore(usePresenter, store);
    const ids = result.current.rows.map((row) => row.id);

    expect(ids).toEqual(['fan-favorites', 'hidden-gems']);
    expect(result.current.hasRows).toBe(true);
  });

  it('shows the airing today row with its shows', () => {
    const store = createStore();
    store.dispatch(fetchTodaySchedule.fulfilled([withPoster(1, null)], 'schedule'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.rows).toEqual([
      { id: 'airing-today', title: 'Airing today', subtitle: 'New episodes on US TV today', shows: [withPoster(1, null)] },
    ]);
  });
});
