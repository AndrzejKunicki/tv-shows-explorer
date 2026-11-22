import type { Mock } from 'vitest';
import type { SearchPage, SearchParams } from '@src/api/types';

type SearchShows = (params: SearchParams, signal?: AbortSignal) => Promise<SearchPage>;

/** Lets mocked API promises settle. */
export const settle = () => new Promise((resolve) => setTimeout(resolve));

/**
 * Makes the next call of the mocked `searchShows` stay in flight until resolved by hand
 * or rejected by its abort signal, like `fetch` does.
 */
export const deferredRequest = (searchShowsMock: Mock<SearchShows>) => {
  const request = { resolve: (_page: SearchPage) => {}, signal: undefined as AbortSignal | undefined };
  searchShowsMock.mockImplementationOnce(
    (_params, signal) =>
      new Promise<SearchPage>((onResolve, onReject) => {
        request.resolve = onResolve;
        request.signal = signal;
        signal?.addEventListener('abort', () => onReject(new DOMException('Aborted', 'AbortError')));
      }),
  );

  return request;
};
