import type { AddressInfo } from 'node:net';
import { createApp } from './app.ts';

/** Starts the app on a free port, calls `path` and stops the server again. */
export const request = async (path: string, init?: RequestInit) => {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;

  try {
    const response = await fetch(`http://localhost:${port}${path}`, init);
    // 204 has no body
    const text = await response.text();
    const body = text ? JSON.parse(text) : null;

    return { status: response.status, headers: response.headers, body };
  } finally {
    server.close();
  }
};
