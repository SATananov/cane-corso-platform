import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function listFiles(dir, predicate = () => true) {
  const absoluteDir = path.join(root, dir);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const result = [];
  const stack = [absoluteDir];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
      } else {
        const relativePath = path.relative(root, absolutePath).replace(/\\/g, '/');
        if (predicate(relativePath)) {
          result.push(relativePath);
        }
      }
    }
  }

  return result.sort();
}

function includesJsonDependency(relativePath, dependencyName) {
  const json = JSON.parse(read(relativePath));
  return Boolean(json.dependencies?.[dependencyName] ?? json.devDependencies?.[dependencyName]);
}

function assertCheck(name, passed, details) {
  if (!passed) {
    throw new Error(`${name}: ${details}`);
  }

  console.log(`PASS ${name} — ${details}`);
}

const apiRoutes = listFiles('apps/web/app/api', (file) => file.endsWith('/route.ts'));
const webPackage = exists('apps/web/package.json') ? JSON.parse(read('apps/web/package.json')) : {};
const mobilePackage = exists('apps/mobile/package.json') ? JSON.parse(read('apps/mobile/package.json')) : {};
const rootPackage = exists('package.json') ? JSON.parse(read('package.json')) : {};

assertCheck(
  'Monorepo architecture',
  exists('pnpm-workspace.yaml') && exists('turbo.json') && exists('apps/web') && exists('apps/mobile') && exists('packages/db'),
  'pnpm workspace, Turbo, apps/* and packages/* are present',
);

assertCheck(
  'Next.js + React web app',
  Boolean(webPackage.dependencies?.next && webPackage.dependencies?.react && exists('apps/web/app/layout.tsx')),
  'apps/web uses Next.js App Router with React',
);

assertCheck(
  'Tailwind web client',
  exists('apps/web/tailwind.config.ts') && exists('apps/web/app/globals.css'),
  'Tailwind config and global styles are present in the web app',
);

assertCheck(
  'Next.js back-end API',
  apiRoutes.length >= 5,
  `${apiRoutes.length} API route handlers found under apps/web/app/api`,
);

assertCheck(
  'Drizzle ORM database layer',
  exists('drizzle.config.ts') && exists('packages/db/src/schema/index.ts') && includesJsonDependency('packages/db/package.json', 'drizzle-orm'),
  'Drizzle config, schema package, and drizzle-orm dependency are present',
);

const envExample = read('.env.example');
const dbClient = read('packages/db/src/client.ts');
assertCheck(
  'Neon DB readiness',
  envExample.includes('DATABASE_PROVIDER=neon') && envExample.includes('neon.tech') && dbClient.includes('DATABASE_PROVIDER') && dbClient.includes('DATABASE_SSL'),
  'DATABASE_URL supports Neon PostgreSQL URLs with provider-aware SSL handling',
);

assertCheck(
  'Expo React Native mobile client',
  Boolean(mobilePackage.dependencies?.expo && mobilePackage.dependencies?.['react-native'] && exists('apps/mobile/App.tsx')),
  'apps/mobile uses Expo and React Native',
);

assertCheck(
  'Shared TypeScript packages',
  exists('packages/contracts/src') && exists('packages/auth/src') && exists('packages/storage/src') && exists('tsconfig.base.json'),
  'contracts/auth/storage/db packages share the app contract',
);

assertCheck(
  'Root workflow scripts',
  Boolean(rootPackage.scripts?.dev && rootPackage.scripts?.['db:migrate'] && rootPackage.scripts?.['db:bootstrap']),
  'root package exposes dev and database bootstrap scripts',
);

console.log('\nFull-stack requirements QA complete.');
