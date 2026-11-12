import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Show } from '@src/api/types';
import { withPoster } from '@src/store/discover/testState';
import { makeShow } from '@src/store/shows/testShows';
import { usePresenter } from './usePresenter';

const renderPresenter = (show: Show) => renderHook(() => usePresenter({ show })).result.current;

describe('PosterCard usePresenter', () => {
  it('prepares the card data', () => {
    const show = { ...withPoster(1, 8.44), genres: ['Drama', 'Crime'] };

    expect(renderPresenter(show)).toEqual({
      name: 'Show 1',
      url: 'https://www.tvmaze.com/shows/1',
      imageUrl: 'medium-1.jpg',
      rating: '8.4',
      meta: '2020 · Drama',
    });
  });

  it('returns null for a missing image or rating', () => {
    const result = renderPresenter(makeShow(1, []));

    expect(result.imageUrl).toBeNull();
    expect(result.rating).toBeNull();
  });

  it('builds meta from whatever is known', () => {
    const noYear = { ...makeShow(1, ['Comedy']), premiered: null };
    const nothing = { ...makeShow(2, []), premiered: null };

    expect(renderPresenter(noYear).meta).toBe('Comedy');
    expect(renderPresenter(nothing).meta).toBe('');
  });
});
