import { useEffect } from 'react';
import { fetchGems, fetchIndex, fetchTodaySchedule } from '@src/store/discover/discoverSlice';
import { pickGemPages } from '@src/store/discover/pickGemPages';
import { selectAiringToday, selectFanFavorites, selectHiddenGems } from '@src/store/discover/selectors';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const airingToday = useAppSelector(selectAiringToday);
  const fanFavorites = useAppSelector(selectFanFavorites);
  const hiddenGems = useAppSelector(selectHiddenGems);

  useEffect(() => {
    dispatch(fetchTodaySchedule());
    dispatch(fetchIndex());
    // Different pages on every visit, so there are new gems to find each time
    dispatch(fetchGems(pickGemPages()));
  }, [dispatch]);

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
