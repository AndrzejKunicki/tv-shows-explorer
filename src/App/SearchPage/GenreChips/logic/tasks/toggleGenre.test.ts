import { beforeEach, describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';
import { toggleGenre } from './toggleGenre';

vi.mock('@src/tasks/loadResults', () => ({ loadResults: vi.fn().mockResolvedValue({ error: null }) }));
vi.mock('@src/store/shows/showsStore', () => ({
  showsStore: { getSelectedGenre: vi.fn(), selectGenre: vi.fn(), resetGenre: vi.fn() },
}));
const store = vi.mocked(showsStore);

describe('toggleGenre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('selects a genre and loads its results', async () => {
    store.getSelectedGenre.mockReturnValue(null);

    const result = await toggleGenre('Drama');

    expect(result).toEqual({ error: null });
    expect(store.selectGenre).toHaveBeenCalledWith('Drama');
    expect(store.resetGenre).not.toHaveBeenCalled();
    expect(loadResults).toHaveBeenCalledTimes(1);
  });

  it('switches to another genre', async () => {
    store.getSelectedGenre.mockReturnValue('Drama');

    await toggleGenre('Comedy');

    expect(store.selectGenre).toHaveBeenCalledWith('Comedy');
  });

  it('shows all genres again when the selected genre is clicked', async () => {
    store.getSelectedGenre.mockReturnValue('Drama');

    await toggleGenre('Drama');

    expect(store.resetGenre).toHaveBeenCalledTimes(1);
    expect(store.selectGenre).not.toHaveBeenCalled();
    expect(loadResults).toHaveBeenCalledTimes(1);
  });
});
