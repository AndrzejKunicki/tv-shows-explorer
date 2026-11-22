import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { usePresenter } from './usePresenter';

describe('FavoriteItem usePresenter', () => {
  it('prepares the name, link, poster and meta', () => {
    const show = { ...makeShow(1, ['Drama', 'Crime', 'Mystery']), image: { medium: 'm.jpg', original: 'o.jpg' } };

    const { result } = renderHook(() => usePresenter({ show }));

    expect(result.current).toEqual({
      name: 'Show 1',
      url: 'https://www.tvmaze.com/shows/1',
      imageUrl: 'm.jpg',
      meta: '2020 · Drama, Crime',
    });
  });

  it('works without a poster, year or genres', () => {
    const show = { ...makeShow(2, []), premiered: null };

    const { result } = renderHook(() => usePresenter({ show }));

    expect(result.current).toMatchObject({ imageUrl: null, meta: '' });
  });
});
