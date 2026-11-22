import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { FavoriteStar } from './FavoriteStar';
import { usePresenter } from './logic/usePresenter';

vi.mock('./logic/usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const presenter = { isFavorite: false, isPending: false, label: 'Add Lost to favorites', handleClick: vi.fn() };

describe('FavoriteStar', () => {
  it('is a toggle button labelled with the action', () => {
    usePresenterMock.mockReturnValue(presenter);
    render(<FavoriteStar show={makeShow(1, [])} />);

    const button = screen.getByRole('button', { name: 'Add Lost to favorites' });

    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('data-active')).toBe('false');
  });

  it('shows the active state of a favorite', () => {
    usePresenterMock.mockReturnValue({ ...presenter, isFavorite: true, label: 'Remove Lost from favorites' });
    render(<FavoriteStar show={makeShow(1, [])} />);

    expect(screen.getByRole('button', { name: 'Remove Lost from favorites' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('calls the handler on click and stays focusable while pending', () => {
    usePresenterMock.mockReturnValue(presenter);
    const { rerender } = render(<FavoriteStar show={makeShow(1, [])} />);

    fireEvent.click(screen.getByRole('button'));

    expect(presenter.handleClick).toHaveBeenCalledTimes(1);

    usePresenterMock.mockReturnValue({ ...presenter, isPending: true });
    rerender(<FavoriteStar show={makeShow(1, [])} />);

    const button = screen.getByRole('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBe(false);
  });
});
