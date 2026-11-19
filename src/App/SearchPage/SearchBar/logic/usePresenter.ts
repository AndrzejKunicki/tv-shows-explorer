import { useEffect, useRef, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useAppSelector } from '@src/store/hooks';
import { selectDraft } from '@src/store/shows/selectors';
import { cancelSearch } from '@src/tasks/searchRequest';
import { clearSearch } from './tasks/clearSearch';
import { typeQuery } from './tasks/typeQuery';

/** Pressing this key anywhere on the page (outside a text field) focuses the search field. */
export const FOCUS_KEY = '/';

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export const usePresenter = () => {
  // The text lives in the store, because the "Popular on TV today" suggestions also set it
  const value = useAppSelector(selectDraft);
  const inputRef = useRef<HTMLInputElement>(null);

  // Leaving the page stops the search that waits for the debounce or is in flight
  useEffect(() => cancelSearch, []);

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => typeQuery(event.target.value);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      clearSearch();
    }
  };

  return { value, inputRef, handleChange, handleSubmit, handleKeyDown };
};
