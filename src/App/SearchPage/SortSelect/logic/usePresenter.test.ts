import type { ChangeEvent } from 'react';
import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sortChanged } from '@src/store/shows/showsSlice';
import { renderHookWithStore } from '@src/store/testStore';
import { changeSort } from './tasks/changeSort';
import { SORT_OPTIONS, usePresenter } from './usePresenter';

vi.mock('./tasks/changeSort', () => ({ changeSort: vi.fn() }));

const changeEvent = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLSelectElement>;

describe('SortSelect usePresenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with the best match order and offers all options', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current.value).toBe('relevance');
    expect(result.current.options).toBe(SORT_OPTIONS);
  });

  it('shows the sort order from the store', () => {
    const { result, store } = renderHookWithStore(usePresenter);

    act(() => {
      store.dispatch(sortChanged('rating'));
    });

    expect(result.current.value).toBe('rating');
  });

  it('changes the sort order through the task', () => {
    const { result } = renderHookWithStore(usePresenter);

    act(() => result.current.handleChange(changeEvent('rating')));

    expect(changeSort).toHaveBeenCalledWith('rating');
  });

  it('ignores unknown values', () => {
    const { result } = renderHookWithStore(usePresenter);

    act(() => result.current.handleChange(changeEvent('name')));

    expect(changeSort).not.toHaveBeenCalled();
  });
});
