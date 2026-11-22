import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchShowIndex } from '@src/api/showsApi';
import { testShows } from '@src/store/shows/testShows';
import { resetAppStore } from '@src/store/testAppStore';
import { loadShowIndex } from './loadShowIndex';

vi.mock('@src/api/showsApi', () => ({ fetchShowIndex: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const fetchShowIndexMock = vi.mocked(fetchShowIndex);

describe('loadShowIndex', () => {
  beforeEach(() => {
    fetchShowIndexMock.mockReset();
  });

  it('stores the first index page as the index feed', async () => {
    fetchShowIndexMock.mockResolvedValue(testShows);
    const store = resetAppStore();

    const result = await loadShowIndex();

    expect(result).toEqual({ error: null });
    expect(fetchShowIndexMock).toHaveBeenCalledWith(0);
    expect(store.getState().discover.index).toEqual({ status: 'succeeded', shows: testShows });
  });
});
