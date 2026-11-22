import { showsStore } from '@src/store/shows/showsStore';

/** Shows the next page of the results, unless the last one is already shown. */
export const goToNextPage = () => {
  const page = showsStore.getPage();
  const canGoNext = page < showsStore.getPageCount();
  if (!canGoNext) {
    return;
  }

  showsStore.setPage(page + 1);
};
