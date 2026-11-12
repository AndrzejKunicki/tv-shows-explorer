import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const presenter = {
  isVisible: true,
  label: 'Page 2 of 3',
  canGoPrev: true,
  canGoNext: true,
  handlePrev: vi.fn(),
  handleNext: vi.fn(),
};

describe('Pagination', () => {
  it('renders nothing when hidden', () => {
    usePresenterMock.mockReturnValue({ ...presenter, isVisible: false });
    const { container } = render(<Pagination />);

    expect(container.innerHTML).toBe('');
  });

  it('shows the label and calls the handlers', () => {
    usePresenterMock.mockReturnValue(presenter);
    render(<Pagination />);

    fireEvent.click(screen.getByRole('button', { name: '← Prev' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));

    expect(screen.getByRole('navigation', { name: 'Pagination' }).textContent).toContain('Page 2 of 3');
    expect(presenter.handlePrev).toHaveBeenCalledTimes(1);
    expect(presenter.handleNext).toHaveBeenCalledTimes(1);
  });

  it('disables buttons that cannot be used', () => {
    usePresenterMock.mockReturnValue({ ...presenter, canGoPrev: false, canGoNext: false });
    render(<Pagination />);

    expect(screen.getByRole('button', { name: '← Prev' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: 'Next →' }).hasAttribute('disabled')).toBe(true);
  });
});
