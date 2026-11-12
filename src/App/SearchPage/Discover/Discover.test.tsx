import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { withPoster } from '@src/store/discover/testState';
import { Discover } from './Discover';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

describe('Discover', () => {
  it('renders nothing without rows', () => {
    usePresenterMock.mockReturnValue({ rows: [], hasRows: false });
    const { container } = render(<Discover />);

    expect(container.innerHTML).toBe('');
  });

  it('renders one labelled section per row', () => {
    const rows = [
      { id: 'airing-today', title: 'Airing today', subtitle: 'Today', shows: [withPoster(1, 8)] },
      { id: 'fan-favorites', title: 'Fan favorites', subtitle: 'Best', shows: [withPoster(2, 9)] },
    ];
    usePresenterMock.mockReturnValue({ rows, hasRows: true });
    render(<Discover />);

    expect(screen.getByRole('region', { name: 'Airing today' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Fan favorites' })).toBeTruthy();
  });
});
