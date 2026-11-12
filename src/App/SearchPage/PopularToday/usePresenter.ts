import { useEffect } from 'react';
import { fetchTodaySchedule } from '@src/store/discover/discoverSlice';
import { selectPopularToday } from '@src/store/discover/selectors';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { selectStatus } from '@src/store/shows/selectors';
import { draftChanged } from '@src/store/shows/showsSlice';

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const names = useAppSelector(selectPopularToday);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchTodaySchedule());
  }, [dispatch]);

  // One click fills the search field, which starts the search
  const handleSelect = (name: string) => dispatch(draftChanged(name));
  const isVisible = status === 'idle' && names.length > 0;

  return { names, isVisible, handleSelect };
};
