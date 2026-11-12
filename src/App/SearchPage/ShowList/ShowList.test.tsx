import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeShow } from '@src/store/shows/testShows';
import { ShowList } from './ShowList';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
const usePresenterMock = vi.mocked(usePresenter);

describe('ShowList', () => {
  it('renders one card per show', () => {
    usePresenterMock.mockReturnValue({ shows: [makeShow(1, []), makeShow(2, [])] });
    render(<ShowList />);

    const names = screen.getAllByRole('heading').map((heading) => heading.textContent);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(names).toEqual(['Show 1', 'Show 2']);
  });

  it('renders an empty list without shows', () => {
    usePresenterMock.mockReturnValue({ shows: [] });
    render(<ShowList />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
