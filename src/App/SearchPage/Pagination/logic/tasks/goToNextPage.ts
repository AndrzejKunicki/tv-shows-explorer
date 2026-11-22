import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';

/** Loads the next page of the results, unless the last one is already shown. */
export const goToNextPage = async () => {
  const page = showsStore.getPage();
  const canGoNext = page < showsStore.getPageCount();
  if (!canGoNext) {
    return { error: null };
  }

  showsStore.setPage(page + 1);
  const result = await loadResults();

  return result;
};
