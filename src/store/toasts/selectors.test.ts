import { createStore } from '@src/store/store';
import { selectToasts } from './selectors';
import { toastShown } from './toastsSlice';

describe('toasts selectors', () => {
  it('return the toasts', () => {
    const store = createStore();
    store.dispatch(toastShown('Added'));

    expect(selectToasts(store.getState())).toMatchObject([{ message: 'Added' }]);
  });
});
