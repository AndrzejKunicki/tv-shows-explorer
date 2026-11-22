import { describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';
import { showAllGenres } from './showAllGenres';

vi.mock('@src/tasks/loadResults', () => ({ loadResults: vi.fn().mockResolvedValue({ error: null }) }));
vi.mock('@src/store/shows/showsStore', () => ({ showsStore: { resetGenre: vi.fn() } }));

describe('showAllGenres', () => {
  it('removes the genre filter and loads the results', async () => {
    const result = await showAllGenres();

    expect(result).toEqual({ error: null });
    expect(showsStore.resetGenre).toHaveBeenCalledTimes(1);
    expect(loadResults).toHaveBeenCalledTimes(1);
  });
});
