import { render, screen } from '@testing-library/react';
import { Toaster } from './Toaster';
import { usePresenter } from './logic/usePresenter';

vi.mock('./logic/usePresenter', () => ({ usePresenter: vi.fn() }));
vi.mock('./Toast/Toast', () => ({ Toast: ({ toast }: { toast: { message: string } }) => <p>{toast.message}</p> }));

describe('Toaster', () => {
  it('renders every toast in a live region', () => {
    vi.mocked(usePresenter).mockReturnValue({
      toasts: [
        { id: '1', message: 'Added', tone: 'success' },
        { id: '2', message: 'Removed', tone: 'success' },
      ],
    });
    render(<Toaster />);

    const region = screen.getByRole('status');

    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('AddedRemoved');
  });
});
