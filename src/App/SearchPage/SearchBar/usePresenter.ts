import { useEffect, useRef, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { abortSearch, searchQuery } from '@src/store/shows/searchQuery';
import { selectDraft } from '@src/store/shows/selectors';
import { draftChanged } from '@src/store/shows/showsSlice';
import { useDebouncedValue } from './useDebouncedValue';

export const SEARCH_DEBOUNCE_MS = 300;
/** Pressing this key anywhere on the page (outside a text field) focuses the search field. */
export const FOCUS_KEY = '/';

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  // The text lives in the store, because the "Popular on TV today" suggestions also set it
  const value = useAppSelector(selectDraft);
  const debouncedValue = useDebouncedValue(value, SEARCH_DEBOUNCE_MS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(searchQuery(debouncedValue));
  }, [debouncedValue, dispatch]);

  useEffect(
    () => () => {
      dispatch(abortSearch());
    },
    [dispatch],
  );

  useEffect(() => {
    const handleGlobalKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === FOCUS_KEY && !isTyping(event.target)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKey);

    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => dispatch(draftChanged(event.target.value));
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      dispatch(draftChanged(''));
      // Clear right away instead of after the debounce, so a late response cannot flash the old results
      dispatch(searchQuery(''));
    }
  };

  return { value, inputRef, handleChange, handleSubmit, handleKeyDown };
};
