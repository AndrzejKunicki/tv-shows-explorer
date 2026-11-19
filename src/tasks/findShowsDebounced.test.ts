import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { findShows } from './findShows';
import { findShowsDebounced, SEARCH_DEBOUNCE_MS } from './findShowsDebounced';
import { cancelSearch } from './searchRequest';

vi.mock('./findShows', () => ({ findShows: vi.fn() }));
const findShowsMock = vi.mocked(findShows);

describe('findShowsDebounced', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    findShowsMock.mockReset();
  });

  afterEach(() => {
    cancelSearch();
    vi.useRealTimers();
  });

  it('searches once the text has not changed for the debounce time', () => {
    findShowsDebounced('lost');
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);

    expect(findShowsMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(findShowsMock).toHaveBeenCalledWith('lost');
  });

  it('searches only for the last text typed within the debounce time', () => {
    findShowsDebounced('lo');
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
    findShowsDebounced('lost');
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

    expect(findShowsMock).toHaveBeenCalledTimes(1);
    expect(findShowsMock).toHaveBeenCalledWith('lost');
  });

  it('does not search when cancelled', () => {
    findShowsDebounced('lost');
    cancelSearch();
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);

    expect(findShowsMock).not.toHaveBeenCalled();
  });
});
