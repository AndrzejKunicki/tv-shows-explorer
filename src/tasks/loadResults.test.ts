import { searchShows } from '@src/api/showsApi';
import { genreSelected, pageChanged, searchStarted, sortChanged } from '@src/store/shows/showsSlice';
import { makeSearchPage, testShows } from '@src/store/shows/testShows';
import type { AppStore } from '@src/store/store';
import { resetAppStore } from '@src/store/testAppStore';
import { loadResults } from './loadResults';
import { cancelSearch } from './searchRequest';
import { deferredRequest, settle } from './testSearchRequests';

vi.mock('@src/api/showsApi', () => ({ searchShows: vi.fn() }));
vi.mock('@src/store/store', async (importOriginal) => {
  const { mockStoreModule } = await import('@src/store/testAppStore');

  return mockStoreModule(importOriginal);
});
const searchShowsMock = vi.mocked(searchShows);

describe('loadResults', () => {
  let store: AppStore;

  beforeEach(() => {
    cancelSearch();
    searchShowsMock.mockReset();
    store = resetAppStore();
    store.dispatch(searchStarted('lost'));
  });

  it('requests the page for the query, genre, sort order and page in the store', async () => {
    searchShowsMock.mockResolvedValue(makeSearchPage());
    store.dispatch(genreSelected('Drama'));
    store.dispatch(sortChanged('rating'));
    store.dispatch(pageChanged(2));

    await loadResults();

    expect(searchShowsMock).toHaveBeenCalledWith(
      { query: 'lost', genre: 'Drama', sort: 'rating', page: 2 },
      expect.any(AbortSignal),
    );
  });

  it('stores the page sent by the server', async () => {
    const page = makeSearchPage({ items: testShows.slice(0, 3), page: 2, pageCount: 3, genres: ['Crime'] });
    searchShowsMock.mockResolvedValue(page);

    const result = await loadResults();

    expect(result).toEqual({ error: null });
    expect(store.getState().shows).toMatchObject({
      status: 'succeeded',
      items: page.items,
      page: 2,
      pageCount: 3,
      genres: ['Crime'],
    });
  });

  it('stores and returns the error when the request fails', async () => {
    searchShowsMock.mockRejectedValue(new Error('TVmaze API error: 503'));

    const result = await loadResults();

    expect(result).toEqual({ error: 'TVmaze API error: 503' });
    expect(store.getState().shows).toMatchObject({ status: 'failed', error: 'TVmaze API error: 503', items: [] });
  });

  it('aborts the previous request, so its late response never replaces newer results', async () => {
    const old = deferredRequest(searchShowsMock);
    searchShowsMock.mockResolvedValueOnce(makeSearchPage({ page: 3 }));

    const oldLoad = loadResults();
    await loadResults();
    old.resolve(makeSearchPage({ page: 2 }));
    await settle();

    expect(await oldLoad).toEqual({ error: null });
    expect(old.signal?.aborted).toBe(true);
    expect(store.getState().shows.page).toBe(3);
  });
});
