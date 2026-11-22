import { selectCurrentPage } from '@src/store/shows/selectors';
import { pageChanged } from '@src/store/shows/showsSlice';
import { store } from '@src/store/store';

/** Shows the previous page of the results, unless the first one is already shown. */
export const goToPreviousPage = () => {
  const page = selectCurrentPage(store.getState());
  const canGoPrev = page > 1;
  if (!canGoPrev) {
    return;
  }

  store.dispatch(pageChanged(page - 1));
};
