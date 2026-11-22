import { describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { findShows } from '@src/tasks/findShows';
import { clearSearch } from './clearSearch';

vi.mock('@src/store/shows/showsStore', () => ({ showsStore: { setDraft: vi.fn() } }));
vi.mock('@src/tasks/findShows', () => ({ findShows: vi.fn().mockResolvedValue({ error: null }) }));

describe('clearSearch', () => {
  it('empties the field and clears the search at once', async () => {
    const result = await clearSearch();

    expect(result).toEqual({ error: null });
    expect(showsStore.setDraft).toHaveBeenCalledWith('');
    expect(findShows).toHaveBeenCalledWith('');
  });
});
