import { useAppSelector } from '@src/store/hooks';
import { selectError, selectItems, selectQuery, selectStatus } from '@src/store/shows/selectors';
import type { SearchStatus } from '@src/store/shows/showsSlice';

const getMessage = (status: SearchStatus, query: string, count: number, error: string | null) => {
  if (status === 'loading') {
    return 'Searching…';
  }
  if (status === 'failed') {
    return `Something went wrong: ${error}`;
  }
  if (status === 'succeeded' && count === 0) {
    return `No shows found for "${query}". Try another title, or pick something below.`;
  }

  return null;
};

export const usePresenter = () => {
  const status = useAppSelector(selectStatus);
  const query = useAppSelector(selectQuery);
  const error = useAppSelector(selectError);
  const items = useAppSelector(selectItems);

  const message = getMessage(status, query, items.length, error);
  const isError = status === 'failed';
  const hasResults = status === 'succeeded' && items.length > 0;
  // Discovery rows help on the start page and when a search finds nothing
  const showDiscover = status === 'idle' || (status === 'succeeded' && items.length === 0);

  return { message, isError, hasResults, showDiscover };
};
