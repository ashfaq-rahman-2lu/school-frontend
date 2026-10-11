import { request as httpsRequest } from 'node:https';
import type { IncomingMessage } from 'node:http';

function validSchoolHost(value: string): boolean {
  const base = process.env.SCHOOL_BASE_DOMAIN ?? 'localhost';
  const platform = process.env.PLATFORM_HOST ?? 'platform.localhost';
  const match = /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\.([a-z0-9.-]+)(?::([0-9]{1,5}))?$/i.exec(value);
  if (!match || match[2].toLowerCase() !== base || `${match[1]}.${match[2]}`.toLowerCase() === platform) return false;
  return !match[3] || (Number(match[3]) > 0 && Number(match[3]) <= 65535);
}

type Transport = (url: URL, options: RequestInit) => Promise<Response>;

// Node's HTTPS client preserves the virtual Host while connecting to a fixed
// ingress. The built-in fetch transport can replace Host with its URL authority.
const throughIngress: Transport = (url: URL, options: RequestInit): Promise<Response> => new Promise<Response>((resolve: (value: Response | PromiseLike<Response>) => void, reject: (reason?: unknown) => void): void => {
  if (url.protocol !== 'https:') return reject(new Error('HTTPS ingress required'));
  const request = httpsRequest(url, { headers: options.headers as Record<string, string>, signal: options.signal ?? undefined }, (response: IncomingMessage): void => {
    const chunks: Buffer[] = [];
    let size = 0;
    response.on('data', (chunk: Buffer): void => {
      size += chunk.length;
      if (size > 8192) request.destroy(new Error('Invalid public payload size'));
      else chunks.push(chunk);
    });
    response.on('error', reject);
    response.on('end', (): void => resolve(new Response(Buffer.concat(chunks).toString('utf8'), { status: response.statusCode ?? 503 })));
  });
  request.on('error', reject);
  request.end();
});

export async function readSchool(host: string, transport: Transport = throughIngress): Promise<{ name: string } | null> {
  if (!validSchoolHost(host)) return null;
  const origin = process.env.SCHOOL_API_ORIGIN ?? 'https://127.0.0.1:8443';
  try {
    const response = await transport(new URL('/api/public/school/', origin), {
      headers: { Host: host, Accept: 'application/json' }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const value: unknown = await response.json();
    if (typeof value !== 'object' || value === null || !('name' in value) || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 180) return null;
    return { name: value.name };
  } catch {
    return null;
  }
}
