import { act } from '@testing-library/react';
import { renderHookWithStore } from '@src/store/testStore';
import { toastShown } from '@src/store/toasts/toastsSlice';
import { usePresenter } from './usePresenter';

describe('Toaster usePresenter', () => {
  it('returns the toasts from the store', () => {
    const { result, store } = renderHookWithStore(usePresenter);

    expect(result.current.toasts).toEqual([]);

    act(() => {
      store.dispatch(toastShown('Saved'));
    });

    expect(result.current.toasts).toMatchObject([{ message: 'Saved', tone: 'success' }]);
  });
});
