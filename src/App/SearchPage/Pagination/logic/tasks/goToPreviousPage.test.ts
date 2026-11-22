import { beforeEach, describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';
import { goToPreviousPage } from './goToPreviousPage';

vi.mock('@src/tasks/loadResults', () => ({ loadResults: vi.fn().mockResolvedValue({ error: null }) }));
vi.mock('@src/store/shows/showsStore', () => ({
  showsStore: { getPage: vi.fn(), setPage: vi.fn() },
}));
const store = vi.mocked(showsStore);

describe('goToPreviousPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('switches to the previous page and loads it', async () => {
    store.getPage.mockReturnValue(2);

    const result = await goToPreviousPage();

    expect(result).toEqual({ error: null });
    expect(store.setPage).toHaveBeenCalledWith(1);
    expect(loadResults).toHaveBeenCalledTimes(1);
  });

  it('does not go before the first page', async () => {
    store.getPage.mockReturnValue(1);

    await goToPreviousPage();

    expect(store.setPage).not.toHaveBeenCalled();
    expect(loadResults).not.toHaveBeenCalled();
  });
});
