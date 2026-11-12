import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import { createStore, type AppStore } from './store';

/** Renders a hook inside a Redux Provider with a fresh (or given) store. */
export const renderHookWithStore = <Result,>(hook: () => Result, store: AppStore = createStore()) => {
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  const rendered = renderHook(hook, { wrapper });

  return { ...rendered, store };
};
