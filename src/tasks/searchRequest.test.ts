import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cancelSearch, scheduleSearch, startSearchRequest } from './searchRequest';

describe('searchRequest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    cancelSearch();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs a scheduled search after the delay', () => {
    const search = vi.fn();

    scheduleSearch(search, 300);
    vi.advanceTimersByTime(299);

    expect(search).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(search).toHaveBeenCalledTimes(1);
  });

  it('runs only the last search scheduled within the delay', () => {
    const first = vi.fn();
    const second = vi.fn();

    scheduleSearch(first, 300);
    vi.advanceTimersByTime(200);
    scheduleSearch(second, 300);
    vi.advanceTimersByTime(300);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('aborts the previous request when a new one starts', () => {
    const first = startSearchRequest();
    const second = startSearchRequest();

    expect(first.aborted).toBe(true);
    expect(second.aborted).toBe(false);
  });

  it('a new request cancels the scheduled search', () => {
    const search = vi.fn();

    scheduleSearch(search, 300);
    startSearchRequest();
    vi.advanceTimersByTime(300);

    expect(search).not.toHaveBeenCalled();
  });

  it('cancelSearch stops both the scheduled search and the request in flight', () => {
    const search = vi.fn();
    const signal = startSearchRequest();
    scheduleSearch(search, 300);

    cancelSearch();
    vi.advanceTimersByTime(300);

    expect(signal.aborted).toBe(true);
    expect(search).not.toHaveBeenCalled();
  });
});
