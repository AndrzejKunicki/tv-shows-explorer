import { showsStore } from '@src/store/shows/showsStore';
import { findShowsDebounced } from '@src/tasks/findShowsDebounced';
import { typeQuery } from './typeQuery';

vi.mock('@src/store/shows/showsStore', () => ({ showsStore: { setDraft: vi.fn() } }));
vi.mock('@src/tasks/findShowsDebounced', () => ({ findShowsDebounced: vi.fn() }));

describe('typeQuery', () => {
  it('stores the typed text and searches for it after the debounce', () => {
    typeQuery('lost');

    expect(showsStore.setDraft).toHaveBeenCalledWith('lost');
    expect(findShowsDebounced).toHaveBeenCalledWith('lost');
  });
});
