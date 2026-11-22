import { showsStore } from '@src/store/shows/showsStore';
import { findShows } from '@src/tasks/findShows';

/** Puts the suggested name into the search field and searches for it right away. */
export const pickSuggestion = async (name: string) => {
  showsStore.setDraft(name);
  const result = await findShows(name);

  return result;
};
