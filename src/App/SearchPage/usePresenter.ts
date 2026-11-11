import { useAppSelector } from '../../store/hooks';
import { selectError, selectItems, selectQuery, selectStatus } from '../../store/shows/selectors';
import type { SearchStatus } from '../../store/shows/showsSlice';

const getMessage = (status: SearchStatus, query: string, count: number, error: string | null) => {
  if (status === 'loading') return 'Searching…';
  if (status === 'failed') return `Something went wrong: ${error}`;
  if (status === 'succeeded' && count === 0) return `No shows found for "${query}".`;
  return null;
};

export const usePresenter = () => {
  const status = useAppSelector(selectStatus);
  const query = useAppSelector(selectQuery);
  const error = useAppSelector(selectError);
  const items = useAppSelector(selectItems);

  return {
    message: getMessage(status, query, items.length, error),
    isError: status === 'failed',
    hasResults: status === 'succeeded' && items.length > 0,
  };
};
