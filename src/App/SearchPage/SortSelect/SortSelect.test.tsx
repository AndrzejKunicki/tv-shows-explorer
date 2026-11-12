import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SortBy } from '@src/store/shows/showsSlice';
import { SortSelect } from './SortSelect';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const options: { value: SortBy; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'rating', label: 'Highest rated' },
];

describe('SortSelect', () => {
  it('renders the options with the current value selected', () => {
    usePresenterMock.mockReturnValue({ value: 'rating', options, handleChange: vi.fn() });
    render(<SortSelect />);

    const select = screen.getByRole<HTMLSelectElement>('combobox', { name: 'Sort by' });
    const labels = [...select.options].map((option) => option.textContent);

    expect(labels).toEqual(['Best match', 'Highest rated']);
    expect(select.value).toBe('rating');
  });

  it('passes changes to the presenter', () => {
    const handleChange = vi.fn();
    usePresenterMock.mockReturnValue({ value: 'relevance', options, handleChange });
    render(<SortSelect />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Sort by' }), { target: { value: 'rating' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
