import type { Mock } from 'vitest';
import type { Show } from '@src/api/types';

type SearchShows = (query: string, signal?: AbortSignal) => Promise<Show[]>;

/** Lets mocked API promises and thunks settle. */
export const settle = () => new Promise((resolve) => setTimeout(resolve));

/**
 * Makes the next call of the mocked `searchShows` stay in flight until resolved by hand
 * or rejected by its abort signal, like `fetch` does.
 */
export const deferredRequest = (searchShowsMock: Mock<SearchShows>) => {
  const request = { resolve: (_shows: Show[]) => {}, signal: undefined as AbortSignal | undefined };
  searchShowsMock.mockImplementationOnce(
    (_query, signal) =>
      new Promise<Show[]>((onResolve, onReject) => {
        request.resolve = onResolve;
        request.signal = signal;
        signal?.addEventListener('abort', () => onReject(new DOMException('Aborted', 'AbortError')));
      }),
  );

  return request;
};
