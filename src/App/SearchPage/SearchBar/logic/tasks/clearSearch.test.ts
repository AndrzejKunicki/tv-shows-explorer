import { describe, expect, it, vi } from 'vitest';
import { draftChanged } from '@src/store/shows/showsSlice';
import { resetAppStore } from '@src/store/testAppStore';
import { findShows } from '@src/tasks/findShows';
import { clearSearch } from './clearSearch';

vi.mock('@src/tasks/findShows', () => ({ findShows: vi.fn().mockResolvedValue({ error: null }) }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('clearSearch', () => {
  it('empties the field and clears the search at once', async () => {
    const store = resetAppStore();
    store.dispatch(draftChanged('lost'));

    const result = await clearSearch();

    expect(result).toEqual({ error: null });
    expect(store.getState().shows.draft).toBe('');
    expect(findShows).toHaveBeenCalledWith('');
  });
});
