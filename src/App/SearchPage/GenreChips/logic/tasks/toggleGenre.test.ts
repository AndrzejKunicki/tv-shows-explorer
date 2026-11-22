import { beforeEach, describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { toggleGenre } from './toggleGenre';

vi.mock('@src/store/shows/showsStore', () => ({
  showsStore: { getSelectedGenre: vi.fn(), selectGenre: vi.fn(), resetGenre: vi.fn() },
}));
const store = vi.mocked(showsStore);

describe('toggleGenre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('selects a genre when none is selected', () => {
    store.getSelectedGenre.mockReturnValue(null);

    toggleGenre('Drama');

    expect(store.selectGenre).toHaveBeenCalledWith('Drama');
    expect(store.resetGenre).not.toHaveBeenCalled();
  });

  it('switches to another genre', () => {
    store.getSelectedGenre.mockReturnValue('Drama');

    toggleGenre('Comedy');

    expect(store.selectGenre).toHaveBeenCalledWith('Comedy');
  });

  it('shows all genres again when the selected genre is clicked', () => {
    store.getSelectedGenre.mockReturnValue('Drama');

    toggleGenre('Drama');

    expect(store.resetGenre).toHaveBeenCalledTimes(1);
    expect(store.selectGenre).not.toHaveBeenCalled();
  });
});
