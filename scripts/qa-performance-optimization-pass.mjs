
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

const title = 'Performance optimization pass QA';

hasFile('docs/architecture/performance-optimization-pass.md');
hasFile('docs/qa/milestone5-performance-optimization-pass.md');
hasContent('package.json', 'performance:optimization:qa', 'Package script performance:optimization:qa exists');
hasContent('docs/architecture/performance-optimization-pass.md', 'Lazy-load non-critical images', 'Performance doc records lazy image policy');
hasContent('docs/architecture/performance-optimization-pass.md', 'Avoid unnecessary new client components', 'Performance doc records client-component budget');
hasContent('apps/web/components/partner-directory-overview.tsx', 'loading="lazy"', 'Partner listing logo images lazy-load');
hasContent('apps/web/components/partner-profile-detail.tsx', 'loading="lazy"', 'Partner detail logo image lazy-loads');
hasContent('apps/web/components/pedigree-tree.tsx', 'loading="lazy"', 'Pedigree imagery lazy-loads');
hasContent('apps/web/components/knowledge-article-directory.tsx', 'loading="lazy"', 'Knowledge directory seal lazy-loads');
hasContent('apps/web/components/public-registry-overview.tsx', 'loading="lazy"', 'Registry decorative seals lazy-load');
hasContent('docs/architecture/nextjs-rendering-data-cache-map.md', 'Client Components are used only where browser interactivity is required', 'Rendering map records limited client islands');

finish(title);
