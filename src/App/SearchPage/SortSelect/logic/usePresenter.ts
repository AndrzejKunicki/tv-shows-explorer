import type { ChangeEvent } from 'react';
import type { SortBy } from '@src/api/types';
import { useAppSelector } from '@src/store/hooks';
import { selectSortBy } from '@src/store/shows/selectors';
import { changeSort } from './tasks/changeSort';

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'rating', label: 'Highest rated' },
];

const isSortBy = (value: string): value is SortBy => SORT_OPTIONS.some((option) => option.value === value);

export const usePresenter = () => {
  const value = useAppSelector(selectSortBy);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isSortBy(event.target.value)) {
      changeSort(event.target.value);
    }
  };

  return { value, options: SORT_OPTIONS, handleChange };
};
