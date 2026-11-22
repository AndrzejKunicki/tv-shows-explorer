import { describe, expect, it, vi } from 'vitest';
import { feedLoaded } from '@src/store/discover/discoverSlice';
import { withPoster } from '@src/store/discover/testState';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { loadTopRated } from '@src/tasks/loadTopRated';
import { loadAiringToday } from '@src/tasks/loadAiringToday';
import { loadHiddenGems } from './tasks/loadHiddenGems';
import { usePresenter } from './usePresenter';

vi.mock('@src/tasks/loadTopRated', () => ({ loadTopRated: vi.fn() }));
vi.mock('@src/tasks/loadAiringToday', () => ({ loadAiringToday: vi.fn() }));
vi.mock('./tasks/loadHiddenGems', () => ({ loadHiddenGems: vi.fn() }));

const gems = [1, 2, 3, 4, 5, 6].map((id) => withPoster(100 + id, 8, 50));

describe('Discover usePresenter', () => {
  it('loads the schedule, the index and the gems on mount', () => {
    renderHookWithStore(usePresenter);

    expect(loadAiringToday).toHaveBeenCalled();
    expect(loadTopRated).toHaveBeenCalled();
    expect(loadHiddenGems).toHaveBeenCalled();
  });

  it('has no rows while nothing is loaded', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current).toEqual({ rows: [], hasRows: false });
  });

  it('returns only rows that have shows, in a fixed order', () => {
    const store = createStore();
    store.dispatch(feedLoaded({ feed: 'topRated', shows: [withPoster(2, 9)] }));
    store.dispatch(feedLoaded({ feed: 'hiddenGems', shows: gems }));

    const { result } = renderHookWithStore(usePresenter, store);
    const ids = result.current.rows.map((row) => row.id);

    expect(ids).toEqual(['fan-favorites', 'hidden-gems']);
    expect(result.current.hasRows).toBe(true);
  });

  it('shows the airing today row with its shows', () => {
    const store = createStore();
    store.dispatch(feedLoaded({ feed: 'airingToday', shows: [withPoster(1, null)] }));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.rows).toEqual([
      { id: 'airing-today', title: 'Airing today', subtitle: 'New episodes on US TV today', shows: [withPoster(1, null)] },
    ]);
  });
});
