import { showsStore } from '@src/store/shows/showsStore';
import { loadResults } from '@src/tasks/loadResults';
import { changeSort } from './changeSort';

vi.mock('@src/tasks/loadResults', () => ({ loadResults: vi.fn().mockResolvedValue({ error: null }) }));
vi.mock('@src/store/shows/showsStore', () => ({ showsStore: { setSort: vi.fn() } }));

describe('changeSort', () => {
  it('stores the sort order and loads the results sorted that way', async () => {
    const result = await changeSort('rating');

    expect(result).toEqual({ error: null });
    expect(showsStore.setSort).toHaveBeenCalledWith('rating');
    expect(loadResults).toHaveBeenCalledTimes(1);
  });
});
