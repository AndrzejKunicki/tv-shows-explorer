import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Hero } from './Hero';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

describe('Hero', () => {
  it('renders the headline', () => {
    usePresenterMock.mockReturnValue({ isCompact: false });
    render(<Hero />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Not sure what to watch? Start here.');
  });

  it('exposes the compact state for styling', () => {
    usePresenterMock.mockReturnValue({ isCompact: true });
    render(<Hero />);

    expect(screen.getByRole('banner').dataset.compact).toBe('true');
  });
});
