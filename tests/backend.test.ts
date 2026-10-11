import { afterEach, describe, expect, it, vi } from 'vitest';
import { readSchool } from '../src/lib/backend';
afterEach((): typeof vi => vi.unstubAllGlobals());

describe('controlled school backend client', (): void => {
  it('uses a fixed ingress endpoint, validated current host, and no shared cache', async (): Promise<void> => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ name: 'North School' })));
    vi.stubGlobal('fetch', fetch);
    expect(await readSchool('north.localhost:8443', fetch)).toEqual({ name: 'North School' });
    expect(fetch).toHaveBeenCalledWith(new URL('/api/public/school/', 'https://127.0.0.1:8443'), expect.objectContaining({ cache: 'no-store', redirect: 'error', headers: { Host: 'north.localhost:8443', Accept: 'application/json' } }));
  });
  it.each(['', 'https://evil.test', 'north.localhost,evil.test', 'platform.localhost', 'evil.test', 'north.localhost:abc'])('rejects invalid or platform authority %s', async (host: string): Promise<void> => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    expect(await readSchool(host, fetch)).toBeNull(); expect(fetch).not.toHaveBeenCalled();
  });
  it.each([404, 403, 503])('handles unavailable backend status %s', async (status: number): Promise<void> => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status })));
    expect(await readSchool('north.localhost', globalThis.fetch)).toBeNull();
  });
  it('fails closed when the backend is unreachable', async (): Promise<void> => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('synthetic failure')));
    expect(await readSchool('north.localhost', globalThis.fetch)).toBeNull();
  });
  it('rejects malformed public payloads', async (): Promise<void> => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ schema: 'private' }))));
    expect(await readSchool('north.localhost', globalThis.fetch)).toBeNull();
  });
});
