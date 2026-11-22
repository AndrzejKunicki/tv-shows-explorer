import { describe, expect, it, vi } from 'vitest';
import { fetchSchedule } from '@src/api/tvmaze';
import { testShows } from '@src/store/shows/testShows';
import { resetAppStore } from '@src/store/testAppStore';
import { loadTodaySchedule } from './loadTodaySchedule';

vi.mock('@src/api/tvmaze', () => ({ fetchSchedule: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const fetchScheduleMock = vi.mocked(fetchSchedule);

describe('loadTodaySchedule', () => {
  it('stores the shows of the US episodes airing today', async () => {
    fetchScheduleMock.mockResolvedValue(testShows.map((show, index) => ({ id: 100 + index, show })));
    const store = resetAppStore();

    const result = await loadTodaySchedule();

    expect(result).toEqual({ error: null });
    expect(fetchScheduleMock).toHaveBeenCalledWith('US');
    expect(store.getState().discover.schedule).toEqual({ status: 'succeeded', shows: testShows });
  });
});
