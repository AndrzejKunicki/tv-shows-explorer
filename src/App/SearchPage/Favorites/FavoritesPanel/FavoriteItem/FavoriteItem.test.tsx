import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { FavoriteItem } from './FavoriteItem';
import { usePresenter } from './logic/usePresenter';

vi.mock('./logic/usePresenter', () => ({ usePresenter: vi.fn() }));
vi.mock('@src/components/FavoriteStar/FavoriteStar', () => ({ FavoriteStar: () => <button>star</button> }));

describe('FavoriteItem', () => {
  it('shows the poster, the link to TVMaze, the meta and the star', () => {
    vi.mocked(usePresenter).mockReturnValue({
      name: 'Lost',
      url: 'https://www.tvmaze.com/shows/1',
      imageUrl: 'lost.jpg',
      meta: '2004 · Drama',
    });
    const { container } = render(<FavoriteItem show={makeShow(1, [])} />);

    const link = screen.getByRole('link', { name: 'Lost' });

    expect(link.getAttribute('href')).toBe('https://www.tvmaze.com/shows/1');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(container.querySelector('img')?.getAttribute('src')).toBe('lost.jpg');
    expect(screen.getByText('2004 · Drama')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'star' })).toBeTruthy();
  });
});
