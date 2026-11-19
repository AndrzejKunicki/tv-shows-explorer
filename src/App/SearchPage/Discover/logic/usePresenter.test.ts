import { describe, expect, it, vi } from 'vitest';
import { feedLoaded } from '@src/store/discover/discoverSlice';
import { withPoster } from '@src/store/discover/testState';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { loadShowIndex } from '@src/tasks/loadShowIndex';
import { loadTodaySchedule } from '@src/tasks/loadTodaySchedule';
import { loadGems } from './tasks/loadGems';
import { usePresenter } from './usePresenter';

vi.mock('@src/tasks/loadShowIndex', () => ({ loadShowIndex: vi.fn() }));
vi.mock('@src/tasks/loadTodaySchedule', () => ({ loadTodaySchedule: vi.fn() }));
vi.mock('./tasks/loadGems', () => ({ loadGems: vi.fn() }));

const gems = [1, 2, 3, 4, 5, 6].map((id) => withPoster(100 + id, 8, 50));

describe('Discover usePresenter', () => {
  it('loads the schedule, the index and the gems on mount', () => {
    renderHookWithStore(usePresenter);

    expect(loadTodaySchedule).toHaveBeenCalled();
    expect(loadShowIndex).toHaveBeenCalled();
    expect(loadGems).toHaveBeenCalled();
  });

  it('has no rows while nothing is loaded', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current).toEqual({ rows: [], hasRows: false });
  });

  it('returns only rows that have shows, in a fixed order', () => {
    const store = createStore();
    store.dispatch(feedLoaded({ feed: 'index', shows: [withPoster(2, 9)] }));
    store.dispatch(feedLoaded({ feed: 'gems', shows: gems }));

    const { result } = renderHookWithStore(usePresenter, store);
    const ids = result.current.rows.map((row) => row.id);

    expect(ids).toEqual(['fan-favorites', 'hidden-gems']);
    expect(result.current.hasRows).toBe(true);
  });

  it('shows the airing today row with its shows', () => {
    const store = createStore();
    store.dispatch(feedLoaded({ feed: 'schedule', shows: [withPoster(1, null)] }));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.rows).toEqual([
      { id: 'airing-today', title: 'Airing today', subtitle: 'New episodes on US TV today', shows: [withPoster(1, null)] },
    ]);
  });
});
