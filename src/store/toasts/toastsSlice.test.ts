import { describe, expect, it } from 'vitest';
import { initialState, toastHidden, toastShown, toastsReducer } from './toastsSlice';

describe('toastsSlice', () => {
  it('starts without toasts', () => {
    expect(toastsReducer(undefined, { type: 'init' })).toEqual(initialState);
  });

  it('adds toasts with their own ids, success by default', () => {
    let state = toastsReducer(initialState, toastShown('Added'));
    state = toastsReducer(state, toastShown('Failed', 'error'));

    expect(state.items).toMatchObject([
      { message: 'Added', tone: 'success' },
      { message: 'Failed', tone: 'error' },
    ]);
    expect(state.items[0].id).not.toBe(state.items[1].id);
  });

  it('hides a toast by id', () => {
    const shown = toastsReducer(initialState, toastShown('Added'));
    const [toast] = shown.items;

    expect(toastsReducer(shown, toastHidden(toast.id)).items).toEqual([]);
  });
});
