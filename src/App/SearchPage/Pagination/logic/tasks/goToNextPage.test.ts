import { describe, expect, it, vi } from 'vitest';
import { pageChanged, PAGE_SIZE, resultsRestored } from '@src/store/shows/showsSlice';
import { makeShow } from '@src/store/shows/testShows';
import { resetAppStore } from '@src/store/testAppStore';
import { goToNextPage } from './goToNextPage';

vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});

const storeOnPage = (page: number) => {
  const store = resetAppStore();
  const items = Array.from({ length: PAGE_SIZE * 2 }, (_, index) => makeShow(index + 1, []));
  store.dispatch(resultsRestored({ query: 'q', items }));
  store.dispatch(pageChanged(page));

  return store;
};

describe('goToNextPage', () => {
  it('shows the next page', () => {
    const store = storeOnPage(1);

    goToNextPage();

    expect(store.getState().shows.page).toBe(2);
  });

  it('does not go past the last page', () => {
    const store = storeOnPage(2);

    goToNextPage();

    expect(store.getState().shows.page).toBe(2);
  });
});
