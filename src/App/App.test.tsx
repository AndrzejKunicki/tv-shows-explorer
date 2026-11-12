import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('./SearchPage/SearchPage', () => ({ SearchPage: () => <p>search page</p> }));

describe('App', () => {
  it('renders the search page inside the main landmark', () => {
    render(<App />);

    expect(screen.getByRole('main').textContent).toBe('search page');
  });
});
