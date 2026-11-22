import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { fetchShowIndex } from '#src/api/tvmaze.ts';
import { cacheStorage } from '#src/storage/cache.ts';
import { getShowIndex } from './getShowIndex.ts';

vi.mock('#src/api/tvmaze.ts', () => ({ fetchShowIndex: vi.fn() }));
const fetchShowIndexMock = vi.mocked(fetchShowIndex);

describe('getShowIndex', () => {
  beforeEach(() => {
    cacheStorage.clear();
    fetchShowIndexMock.mockReset().mockResolvedValue([makeShow(1, [])]);
  });

  it('returns the index page and asks TVmaze only once for it', async () => {
    const first = await getShowIndex(2);
    const second = await getShowIndex(2);

    expect(first).toEqual([makeShow(1, [])]);
    expect(second).toEqual(first);
    expect(fetchShowIndexMock).toHaveBeenCalledTimes(1);
    expect(fetchShowIndexMock).toHaveBeenCalledWith(2);
  });

  it('caches every page separately', async () => {
    await getShowIndex(0);
    await getShowIndex(1);

    expect(fetchShowIndexMock).toHaveBeenCalledTimes(2);
  });
});
