import { render, screen } from '@testing-library/react';
import { App } from './App';

vi.mock('./SearchPage/SearchPage', () => ({ SearchPage: () => <p>search page</p> }));
vi.mock('./Toaster/Toaster', () => ({ Toaster: () => <div>toaster</div> }));

describe('App', () => {
  it('renders the search page inside the main landmark', () => {
    render(<App />);

    expect(screen.getByRole('main').textContent).toBe('search page');
  });

  it('renders the toaster outside the main landmark', () => {
    render(<App />);

    expect(screen.getByText('toaster').closest('main')).toBeNull();
  });
});
