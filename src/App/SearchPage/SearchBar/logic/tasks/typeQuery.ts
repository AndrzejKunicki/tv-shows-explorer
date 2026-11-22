import { showsStore } from '@src/store/shows/showsStore';
import { findShowsDebounced } from '@src/tasks/findShowsDebounced';

/** Shows the typed text in the field and searches for it once the user stops typing. */
export const typeQuery = (text: string) => {
  showsStore.setDraft(text);
  findShowsDebounced(text);
};
