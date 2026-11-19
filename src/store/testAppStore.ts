import type { AppStore } from './store';

type StoreModule = typeof import('./store');

let createFresh: () => AppStore;
let current: AppStore;

/**
 * Factory for `vi.mock('@src/store/store', ...)` in task tests: tasks import the app `store` instance,
 * and here it becomes a fresh store on every `resetAppStore()` call, so tests do not share state.
 */
export const mockStoreModule = async (importOriginal: () => Promise<StoreModule>) => {
  const actual = await importOriginal();
  createFresh = actual.createStore;
  current = createFresh();

  return {
    ...actual,
    get store() {
      return current;
    },
  };
};

/** Replaces the mocked app store with a fresh one and returns it. */
export const resetAppStore = () => {
  current = createFresh();

  return current;
};
