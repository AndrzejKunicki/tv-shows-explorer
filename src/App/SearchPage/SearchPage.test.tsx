import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchPage } from './SearchPage';
import { usePresenter } from './usePresenter';

vi.mock('./usePresenter', () => ({ usePresenter: vi.fn() }));
vi.mock('./ShowReel/ShowReel', () => ({ ShowReel: () => <div>ShowReel</div> }));
vi.mock('./Hero/Hero', () => ({ Hero: () => <div>Hero</div> }));
vi.mock('./SearchBar/SearchBar', () => ({ SearchBar: () => <div>SearchBar</div> }));
vi.mock('./PopularToday/PopularToday', () => ({ PopularToday: () => <div>PopularToday</div> }));
vi.mock('./GenreChips/GenreChips', () => ({ GenreChips: () => <div>GenreChips</div> }));
vi.mock('./SortSelect/SortSelect', () => ({ SortSelect: () => <div>SortSelect</div> }));
vi.mock('./ShowList/ShowList', () => ({ ShowList: () => <div>ShowList</div> }));
vi.mock('./Pagination/Pagination', () => ({ Pagination: () => <div>Pagination</div> }));
vi.mock('./Discover/Discover', () => ({ Discover: () => <div>Discover</div> }));
const usePresenterMock = vi.mocked(usePresenter);

const presenter = { message: null, isError: false, hasResults: false, showDiscover: false };

describe('SearchPage', () => {
  it('always renders the header part of the page', () => {
    usePresenterMock.mockReturnValue(presenter);
    const { container } = render(<SearchPage />);

    expect(container.textContent).toBe('ShowReelHeroSearchBarPopularToday');
  });

  it('renders the results with their toolbar', () => {
    usePresenterMock.mockReturnValue({ ...presenter, hasResults: true });
    render(<SearchPage />);

    for (const part of ['GenreChips', 'SortSelect', 'ShowList', 'Pagination']) {
      expect(screen.getByText(part)).toBeTruthy();
    }
    expect(screen.queryByText('Discover')).toBeNull();
  });

  it('renders the discovery rows and a message', () => {
    usePresenterMock.mockReturnValue({ ...presenter, message: 'No shows found', showDiscover: true });
    render(<SearchPage />);

    expect(screen.getByText('No shows found')).toBeTruthy();
    expect(screen.getByText('Discover')).toBeTruthy();
    expect(screen.queryByText('ShowList')).toBeNull();
  });
});
