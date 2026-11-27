import { fetchHiddenGems } from '@src/api/showsApi';
import { testShows } from '@src/store/shows/testShows';
import { resetAppStore } from '@src/store/testAppStore';
import { loadHiddenGems } from './loadHiddenGems';

vi.mock('@src/api/showsApi', () => ({ fetchHiddenGems: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('loadHiddenGems', () => {
  it('stores the shows sent by the server as the hiddenGems feed', async () => {
    vi.mocked(fetchHiddenGems).mockResolvedValue(testShows);
    const store = resetAppStore();

    const result = await loadHiddenGems();

    expect(result).toEqual({ error: null });
    expect(fetchHiddenGems).toHaveBeenCalledTimes(1);
    expect(store.getState().discover.hiddenGems).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('returns the error and marks the feed as failed', async () => {
    vi.mocked(fetchHiddenGems).mockRejectedValue(new Error('TVmaze API error: 503'));
    const store = resetAppStore();

    const result = await loadHiddenGems();

    expect(result).toEqual({ error: 'TVmaze API error: 503' });
    expect(store.getState().discover.hiddenGems.status).toBe('failed');
  });
});
