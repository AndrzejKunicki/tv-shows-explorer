import { fetchAiringToday } from '@src/api/showsApi';
import { testShows } from '@src/store/shows/testShows';
import { resetAppStore } from '@src/store/testAppStore';
import { loadAiringToday } from './loadAiringToday';

vi.mock('@src/api/showsApi', () => ({ fetchAiringToday: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('loadAiringToday', () => {
  it('stores the shows sent by the server as the airingToday feed', async () => {
    vi.mocked(fetchAiringToday).mockResolvedValue(testShows);
    const store = resetAppStore();

    const result = await loadAiringToday();

    expect(result).toEqual({ error: null });
    expect(fetchAiringToday).toHaveBeenCalledTimes(1);
    expect(store.getState().discover.airingToday).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('returns the error and marks the feed as failed', async () => {
    vi.mocked(fetchAiringToday).mockRejectedValue(new Error('TVmaze API error: 503'));
    const store = resetAppStore();

    const result = await loadAiringToday();

    expect(result).toEqual({ error: 'TVmaze API error: 503' });
    expect(store.getState().discover.airingToday.status).toBe('failed');
  });
});
