import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeShow } from '#src/api/testShows.ts';
import { fetchShow, TvmazeError } from '#src/api/tvmaze.ts';
import { cacheStorage } from '#src/storage/cache.ts';
import { favoriteStorage } from '#src/storage/favorite.ts';
import { addFavorite } from './addFavorite.ts';

vi.mock('#src/api/tvmaze.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#src/api/tvmaze.ts')>();

  return { ...actual, fetchShow: vi.fn() };
});
const fetchShowMock = vi.mocked(fetchShow);
const now = () => 5000;

describe('addFavorite', () => {
  beforeEach(() => {
    favoriteStorage.clear();
    cacheStorage.clear();
    fetchShowMock.mockReset().mockResolvedValue(makeShow(7, ['Drama']));
  });

  it('takes the show from TVmaze, stores it and returns it', async () => {
    const result = await addFavorite(7, now);

    expect(fetchShowMock).toHaveBeenCalledWith(7);
    expect(result).toEqual({ ok: true, show: makeShow(7, ['Drama']) });
    expect(favoriteStorage.find(7)).toEqual({ show: makeShow(7, ['Drama']), addedAt: 5000 });
  });

  it('changes nothing when the show is already a favorite', async () => {
    favoriteStorage.save(makeShow(7, ['Drama']), 1000);

    const result = await addFavorite(7, now);

    expect(result).toEqual({ ok: true, show: makeShow(7, ['Drama']) });
    expect(fetchShowMock).not.toHaveBeenCalled();
    expect(favoriteStorage.find(7)?.addedAt).toBe(1000);
  });

  it('reports a show that TVmaze does not know', async () => {
    fetchShowMock.mockRejectedValue(new TvmazeError(404));

    const result = await addFavorite(999, now);

    expect(result).toEqual({ ok: false, error: 'not-found' });
    expect(favoriteStorage.list()).toEqual([]);
  });

  it('passes a TVmaze outage on', async () => {
    fetchShowMock.mockRejectedValue(new TvmazeError(503));

    await expect(addFavorite(7, now)).rejects.toThrow('TVmaze API error: 503');
  });
});
