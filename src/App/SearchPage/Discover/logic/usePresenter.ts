import { useEffect } from 'react';
import { selectAiringToday, selectFanFavorites, selectHiddenGems } from '@src/store/discover/selectors';
import { useAppSelector } from '@src/store/hooks';
import { loadAiringToday } from '@src/tasks/loadAiringToday';
import { loadTopRated } from '@src/tasks/loadTopRated';
import { loadHiddenGems } from './tasks/loadHiddenGems';

export const usePresenter = () => {
  const airingToday = useAppSelector(selectAiringToday);
  const fanFavorites = useAppSelector(selectFanFavorites);
  const hiddenGems = useAppSelector(selectHiddenGems);

  useEffect(() => {
    loadAiringToday();
    loadTopRated();
    loadHiddenGems();
  }, []);

  // A row without data (still loading or failed) is not shown
  const rows = [
    { id: 'airing-today', title: 'Airing today', subtitle: 'New episodes on US TV today', shows: airingToday },
    {
      id: 'fan-favorites',
      title: 'Fan favorites',
      subtitle: 'The highest rated shows on TVmaze',
      shows: fanFavorites,
    },
    {
      id: 'hidden-gems',
      title: 'Hidden gems',
      subtitle: 'Rated 7.8+ by viewers, yet flying under the radar',
      shows: hiddenGems,
    },
  ].filter((row) => row.shows.length > 0);
  const hasRows = rows.length > 0;

  return { rows, hasRows };
};
