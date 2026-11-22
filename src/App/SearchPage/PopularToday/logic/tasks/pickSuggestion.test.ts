import { describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { findShows } from '@src/tasks/findShows';
import { pickSuggestion } from './pickSuggestion';

vi.mock('@src/store/shows/showsStore', () => ({ showsStore: { setDraft: vi.fn() } }));
vi.mock('@src/tasks/findShows', () => ({ findShows: vi.fn().mockResolvedValue({ error: null }) }));

describe('pickSuggestion', () => {
  it('puts the name into the search field and searches for it right away', async () => {
    const result = await pickSuggestion('Lost');

    expect(result).toEqual({ error: null });
    expect(showsStore.setDraft).toHaveBeenCalledWith('Lost');
    expect(findShows).toHaveBeenCalledWith('Lost');
  });
});
