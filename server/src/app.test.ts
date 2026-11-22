import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAiringToday } from '#src/tasks/getAiringToday.ts';
import { request } from '#src/testServer.ts';

vi.mock('#src/tasks/getAiringToday.ts', () => ({ getAiringToday: vi.fn() }));

describe('app', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('answers the health check', async () => {
    const response = await request('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('turns a failed TVmaze request into a 502 with the message', async () => {
    vi.mocked(getAiringToday).mockRejectedValueOnce(new Error('TVmaze API error: 503'));

    const response = await request('/api/discover/airing-today');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'TVmaze API error: 503' });
  });

  it('allows any origin locally and only CORS_ORIGIN in production', async () => {
    const headers = { Origin: 'https://example.com' };

    const local = await request('/api/health', { headers });
    vi.stubEnv('CORS_ORIGIN', 'https://andrzejkunicki.github.io');
    const production = await request('/api/health', { headers });

    expect(local.headers.get('access-control-allow-origin')).toBe('https://example.com');
    expect(production.headers.get('access-control-allow-origin')).toBe('https://andrzejkunicki.github.io');
  });
});
