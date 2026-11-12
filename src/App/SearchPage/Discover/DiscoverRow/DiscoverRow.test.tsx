import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { withPoster } from '@src/store/discover/testState';
import { DiscoverRow } from './DiscoverRow';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const presenter = {
  trackRef: createRef<HTMLUListElement>(),
  titleId: 'gems-title',
  prevLabel: 'Scroll Gems back',
  nextLabel: 'Scroll Gems forward',
  handlePrev: vi.fn(),
  handleNext: vi.fn(),
};

const renderRow = () => {
  usePresenterMock.mockReturnValue(presenter);
  render(<DiscoverRow id="gems" title="Gems" subtitle="Under the radar" shows={[withPoster(1, 8), withPoster(2, 9)]} />);
};

describe('DiscoverRow', () => {
  it('renders a section labelled by its title, with the subtitle', () => {
    renderRow();

    const section = screen.getByRole('region', { name: 'Gems' });

    expect(section.textContent).toContain('Under the radar');
  });

  it('renders one card per show', () => {
    renderRow();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Show 1' })).toBeTruthy();
  });

  it('wires the arrows to the presenter handlers', () => {
    renderRow();

    fireEvent.click(screen.getByRole('button', { name: 'Scroll Gems back' }));
    fireEvent.click(screen.getByRole('button', { name: 'Scroll Gems forward' }));

    expect(presenter.handlePrev).toHaveBeenCalledTimes(1);
    expect(presenter.handleNext).toHaveBeenCalledTimes(1);
  });
});
