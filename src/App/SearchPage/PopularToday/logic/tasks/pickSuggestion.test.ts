import { describe, expect, it, vi } from 'vitest';
import { resetAppStore } from '@src/store/testAppStore';
import { findShows } from '@src/tasks/findShows';
import { pickSuggestion } from './pickSuggestion';

vi.mock('@src/tasks/findShows', () => ({ findShows: vi.fn().mockResolvedValue({ error: null }) }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('pickSuggestion', () => {
  it('puts the name into the search field and searches for it right away', async () => {
    const store = resetAppStore();

    const result = await pickSuggestion('Lost');

    expect(result).toEqual({ error: null });
    expect(store.getState().shows.draft).toBe('Lost');
    expect(findShows).toHaveBeenCalledWith('Lost');
  });
});
