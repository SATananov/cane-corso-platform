
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
let failures = 0;

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function check(condition, message) {
  if (condition) {
    console.log(`PASS ${message}`);
    return;
  }
  failures += 1;
  console.error(`FAIL ${message}`);
}

function hasFile(relativePath, message = `${relativePath} exists`) {
  check(fs.existsSync(path.join(root, relativePath)), message);
}

function hasContent(relativePath, needle, message) {
  check(read(relativePath).includes(needle), message);
}

function finish(title) {
  if (failures > 0) {
    console.error(`\n${title} failed with ${failures} issue(s).`);
    process.exit(1);
  }
  console.log(`\n${title} complete.`);
}

const title = 'Production readiness cleanup QA';

hasFile('docs/architecture/production-readiness-final-checklist.md');
hasFile('docs/qa/milestone6-neon-production-readiness-cleanup.md');
hasContent('package.json', 'production:readiness:qa', 'Package script production:readiness:qa exists');
hasContent('docs/architecture/production-readiness-final-checklist.md', 'DATABASE_URL_DIRECT', 'Production checklist includes direct migration URL');
hasContent('docs/architecture/production-readiness-final-checklist.md', 'AUTH_SECRET', 'Production checklist includes AUTH_SECRET');
hasContent('docs/architecture/production-readiness-final-checklist.md', 'sslmode=verify-full', 'Production checklist recommends verify-full SSL mode');
hasContent('docs/qa/milestone6-neon-production-readiness-cleanup.md', 'sslmode=verify-full', 'Milestone doc records PostgreSQL SSL warning guidance');
hasContent('packages/db/scripts/migrate.mjs', 'DATABASE_URL_DIRECT', 'Migration script still prefers direct URL');
hasContent('packages/db/src/client.ts', 'process.env.DATABASE_URL', 'Runtime DB client still uses DATABASE_URL');
hasContent('apps/web/lib/runtime-env.ts', 'AUTH_SECRET', 'Runtime auth secret contract still exists');
hasContent('apps/web/lib/runtime-env.ts', 'isProductionRuntime()', 'Production secret guard still exists');
hasContent('docs/architecture/auth-session-jwt-contract.md', 'Never hardcode', 'Auth/session JWT contract remains available');

finish(title);
