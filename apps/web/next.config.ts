import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '../..');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: workspaceRoot,
  transpilePackages: [
    '@cane-corso-platform/auth',
    '@cane-corso-platform/contracts',
    '@cane-corso-platform/db',
    '@cane-corso-platform/storage',
    '@cane-corso-platform/ui',
  ],
};

export default nextConfig;
