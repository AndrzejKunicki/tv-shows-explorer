import { showsStore } from '@src/store/shows/showsStore';
import { findShows } from '@src/tasks/findShows';

/** Empties the field and the results at once, so a late response cannot flash the old results. */
export const clearSearch = async () => {
  showsStore.setDraft('');
  const result = await findShows('');

  return result;
};
