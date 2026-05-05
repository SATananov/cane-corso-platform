
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

const title = 'Next.js rendering/data/cache architecture QA';

hasFile('docs/architecture/nextjs-rendering-data-cache-map.md');
hasFile('docs/qa/milestone4-nextjs-rendering-data-cache-audit.md');
hasContent('package.json', 'nextjs:rendering-cache:qa', 'Package script nextjs:rendering-cache:qa exists');
hasContent('docs/architecture/nextjs-rendering-data-cache-map.md', 'SSR means **Server-Side Rendering**', 'Architecture map explicitly defines SSR');
hasContent('docs/architecture/nextjs-rendering-data-cache-map.md', 'Server Components', 'Architecture map documents Server Components');
hasContent('docs/architecture/nextjs-rendering-data-cache-map.md', 'Client Components', 'Architecture map documents Client Components');
hasContent('docs/architecture/nextjs-rendering-data-cache-map.md', 'Route Handlers', 'Architecture map documents Route Handlers');
hasContent('docs/architecture/nextjs-rendering-data-cache-map.md', 'Cache boundary rules', 'Architecture map documents cache boundary rules');
hasContent('apps/web/app/(public)/registry/page.tsx', "export const dynamic = 'force-dynamic'", 'Registry page explicitly dynamic');
hasContent('apps/web/app/api/dogs/route.ts', "export const dynamic = 'force-dynamic'", 'Dogs API explicitly dynamic');
hasContent('apps/web/app/api/verify/[code]/route.ts', "export const dynamic = 'force-dynamic'", 'Verify API explicitly dynamic');
hasContent('apps/web/components/my-dog-form-workspace.tsx', "'use client'", 'Owner form workspace is a Client Component');
hasContent('apps/web/components/verify-entry-panel.tsx', '"use client"', 'Verify entry panel is a Client Component');
hasContent('apps/web/app/(admin)/review/actions.ts', "'use server'", 'Admin review mutations use server actions');

finish(title);
