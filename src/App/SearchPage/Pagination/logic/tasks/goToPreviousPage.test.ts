import { beforeEach, describe, expect, it, vi } from 'vitest';
import { showsStore } from '@src/store/shows/showsStore';
import { goToPreviousPage } from './goToPreviousPage';

vi.mock('@src/store/shows/showsStore', () => ({
  showsStore: { getPage: vi.fn(), setPage: vi.fn() },
}));
const store = vi.mocked(showsStore);

describe('goToPreviousPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the previous page', () => {
    store.getPage.mockReturnValue(2);

    goToPreviousPage();

    expect(store.setPage).toHaveBeenCalledWith(1);
  });

  it('does not go before the first page', () => {
    store.getPage.mockReturnValue(1);

    goToPreviousPage();

    expect(store.setPage).not.toHaveBeenCalled();
  });
});
