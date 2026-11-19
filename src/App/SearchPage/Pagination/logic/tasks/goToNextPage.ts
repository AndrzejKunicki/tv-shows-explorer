import { selectCurrentPage, selectPageCount } from '@src/store/shows/selectors';
import { pageChanged } from '@src/store/shows/showsSlice';
import { store } from '@src/store/store';

/** Shows the next page of the results, unless the last one is already shown. */
export const goToNextPage = () => {
  const state = store.getState();
  const page = selectCurrentPage(state);
  const canGoNext = page < selectPageCount(state);
  if (!canGoNext) {
    return;
  }

  store.dispatch(pageChanged(page + 1));
};
