import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PopularToday } from './PopularToday';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

describe('PopularToday', () => {
  it('renders nothing when hidden', () => {
    usePresenterMock.mockReturnValue({ names: ['Show 1'], isVisible: false, handleSelect: vi.fn() });
    const { container } = render(<PopularToday />);

    expect(container.innerHTML).toBe('');
  });

  it('renders a labelled list of suggestions', () => {
    usePresenterMock.mockReturnValue({ names: ['Show 1', 'Show 2'], isVisible: true, handleSelect: vi.fn() });
    render(<PopularToday />);

    const list = screen.getByRole('list', { name: 'Popular on TV today' });

    expect(list.querySelectorAll('button')).toHaveLength(2);
  });

  it('selects a suggestion on click', () => {
    const handleSelect = vi.fn();
    usePresenterMock.mockReturnValue({ names: ['Show 1'], isVisible: true, handleSelect });
    render(<PopularToday />);

    fireEvent.click(screen.getByRole('button', { name: 'Show 1' }));

    expect(handleSelect).toHaveBeenCalledWith('Show 1');
  });
});
