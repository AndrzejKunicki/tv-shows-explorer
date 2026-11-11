import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { fetchIndex } from '@src/store/discover/discoverSlice';
import { selectReelRows } from '@src/store/discover/reelSelectors';
import { selectStatus } from '@src/store/shows/selectors';

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const rows = useAppSelector(selectReelRows);
  const searchStatus = useAppSelector(selectStatus);
  // Tracked by URL: every poster appears twice in its track and both copies should appear together
  const [loadedUrls, setLoadedUrls] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    dispatch(fetchIndex());
  }, [dispatch]);

  const handleImageLoad = (imageUrl: string) => {
    setLoadedUrls((urls) => (urls.has(imageUrl) ? urls : new Set(urls).add(imageUrl)));
  };

  // Until its image loads, a screen stays a black film frame
  const screenRows = rows.map((row) => ({
    id: row.id,
    posters: row.posters.map((poster) => ({ ...poster, isLoaded: loadedUrls.has(poster.imageUrl) })),
  }));
  const hasRows = rows.length > 0;
  // The wall is shown only on the start page and fades out once a search begins
  const isHidden = searchStatus !== 'idle';

  return { rows: screenRows, hasRows, isHidden, handleImageLoad };
};
