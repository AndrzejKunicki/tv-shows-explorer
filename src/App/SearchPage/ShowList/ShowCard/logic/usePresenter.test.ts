import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Show } from '@src/api/types';
import { withPoster } from '@src/store/discover/testState';
import { makeShow } from '@src/store/shows/testShows';
import { usePresenter } from './usePresenter';

const renderPresenter = (show: Show) => renderHook(() => usePresenter({ show })).result.current;

describe('ShowCard usePresenter', () => {
  it('prepares the card data', () => {
    const show = { ...withPoster(1, 7.25), genres: ['Drama', 'Crime'], summary: '<p>A &amp; B</p>' };

    expect(renderPresenter(show)).toEqual({
      name: 'Show 1',
      url: 'https://www.tvmaze.com/shows/1',
      imageUrl: 'medium-1.jpg',
      rating: '7.3',
      meta: '2020 · English',
      genres: 'Drama, Crime',
      summary: 'A & B',
    });
  });

  it('returns null or empty values for missing data', () => {
    const show = { ...makeShow(1, []), premiered: null, language: null };

    expect(renderPresenter(show)).toMatchObject({ imageUrl: null, rating: null, meta: '', genres: '', summary: null });
  });
});
