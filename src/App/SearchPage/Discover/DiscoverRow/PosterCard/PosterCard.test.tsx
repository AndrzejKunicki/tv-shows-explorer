import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { PosterCard } from './PosterCard';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const presenter = {
  name: 'Lost',
  url: 'https://www.tvmaze.com/shows/1',
  imageUrl: 'lost.jpg',
  rating: '8.4',
  meta: '2004 · Drama',
};

describe('PosterCard', () => {
  it('links to the show page in a new tab', () => {
    usePresenterMock.mockReturnValue(presenter);
    render(<PosterCard show={makeShow(1, [])} />);

    const link = screen.getByRole('link', { name: /Lost/ });

    expect(link.getAttribute('href')).toBe('https://www.tvmaze.com/shows/1');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('shows the poster, rating and meta', () => {
    usePresenterMock.mockReturnValue(presenter);
    const { container } = render(<PosterCard show={makeShow(1, [])} />);

    expect(container.querySelector('img')?.getAttribute('src')).toBe('lost.jpg');
    expect(container.textContent).toContain('Rated 8.4 out of 10');
    expect(container.textContent).toContain('2004 · Drama');
  });

  it('skips the optional parts when data is missing', () => {
    usePresenterMock.mockReturnValue({ ...presenter, imageUrl: null, rating: null, meta: '' });
    const { container } = render(<PosterCard show={makeShow(1, [])} />);

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
    expect(container.textContent).toBe('Lost');
  });
});
