import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Without Vitest globals Testing Library cannot unmount rendered trees by itself
afterEach(() => {
  cleanup();
});
