
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

const title = 'Submission Q&A package QA';

hasFile('docs/submission/full-stack-nextjs-q-and-a.md');
hasFile('docs/submission/demo-script.md');
hasFile('docs/submission/technical-architecture-summary.md');
hasFile('docs/qa/milestone7-submission-q-and-a-package.md');
hasContent('package.json', 'submission:qna:qa', 'Package script submission:qna:qa exists');
hasContent('docs/submission/full-stack-nextjs-q-and-a.md', 'Full-Stack Apps with Next.js', 'Q&A names the course/module');
hasContent('docs/submission/full-stack-nextjs-q-and-a.md', 'SSR means Server-Side Rendering', 'Q&A explicitly defines SSR');
hasContent('docs/submission/full-stack-nextjs-q-and-a.md', 'Server Components', 'Q&A explains Server Components');
hasContent('docs/submission/full-stack-nextjs-q-and-a.md', 'Client Components', 'Q&A explains Client Components');
hasContent('docs/submission/full-stack-nextjs-q-and-a.md', 'Route Handlers', 'Q&A explains Route Handlers');
hasContent('docs/submission/full-stack-nextjs-q-and-a.md', 'caching', 'Q&A explains caching');
hasContent('docs/submission/demo-script.md', 'Member flow', 'Demo script includes member flow');
hasContent('docs/submission/demo-script.md', 'Admin moderation', 'Demo script includes admin moderation');
hasContent('docs/submission/demo-script.md', 'Certificate and Verify', 'Demo script includes certificate and Verify');
hasContent('docs/submission/technical-architecture-summary.md', 'Drizzle ORM', 'Architecture summary includes Drizzle ORM');
hasContent('docs/submission/technical-architecture-summary.md', 'Security and trust boundaries', 'Architecture summary includes security/trust boundaries');

finish(title);
