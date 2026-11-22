/**
 * The only search in progress: a debounce timer waiting to start it, or a request in flight.
 * There is one search field in the app, so one slot is enough; every new search cancels it first,
 * so an outdated response can never overwrite newer results.
 */
let timer: ReturnType<typeof setTimeout> | null = null;
let controller: AbortController | null = null;

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = null;
};

/** Cancels the search waiting for the debounce and aborts the request in flight, if any. */
export const cancelSearch = () => {
  clearTimer();
  controller?.abort();
  controller = null;
};

/** Takes the slot for a new request; its signal is aborted by the next search or by `cancelSearch`. */
export const startSearchRequest = () => {
  cancelSearch();
  controller = new AbortController();
  const { signal } = controller;

  return signal;
};

/**
 * Runs `search` after `delayMs`, unless it is scheduled again or another search starts first.
 * The request in flight is aborted at once: its response is already outdated, and it must not
 * flash on the screen while the user is still typing.
 */
export const scheduleSearch = (search: () => void, delayMs: number) => {
  cancelSearch();
  timer = setTimeout(() => {
    timer = null;
    search();
  }, delayMs);
};
