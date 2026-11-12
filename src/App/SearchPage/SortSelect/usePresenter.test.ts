import type { ChangeEvent } from 'react';
import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderHookWithStore } from '@src/store/testStore';
import { SORT_OPTIONS, usePresenter } from './usePresenter';

const changeEvent = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLSelectElement>;

describe('SortSelect usePresenter', () => {
  it('starts with the best match order and offers all options', () => {
    const { result } = renderHookWithStore(usePresenter);

    expect(result.current.value).toBe('relevance');
    expect(result.current.options).toBe(SORT_OPTIONS);
  });

  it('changes the sort order', () => {
    const { result, store } = renderHookWithStore(usePresenter);

    act(() => result.current.handleChange(changeEvent('rating')));

    expect(store.getState().shows.sortBy).toBe('rating');
    expect(result.current.value).toBe('rating');
  });

  it('ignores unknown values', () => {
    const { result, store } = renderHookWithStore(usePresenter);

    act(() => result.current.handleChange(changeEvent('name')));

    expect(store.getState().shows.sortBy).toBe('relevance');
  });
});
