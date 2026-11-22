import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from '@src/store/store';
import { renderHookWithStore } from '@src/store/testStore';
import { toastShown } from '@src/store/toasts/toastsSlice';
import { TOAST_DURATION_MS, usePresenter } from './usePresenter';

const storeWithToast = () => {
  const store = createStore();
  store.dispatch(toastShown('Saved', 'error'));
  const [toast] = store.getState().toasts.items;

  return { store, toast };
};

describe('Toast usePresenter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the message and tone', () => {
    const { store, toast } = storeWithToast();

    const { result } = renderHookWithStore(() => usePresenter({ toast }), store);

    expect(result.current).toMatchObject({ message: 'Saved', tone: 'error' });
  });

  it('hides the toast after a while', () => {
    const { store, toast } = storeWithToast();
    renderHookWithStore(() => usePresenter({ toast }), store);

    act(() => vi.advanceTimersByTime(TOAST_DURATION_MS - 1));

    expect(store.getState().toasts.items).toHaveLength(1);

    act(() => vi.advanceTimersByTime(1));

    expect(store.getState().toasts.items).toEqual([]);
  });

  it('hides the toast at once when closed', () => {
    const { store, toast } = storeWithToast();
    const { result } = renderHookWithStore(() => usePresenter({ toast }), store);

    act(() => result.current.handleClose());

    expect(store.getState().toasts.items).toEqual([]);
  });
});
