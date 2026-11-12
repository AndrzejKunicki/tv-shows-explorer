import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GenreChips } from './GenreChips';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const handleSelect = vi.fn();
const handleReset = vi.fn();

const mockPresenter = (genres: string[], selectedGenre: string | null) => {
  usePresenterMock.mockReturnValue({ genres, selectedGenre, handleSelect, handleReset });
};

describe('GenreChips', () => {
  beforeEach(() => {
    handleSelect.mockReset();
    handleReset.mockReset();
  });

  it('renders nothing when there are no genres', () => {
    mockPresenter([], null);
    const { container } = render(<GenreChips />);

    expect(container.innerHTML).toBe('');
  });

  it('renders "All" plus one chip per genre, marking the selected one', () => {
    mockPresenter(['Comedy', 'Drama'], 'Drama');
    render(<GenreChips />);

    const labels = screen.getAllByRole('button').map((chip) => chip.textContent);

    expect(labels).toEqual(['All', 'Comedy', 'Drama']);
    expect(screen.getByRole('button', { name: 'Drama' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('marks "All" as active when no genre is selected', () => {
    mockPresenter(['Comedy'], null);
    render(<GenreChips />);

    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('wires the chips to the presenter handlers', () => {
    mockPresenter(['Comedy'], null);
    render(<GenreChips />);

    fireEvent.click(screen.getByRole('button', { name: 'Comedy' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(handleSelect).toHaveBeenCalledWith('Comedy');
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
