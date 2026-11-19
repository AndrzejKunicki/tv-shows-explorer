import { draftChanged } from '@src/store/shows/showsSlice';
import { store } from '@src/store/store';
import { findShows } from '@src/tasks/findShows';

/** Empties the field and the results at once, so a late response cannot flash the old results. */
export const clearSearch = async () => {
  store.dispatch(draftChanged(''));
  const result = await findShows('');

  return result;
};
