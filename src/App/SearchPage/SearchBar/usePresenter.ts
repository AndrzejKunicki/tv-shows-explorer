import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectStatus } from '../../../store/shows/selectors';
import { fetchShows, searchCleared } from '../../../store/shows/showsSlice';

type FetchRequest = ReturnType<ReturnType<typeof fetchShows>>;

export const usePresenter = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const [value, setValue] = useState('');
  const lastRequest = useRef<FetchRequest | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    lastRequest.current?.abort();
    const query = value.trim();

    if (!query) {
      lastRequest.current = null;
      dispatch(searchCleared());
      return;
    }
    lastRequest.current = dispatch(fetchShows(query));
  };

  return { value, isLoading: status === 'loading', handleChange, handleSubmit };
};
