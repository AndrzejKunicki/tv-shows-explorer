import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { act, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { draftChanged } from '@src/store/shows/showsSlice';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { cancelSearch } from '@src/tasks/searchRequest';
import { clearSearch } from './tasks/clearSearch';
import { typeQuery } from './tasks/typeQuery';
import { FOCUS_KEY, usePresenter } from './usePresenter';

vi.mock('@src/tasks/searchRequest', () => ({ cancelSearch: vi.fn() }));
vi.mock('./tasks/clearSearch', () => ({ clearSearch: vi.fn() }));
vi.mock('./tasks/typeQuery', () => ({ typeQuery: vi.fn() }));

describe('SearchBar usePresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the text from the store', () => {
    const store = createStore();
    store.dispatch(draftChanged('lost'));

    const { result } = renderHookWithStore(usePresenter, store);

    expect(result.current.value).toBe('lost');
  });

  it('passes the typed text to the typeQuery task', () => {
    const { result } = renderHookWithStore(usePresenter);

    act(() => {
      result.current.handleChange({ target: { value: 'lost' } } as ChangeEvent<HTMLInputElement>);
    });

    expect(typeQuery).toHaveBeenCalledWith('lost');
  });

  it('clears the search on Escape only', () => {
    const { result } = renderHookWithStore(usePresenter);

    act(() => result.current.handleKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>));

    expect(clearSearch).not.toHaveBeenCalled();

    act(() => result.current.handleKeyDown({ key: 'Escape' } as KeyboardEvent<HTMLInputElement>));

    expect(clearSearch).toHaveBeenCalledTimes(1);
  });

  it('cancels the search on unmount', () => {
    const { unmount } = renderHookWithStore(usePresenter);

    expect(cancelSearch).not.toHaveBeenCalled();

    unmount();

    expect(cancelSearch).toHaveBeenCalledTimes(1);
  });

  it('prevents the form from reloading the page', () => {
    const { result } = renderHookWithStore(usePresenter);
    const preventDefault = vi.fn();

    result.current.handleSubmit({ preventDefault } as unknown as FormEvent<HTMLFormElement>);

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('focuses the field on the focus key, but not while typing elsewhere', () => {
    const { result } = renderHookWithStore(usePresenter);
    const input = document.createElement('input');
    const other = document.createElement('textarea');
    document.body.append(input, other);
    result.current.inputRef.current = input;

    fireEvent.keyDown(other, { key: FOCUS_KEY });

    expect(document.activeElement).not.toBe(input);

    fireEvent.keyDown(document.body, { key: FOCUS_KEY });

    expect(document.activeElement).toBe(input);
    input.remove();
    other.remove();
  });
});
