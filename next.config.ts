import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevents MIME-type sniffing (CVE-2006-3396)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Blocks the page from being embedded in iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Controls how much referrer info is sent with requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restricts access to browser features not used by the app
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const isProd = process.env.NODE_ENV === 'production';
const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    viewTransition: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  typescript: {
    tsconfigPath: isProd ? 'tsconfig.build.json' : 'tsconfig.json',
  },
  images: {
    remotePatterns: [
      // Add allowed image domains here, e.g.:
      // { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // Configure dev-only trusted origins via NEXT_ALLOWED_DEV_ORIGINS (comma-separated).
  allowedDevOrigins,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
