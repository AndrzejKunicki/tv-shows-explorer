import { describe, expect, it, vi } from 'vitest';
import { resetAppStore } from '@src/store/testAppStore';
import { findShowsDebounced } from '@src/tasks/findShowsDebounced';
import { typeQuery } from './typeQuery';

vi.mock('@src/tasks/findShowsDebounced', () => ({ findShowsDebounced: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('typeQuery', () => {
  it('stores the typed text and searches for it after the debounce', () => {
    const store = resetAppStore();

    typeQuery('lost');

    expect(store.getState().shows.draft).toBe('lost');
    expect(findShowsDebounced).toHaveBeenCalledWith('lost');
  });
});
