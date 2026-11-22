import { describe, expect, it, vi } from 'vitest';
import { fetchTodayShows } from '@src/api/showsApi';
import { testShows } from '@src/store/shows/testShows';
import { resetAppStore } from '@src/store/testAppStore';
import { loadTodaySchedule } from './loadTodaySchedule';

vi.mock('@src/api/showsApi', () => ({ fetchTodayShows: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const fetchTodayShowsMock = vi.mocked(fetchTodayShows);

describe('loadTodaySchedule', () => {
  it('stores the shows airing today as the schedule feed', async () => {
    fetchTodayShowsMock.mockResolvedValue(testShows);
    const store = resetAppStore();

    const result = await loadTodaySchedule();

    expect(result).toEqual({ error: null });
    expect(fetchTodayShowsMock).toHaveBeenCalledTimes(1);
    expect(store.getState().discover.schedule).toEqual({ status: 'succeeded', shows: testShows });
  });
});
