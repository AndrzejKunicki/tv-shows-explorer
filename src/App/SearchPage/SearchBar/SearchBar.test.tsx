import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

const mockPresenter = () => {
  const presenter = {
    value: 'lost',
    inputRef: createRef<HTMLInputElement>(),
    handleChange: vi.fn(),
    handleSubmit: vi.fn(),
    handleKeyDown: vi.fn(),
  };
  usePresenterMock.mockReturnValue(presenter);

  return presenter;
};

describe('SearchBar', () => {
  it('renders the search field with the current value', () => {
    mockPresenter();
    render(<SearchBar />);

    const input = screen.getByRole<HTMLInputElement>('searchbox', { name: 'Search TV shows by title' });

    expect(input.value).toBe('lost');
    expect(screen.getByRole('search')).toBeTruthy();
  });

  it('connects the input ref', () => {
    const presenter = mockPresenter();
    render(<SearchBar />);

    expect(presenter.inputRef.current).toBe(screen.getByRole('searchbox'));
  });

  it('wires the field and the form to the presenter handlers', () => {
    const presenter = mockPresenter();
    render(<SearchBar />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'lo' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.submit(screen.getByRole('search'));

    expect(presenter.handleChange).toHaveBeenCalledTimes(1);
    expect(presenter.handleKeyDown).toHaveBeenCalledTimes(1);
    expect(presenter.handleSubmit).toHaveBeenCalledTimes(1);
  });
});
