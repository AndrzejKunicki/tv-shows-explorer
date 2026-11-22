import type { SortBy } from '@src/api/types';
import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';

/** Changes the sort order and loads the first page sorted that way. */
export const changeSort = async (sort: SortBy) => {
  showsStore.setSort(sort);
  const result = await loadResults();

  return result;
};
