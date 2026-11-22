import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';

/** Loads the previous page of the results, unless the first one is already shown. */
export const goToPreviousPage = async () => {
  const page = showsStore.getPage();
  const canGoPrev = page > 1;
  if (!canGoPrev) {
    return { error: null };
  }

  showsStore.setPage(page - 1);
  const result = await loadResults();

  return result;
};
