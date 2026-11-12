import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { ShowCard } from './ShowCard';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const presenter = {
  name: 'Lost',
  url: 'https://www.tvmaze.com/shows/1',
  imageUrl: 'lost.jpg',
  rating: '8.4',
  meta: '2004 · English',
  genres: 'Drama, Mystery',
  summary: 'Survivors of a plane crash.',
};

describe('ShowCard', () => {
  it('renders the name as a link to the show page', () => {
    usePresenterMock.mockReturnValue(presenter);
    render(<ShowCard show={makeShow(1, [])} />);

    const link = screen.getByRole('link', { name: 'Lost' });

    expect(link.getAttribute('href')).toBe('https://www.tvmaze.com/shows/1');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('renders the poster, rating and details', () => {
    usePresenterMock.mockReturnValue(presenter);
    const { container } = render(<ShowCard show={makeShow(1, [])} />);

    expect(screen.getByRole('img', { name: 'Lost' }).getAttribute('src')).toBe('lost.jpg');
    expect(container.textContent).toContain('Rated 8.4 out of 10');
    expect(container.textContent).toContain('2004 · English');
    expect(container.textContent).toContain('Drama, Mystery');
    expect(container.textContent).toContain('Survivors of a plane crash.');
  });

  it('shows a placeholder and skips empty details', () => {
    usePresenterMock.mockReturnValue({ ...presenter, imageUrl: null, rating: null, meta: '', genres: '', summary: null });
    const { container } = render(<ShowCard show={makeShow(1, [])} />);

    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelectorAll('p')).toHaveLength(0);
    expect(container.textContent).toBe('No imageLost');
  });
});
