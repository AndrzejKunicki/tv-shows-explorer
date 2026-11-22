import { beforeEach, describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { goToNextPage } from './goToNextPage';

vi.mock('@src/store/shows/showsStore', () => ({
  showsStore: { getPage: vi.fn(), getPageCount: vi.fn(), setPage: vi.fn() },
}));
const store = vi.mocked(showsStore);

describe('goToNextPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.getPageCount.mockReturnValue(2);
  });

  it('shows the next page', () => {
    store.getPage.mockReturnValue(1);

    goToNextPage();

    expect(store.setPage).toHaveBeenCalledWith(2);
  });

  it('does not go past the last page', () => {
    store.getPage.mockReturnValue(2);

    goToNextPage();

    expect(store.setPage).not.toHaveBeenCalled();
  });
});
