import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ShowReel } from './ShowReel';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const rows = [
  {
    id: 0,
    posters: [
      { key: '1-0', imageUrl: 'a.jpg', isPlaying: true, isLoaded: true },
      { key: '2-1', imageUrl: 'b.jpg', isPlaying: false, isLoaded: false },
    ],
  },
];

describe('ShowReel', () => {
  it('renders nothing without rows', () => {
    usePresenterMock.mockReturnValue({ rows: [], hasRows: false, isHidden: false, handleImageLoad: vi.fn() });
    const { container } = render(<ShowReel />);

    expect(container.innerHTML).toBe('');
  });

  it('renders a decorative wall of screens with their state', () => {
    usePresenterMock.mockReturnValue({ rows, hasRows: true, isHidden: false, handleImageLoad: vi.fn() });
    const { container } = render(<ShowReel />);

    const screens = [...container.querySelectorAll<HTMLElement>('[data-playing]')];
    const states = screens.map((screen) => [screen.dataset.playing, screen.dataset.loaded]);

    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(states).toEqual([
      ['true', 'true'],
      ['false', 'false'],
    ]);
  });

  it('reports loaded images to the presenter', () => {
    const handleImageLoad = vi.fn();
    usePresenterMock.mockReturnValue({ rows, hasRows: true, isHidden: false, handleImageLoad });
    const { container } = render(<ShowReel />);

    const image = container.querySelector('img[src="b.jpg"]');
    if (image) {
      fireEvent.load(image);
    }

    expect(handleImageLoad).toHaveBeenCalledWith('b.jpg');
  });
});
