import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { FavoritesPanel } from './FavoritesPanel';
import { usePresenter } from './logic/usePresenter';

vi.mock('./logic/usePresenter', () => ({ usePresenter: vi.fn() }));
vi.mock('./FavoriteItem/FavoriteItem', () => ({
  FavoriteItem: ({ show }: { show: { name: string } }) => <span>{show.name}</span>,
}));
const usePresenterMock = vi.mocked(usePresenter);

describe('FavoritesPanel', () => {
  it('lists the favorite shows in a dialog', () => {
    usePresenterMock.mockReturnValue({ shows: [makeShow(1, []), makeShow(2, [])], message: null });
    render(<FavoritesPanel onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: 'Favorites' });

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Show 1', 'Show 2']);
    expect(dialog.id).toBe('favorites-panel');
  });

  it('shows the message', () => {
    usePresenterMock.mockReturnValue({ shows: [], message: 'No favorites yet.' });
    render(<FavoritesPanel onClose={vi.fn()} />);

    expect(screen.getByText('No favorites yet.')).toBeTruthy();
  });

  it('closes with the close button and by clicking outside', () => {
    usePresenterMock.mockReturnValue({ shows: [], message: null });
    const onClose = vi.fn();
    const { container } = render(<FavoritesPanel onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close favorites' }));
    fireEvent.click(container.firstElementChild as Element);

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
