import { fireEvent, render, screen } from '@testing-library/react';
import { Favorites } from './Favorites';
import { usePresenter } from './logic/usePresenter';

vi.mock('./logic/usePresenter', () => ({ usePresenter: vi.fn() }));
vi.mock('./FavoritesPanel/FavoritesPanel', () => ({ FavoritesPanel: () => <aside>panel</aside> }));
const usePresenterMock = vi.mocked(usePresenter);

const presenter = {
  count: 3,
  isOpen: false,
  buttonRef: { current: null },
  buttonLabel: 'Favorites: 3 shows',
  handleToggle: vi.fn(),
  handleClose: vi.fn(),
};

describe('Favorites', () => {
  it('shows the button with the count and toggles the list on click', () => {
    usePresenterMock.mockReturnValue(presenter);
    render(<Favorites />);

    const button = screen.getByRole('button', { name: 'Favorites: 3 shows' });
    fireEvent.click(button);

    expect(button.textContent).toContain('3');
    // The favorite star flies to this button
    expect(button.hasAttribute('data-favorites-target')).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(presenter.handleToggle).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('panel')).toBeNull();
  });

  it('shows the list when open', () => {
    usePresenterMock.mockReturnValue({ ...presenter, isOpen: true });
    render(<Favorites />);

    expect(screen.getByText('panel')).toBeTruthy();
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
  });
});
