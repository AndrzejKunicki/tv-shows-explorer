import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAppDispatch, useAppSelector } from './hooks';
import { draftChanged } from './shows/showsSlice';
import { renderHookWithStore } from './testStore';

describe('store hooks', () => {
  it('useAppSelector reads from the store', () => {
    const { result } = renderHookWithStore(() => useAppSelector((state) => state.shows.status));

    expect(result.current).toBe('idle');
  });

  it('useAppDispatch dispatches to the store', () => {
    const { result, store } = renderHookWithStore(useAppDispatch);

    act(() => {
      result.current(draftChanged('lost'));
    });

    expect(store.getState().shows.draft).toBe('lost');
  });
});
