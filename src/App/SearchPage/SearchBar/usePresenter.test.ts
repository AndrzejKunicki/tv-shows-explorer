import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { act, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { searchShows } from '@src/api/tvmaze';
import { renderHookWithStore } from '@src/store/testStore';
import { FOCUS_KEY, SEARCH_DEBOUNCE_MS, usePresenter } from './usePresenter';

vi.mock('@src/api/tvmaze', () => ({ searchShows: vi.fn() }));
const searchShowsMock = vi.mocked(searchShows);

const type = (result: { current: ReturnType<typeof usePresenter> }, value: string) => {
  act(() => {
    result.current.handleChange({ target: { value } } as ChangeEvent<HTMLInputElement>);
  });
};

describe('SearchBar usePresenter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    searchShowsMock.mockReset().mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores the typed text and searches after the debounce', () => {
    const { result, store } = renderHookWithStore(usePresenter);

    type(result, 'lost');
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1));

    expect(result.current.value).toBe('lost');
    expect(searchShowsMock).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));

    expect(searchShowsMock).toHaveBeenCalledWith('lost', expect.anything());
    expect(store.getState().shows.status).toBe('loading');
  });

  it('aborts the previous request when the query changes', () => {
    const { result } = renderHookWithStore(usePresenter);

    type(result, 'lost');
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    type(result, 'lost girl');
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    const firstSignal = searchShowsMock.mock.calls[0][1];

    expect(firstSignal?.aborted).toBe(true);
  });

  it('clears the field on Escape', () => {
    const { result } = renderHookWithStore(usePresenter);

    type(result, 'lost');
    act(() => result.current.handleKeyDown({ key: 'Escape' } as KeyboardEvent<HTMLInputElement>));

    expect(result.current.value).toBe('');
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
