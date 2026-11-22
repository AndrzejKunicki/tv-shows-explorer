import { draftChanged } from '@src/store/shows/showsSlice';
import { store } from '@src/store/store';
import { findShows } from '@src/tasks/findShows';

/** Puts the suggested name into the search field and searches for it right away. */
export const pickSuggestion = async (name: string) => {
  store.dispatch(draftChanged(name));
  const result = await findShows(name);

  return result;
};
