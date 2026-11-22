import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from './request';

const fetchMock = vi.fn<typeof fetch>();

describe('request', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a GET by default and returns the JSON body', async () => {
    const signal = new AbortController().signal;
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ status: 'ok' })));

    const body = await request('/api/health', { signal });

    expect(fetchMock).toHaveBeenCalledWith('/api/health', { method: 'GET', signal });
    expect(body).toEqual({ status: 'ok' });
  });

  it('sends the given method and returns nothing for 204', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    const body = await request('/api/favorites/1', { method: 'DELETE' });

    expect(fetchMock).toHaveBeenCalledWith('/api/favorites/1', { method: 'DELETE', signal: undefined });
    expect(body).toBeUndefined();
  });

  it('throws the error message sent by the server', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ error: 'Show 9 was not found' }), { status: 404 }));

    await expect(request('/api/favorites/9', { method: 'PUT' })).rejects.toThrow('Show 9 was not found');
  });

  it('throws the status when the error has no message', async () => {
    fetchMock.mockResolvedValue(new Response('Bad gateway', { status: 502 }));

    await expect(request('/api/favorites')).rejects.toThrow('API error: 502');
  });
});
