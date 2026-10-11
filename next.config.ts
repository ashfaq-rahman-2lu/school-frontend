import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  async headers() { return [{ source: '/:path*', headers: [{ key: 'Cache-Control', value: 'private, no-store' }] }]; },
};
export default config;
