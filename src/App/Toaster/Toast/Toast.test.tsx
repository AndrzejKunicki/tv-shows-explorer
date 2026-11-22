import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';
import { usePresenter } from './logic/usePresenter';

vi.mock('./logic/usePresenter', () => ({ usePresenter: vi.fn() }));

const toast = { id: '1', message: 'Saved', tone: 'error' as const };

describe('Toast', () => {
  it('shows the message with its tone and a close button', () => {
    const handleClose = vi.fn();
    vi.mocked(usePresenter).mockReturnValue({ message: 'Saved', tone: 'error', handleClose });
    const { container } = render(<Toast toast={toast} />);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));

    expect(screen.getByText('Saved')).toBeTruthy();
    expect(container.firstElementChild?.getAttribute('data-tone')).toBe('error');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
