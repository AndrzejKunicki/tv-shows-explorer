import { fireEvent, render, screen } from '@testing-library/react';
import { Toast } from './Toast';
import { usePresenter } from './logic/usePresenter';

vi.mock('./logic/usePresenter', () => ({ usePresenter: vi.fn() }));

const toast = { id: '1', message: 'Saved', tone: 'error' as const };

describe('Toast', () => {
  it('shows the message with its tone and a close button', () => {
    const handleClose = vi.fn();
    vi.mocked(usePresenter).mockReturnValue({ message: 'Saved', tone: 'error', iconPath: 'M1 1', handleClose });
    const { container } = render(<Toast toast={toast} />);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));

    expect(screen.getByText('Saved')).toBeTruthy();
    expect(container.firstElementChild?.getAttribute('data-tone')).toBe('error');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('draws the icon chosen by the presenter', () => {
    vi.mocked(usePresenter).mockReturnValue({ message: 'Added', tone: 'success', iconPath: 'M1 1', handleClose: vi.fn() });
    const { container } = render(<Toast toast={toast} />);

    expect(container.querySelector('svg path')?.getAttribute('d')).toBe('M1 1');
  });
});
