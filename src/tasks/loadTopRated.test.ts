import { describe, expect, it, vi } from 'vitest';
import { fetchTopRated } from '@src/api/showsApi';
import { testShows } from '@src/store/shows/testShows';
import { resetAppStore } from '@src/store/testAppStore';
import { loadTopRated } from './loadTopRated';

vi.mock('@src/api/showsApi', () => ({ fetchTopRated: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('loadTopRated', () => {
  it('stores the shows sent by the server as the topRated feed', async () => {
    vi.mocked(fetchTopRated).mockResolvedValue(testShows);
    const store = resetAppStore();

    const result = await loadTopRated();

    expect(result).toEqual({ error: null });
    expect(fetchTopRated).toHaveBeenCalledTimes(1);
    expect(store.getState().discover.topRated).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('returns the error and marks the feed as failed', async () => {
    vi.mocked(fetchTopRated).mockRejectedValue(new Error('TVmaze API error: 503'));
    const store = resetAppStore();

    const result = await loadTopRated();

    expect(result).toEqual({ error: 'TVmaze API error: 503' });
    expect(store.getState().discover.topRated.status).toBe('failed');
  });
});
