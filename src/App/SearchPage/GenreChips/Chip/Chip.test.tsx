import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders a toggle button reflecting the active state', () => {
    render(<Chip label="Drama" isActive onClick={() => {}} />);

    expect(screen.getByRole('button', { name: 'Drama' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('is not pressed when inactive', () => {
    render(<Chip label="Drama" isActive={false} onClick={() => {}} />);

    expect(screen.getByRole('button', { name: 'Drama' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Chip label="Drama" isActive={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Drama' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
