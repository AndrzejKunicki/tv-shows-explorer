import { describe, expect, it, vi } from 'vitest';
import { resetAppStore } from '@src/store/testAppStore';
import { toggleGenre } from './toggleGenre';

vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

describe('toggleGenre', () => {
  it('selects a genre', () => {
    const store = resetAppStore();

    toggleGenre('Drama');

    expect(store.getState().shows.selectedGenre).toBe('Drama');
  });

  it('switches to another genre', () => {
    const store = resetAppStore();

    toggleGenre('Drama');
    toggleGenre('Comedy');

    expect(store.getState().shows.selectedGenre).toBe('Comedy');
  });

  it('shows all genres again when the selected genre is clicked', () => {
    const store = resetAppStore();

    toggleGenre('Drama');
    toggleGenre('Drama');

    expect(store.getState().shows.selectedGenre).toBeNull();
  });
});
