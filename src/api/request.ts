/**
 * Our backend (see `server/`). Locally it is empty: the client calls /api/... and Vite proxies it to the
 * local server; the production build gets the server address from `VITE_API_URL`.
 */
const API_URL = import.meta.env.VITE_API_URL ?? '';

interface RequestOptions {
  method?: 'GET' | 'PUT' | 'DELETE';
  signal?: AbortSignal;
}

/** Calls the backend and returns the JSON body; throws with the server's error message on failure. */
export const request = async <T>(path: string, { method = 'GET', signal }: RequestOptions = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, { method, signal });

  if (!response.ok) {
    const body: { error?: string } = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `API error: ${response.status}`);
  }

  // 204 No Content (e.g. after DELETE) has no body
  const data = response.status === 204 ? undefined : await response.json();

  return data as T;
};
