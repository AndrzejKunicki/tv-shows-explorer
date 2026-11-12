import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

const renderDebounced = () =>
  renderHook(({ value }) => useDebouncedValue(value, 300), { initialProps: { value: 'a' } });

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value right away', () => {
    const { result } = renderDebounced();

    expect(result.current).toBe('a');
  });

  it('updates only after the value stops changing for the delay', () => {
    const { result, rerender } = renderDebounced();

    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(299));

    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(1));

    expect(result.current).toBe('abc');
  });
});
