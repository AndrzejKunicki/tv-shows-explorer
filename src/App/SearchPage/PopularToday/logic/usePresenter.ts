import { useEffect } from 'react';
import { selectPopularToday } from '@src/store/discover/selectors';
import { useAppSelector } from '@src/store/hooks';
import { selectStatus } from '@src/store/shows/selectors';
import { loadAiringToday } from '@src/tasks/loadAiringToday';
import { pickSuggestion } from './tasks/pickSuggestion';

export const usePresenter = () => {
  const names = useAppSelector(selectPopularToday);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    loadAiringToday();
  }, []);

  // One click fills the search field and starts the search
  const handleSelect = (name: string) => {
    pickSuggestion(name);
  };
  const isVisible = status === 'idle' && names.length > 0;

  return { names, isVisible, handleSelect };
};
