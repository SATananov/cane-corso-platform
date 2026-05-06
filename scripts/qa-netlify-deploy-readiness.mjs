import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pass = (message) => console.log(`PASS ${message}`);
const fail = (message) => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

console.log('--- Netlify deploy readiness QA ---');

if (exists('netlify.toml')) {
  pass('Root netlify.toml exists');
  const netlifyToml = read('netlify.toml');
  if (/command\s*=\s*"pnpm --filter @cane-corso-platform\/web build"/.test(netlifyToml)) {
    pass('Netlify build command targets the web workspace');
  } else {
    fail('Netlify build command must target @cane-corso-platform/web');
  }
  if (/publish\s*=\s*"apps\/web\/\.next"/.test(netlifyToml)) {
    pass('Netlify publish directory points to apps/web/.next');
  } else {
    fail('Netlify publish directory must be apps/web/.next');
  }
  if (/NODE_VERSION\s*=\s*"22"/.test(netlifyToml)) {
    pass('Netlify Node version is pinned to 22');
  } else {
    fail('Netlify Node version should be pinned to 22');
  }
  if (/PNPM_FLAGS\s*=\s*"--shamefully-hoist"/.test(netlifyToml)) {
    pass('Netlify pnpm install flag is set for Next.js/pnpm compatibility');
  } else {
    fail('Netlify PNPM_FLAGS should be set to --shamefully-hoist');
  }
} else {
  fail('Root netlify.toml is missing');
}

if (exists('package.json')) {
  const pkg = JSON.parse(read('package.json'));
  if (pkg.packageManager === 'pnpm@10.0.0') {
    pass('Root packageManager pins pnpm@10.0.0');
  } else {
    fail('Root packageManager must pin pnpm@10.0.0');
  }
  if (pkg.scripts?.['deploy:netlify:qa'] === 'node scripts/qa-netlify-deploy-readiness.mjs') {
    pass('Package script deploy:netlify:qa exists');
  } else {
    fail('Package script deploy:netlify:qa is missing');
  }
} else {
  fail('Root package.json is missing');
}

if (exists('pnpm-lock.yaml')) {
  pass('pnpm-lock.yaml exists for Netlify pnpm detection');
} else {
  fail('pnpm-lock.yaml is missing');
}

if (exists('apps/web/package.json')) {
  const webPkg = JSON.parse(read('apps/web/package.json'));
  if (webPkg.scripts?.build === 'next build') {
    pass('Web workspace build script is next build');
  } else {
    fail('apps/web build script must be next build');
  }
  if (webPkg.dependencies?.next) {
    pass(`Web workspace declares Next.js dependency ${webPkg.dependencies.next}`);
  } else {
    fail('apps/web must declare next dependency');
  }
} else {
  fail('apps/web/package.json is missing');
}

if (exists('apps/web/next.config.ts')) {
  const nextConfig = read('apps/web/next.config.ts');
  if (/outputFileTracingRoot/.test(nextConfig)) {
    pass('Next config pins outputFileTracingRoot for monorepo packaging');
  } else {
    fail('Next config should include outputFileTracingRoot for monorepo packaging');
  }
  if (!/output\s*:\s*['"]export['"]/.test(nextConfig)) {
    pass('Next config is not static export-only; SSR/API routes remain deployable');
  } else {
    fail('Next config must not use output: export for SSR/API deployment');
  }
} else {
  fail('apps/web/next.config.ts is missing');
}

if (exists('.env.example')) {
  const env = read('.env.example');
  for (const key of ['DATABASE_URL', 'DATABASE_URL_DIRECT', 'DATABASE_EXPECTED_NAME', 'AUTH_SECRET', 'SESSION_COOKIE_NAME', 'NEXT_PUBLIC_APP_URL']) {
    if (env.includes(`${key}=`)) {
      pass(`.env.example documents ${key}`);
    } else {
      fail(`.env.example must document ${key}`);
    }
  }
} else {
  fail('.env.example is missing');
}

if (exists('docs/deploy/netlify-deployment-guide.md')) {
  pass('Netlify deployment guide exists');
  const deployGuide = read('docs/deploy/netlify-deployment-guide.md');
  if (deployGuide.includes('/api/health/db') && deployGuide.includes('DATABASE_EXPECTED_NAME=cane_corso_platform')) {
    pass('Netlify deployment guide documents the runtime DB target guardrail');
  } else {
    fail('Netlify deployment guide must document /api/health/db and DATABASE_EXPECTED_NAME');
  }
} else {
  fail('Netlify deployment guide is missing');
}

if (process.exitCode) {
  console.error('\nNetlify deploy readiness QA failed.');
  process.exit(process.exitCode);
}

console.log('\nNetlify deploy readiness QA complete.');
