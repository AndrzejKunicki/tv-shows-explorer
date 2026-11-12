import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SCROLL_STEP, usePresenter } from './usePresenter';

const renderPresenter = () => renderHook(() => usePresenter({ id: 'gems', title: 'Hidden gems' }));

const attachTrack = (result: ReturnType<typeof renderPresenter>['result']) => {
  const track = document.createElement('ul');
  const scrollBy = vi.fn();
  Object.defineProperty(track, 'clientWidth', { value: 1000 });
  track.scrollBy = scrollBy;
  result.current.trackRef.current = track;

  return scrollBy;
};

describe('DiscoverRow usePresenter', () => {
  it('builds the title id and arrow labels', () => {
    const { result } = renderPresenter();

    expect(result.current).toMatchObject({
      titleId: 'gems-title',
      prevLabel: 'Scroll Hidden gems back',
      nextLabel: 'Scroll Hidden gems forward',
    });
  });

  it('scrolls the track forward and back by a share of its width', () => {
    const { result } = renderPresenter();
    const scrollBy = attachTrack(result);

    act(() => result.current.handleNext());
    act(() => result.current.handlePrev());

    expect(scrollBy).toHaveBeenNthCalledWith(1, { left: 1000 * SCROLL_STEP, behavior: 'smooth' });
    expect(scrollBy).toHaveBeenNthCalledWith(2, { left: -1000 * SCROLL_STEP, behavior: 'smooth' });
  });

  it('does nothing when the track is not mounted', () => {
    const { result } = renderPresenter();

    expect(() => result.current.handleNext()).not.toThrow();
  });
});
