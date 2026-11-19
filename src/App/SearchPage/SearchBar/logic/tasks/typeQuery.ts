import { draftChanged } from '@src/store/shows/showsSlice';
import { store } from '@src/store/store';
import { findShowsDebounced } from '@src/tasks/findShowsDebounced';

/** Shows the typed text in the field and searches for it once the user stops typing. */
export const typeQuery = (text: string) => {
  store.dispatch(draftChanged(text));
  findShowsDebounced(text);
};
