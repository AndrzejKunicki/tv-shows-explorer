import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchShowIndex } from '@src/api/tvmaze';
import { testShows } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { loadGems } from './loadGems';

vi.mock('@src/api/tvmaze', () => ({ fetchShowIndex: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const fetchShowIndexMock = vi.mocked(fetchShowIndex);

/** Picks pages 3 and 4 (see `pickGemPages`). */
const randomPages = vi.fn();

describe('loadGems', () => {
  let store: AppStore;

  beforeEach(() => {
    fetchShowIndexMock.mockReset();
    randomPages.mockReset().mockReturnValueOnce(0.2).mockReturnValueOnce(0.3);
    store = resetAppStore();
  });

  it('merges the picked index pages into the gems feed', async () => {
    fetchShowIndexMock.mockImplementation(async (page = 0) => testShows.filter((show) => show.id % 2 === page % 2));

    const result = await loadGems(randomPages);

    expect(result).toEqual({ error: null });
    expect(fetchShowIndexMock.mock.calls.map((call) => call[0])).toEqual([3, 4]);
    expect(store.getState().discover.gems.shows).toHaveLength(testShows.length);
  });

  it('keeps the gems of the pages that loaded when some fail', async () => {
    fetchShowIndexMock.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(testShows);

    await loadGems(randomPages);

    expect(store.getState().discover.gems).toEqual({ status: 'succeeded', shows: testShows });
  });

  it('fails the gems feed only when every page fails', async () => {
    fetchShowIndexMock.mockRejectedValue(new Error('offline'));

    const result = await loadGems(randomPages);

    expect(result).toEqual({ error: 'offline' });
    expect(store.getState().discover.gems).toEqual({ status: 'failed', shows: [] });
  });
});
