import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';
import { goToNextPage } from './goToNextPage';

vi.mock('@src/tasks/loadResults', () => ({ loadResults: vi.fn().mockResolvedValue({ error: null }) }));
vi.mock('@src/store/shows/showsStore', () => ({
  showsStore: { getPage: vi.fn(), getPageCount: vi.fn(), setPage: vi.fn() },
}));
const store = vi.mocked(showsStore);

describe('goToNextPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.getPageCount.mockReturnValue(2);
  });

  it('switches to the next page and loads it', async () => {
    store.getPage.mockReturnValue(1);

    const result = await goToNextPage();

    expect(result).toEqual({ error: null });
    expect(store.setPage).toHaveBeenCalledWith(2);
    expect(loadResults).toHaveBeenCalledTimes(1);
  });

  it('does not go past the last page', async () => {
    store.getPage.mockReturnValue(2);

    await goToNextPage();

    expect(store.setPage).not.toHaveBeenCalled();
    expect(loadResults).not.toHaveBeenCalled();
  });
});
