#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`Missing file: ${relativePath}`);
    return '';
  }
  return readFileSync(absolutePath, 'utf8');
}

function expect(description, passed, detail = '') {
  checks.push({ description, passed, detail });
  if (!passed) {
    failures.push(`${description}${detail ? ` — ${detail}` : ''}`);
  }
}

function expectIncludes(source, relativePath, expected, description) {
  expect(description, source.includes(expected), `${relativePath} -> ${expected}`);
}

function expectAllIncludes(source, relativePath, expectedValues, description) {
  const missing = expectedValues.filter((value) => !source.includes(value));
  expect(description, missing.length === 0, missing.length ? `${relativePath} missing ${missing.join(', ')}` : relativePath);
}

function expectNotIncludes(source, relativePath, forbidden, description) {
  expect(description, !source.includes(forbidden), `${relativePath} must not include ${forbidden}`);
}

function countOccurrences(source, pattern) {
  return source.split(pattern).length - 1;
}

const packageJson = read('package.json');
const step21Doc = read('docs/qa/step21-public-ecosystem-detail-polish.md');
const directory = read('apps/web/components/ecosystem-directory.tsx');
const detail = read('apps/web/components/ecosystem-profile-detail.tsx');
const route = read('apps/web/app/(public)/community/[slug]/page.tsx');
const step20Qa = read('scripts/qa-ecosystem-public-detail-foundation.mjs');
const repository = read('packages/db/src/repositories/ecosystem.repository.ts');

expectIncludes(
  packageJson,
  'package.json',
  '"ecosystem:detail:polish:qa": "node scripts/qa-ecosystem-public-detail-polish.mjs"',
  'Root package exposes the Step 21 public detail polish QA command',
);

expectAllIncludes(
  step21Doc,
  'docs/qa/step21-public-ecosystem-detail-polish.md',
  [
    'Step 21 — Public Ecosystem Detail Polish & Safety Guardrails',
    '/community/[slug]',
    'status = published',
    'submissionChannel != community_suggestion',
    'cane-corso-platform_clean_after_step21_public_ecosystem_detail_polish.zip',
  ],
  'Step 21 QA document records scope, safety boundary, and clean checkpoint target',
);

expectAllIncludes(
  directory,
  'apps/web/components/ecosystem-directory.tsx',
  [
    'function getCommunityProfileHref(slug: string)',
    'encodeURIComponent(slug)',
    'href={getCommunityProfileHref(item.slug)}',
    'aria-label={`${copy.labels.openDetail}: ${item.title}`}',
  ],
  'Directory detail CTA uses encoded public profile hrefs and accessible labels',
);

expect(
  'Directory card renders the publication lane value once',
  countOccurrences(directory, '<dd>{channelLabels[item.submissionChannel]}</dd>') === 1,
  'apps/web/components/ecosystem-directory.tsx',
);

expectAllIncludes(
  detail,
  'apps/web/components/ecosystem-profile-detail.tsx',
  [
    'const categoryLabelsByLocale: Record<Locale, Record<string, string>>',
    'walk_play_place',
    'Място за разходка и игра',
    'transport_relocation',
    'Транспорт и преместване',
    'pet_friendly_place',
    'Място, подходящо за Cane Corso',
    'hotel_boarding',
    'Хотел и престой',
    'event_idea',
    'Идея за събитие',
    'categoryFor(listing, locale, copy.notSet)',
  ],
  'Detail page localizes ecosystem-specific category values',
);

expectAllIncludes(
  detail,
  'apps/web/components/ecosystem-profile-detail.tsx',
  [
    'aria-label={`${copy.visitWebsite}: ${listing.title}`}',
    'aria-label={`${copy.back}: /community`}',
    'Граница на публикуване',
  ],
  'Detail page CTAs and trust copy are polished without changing the release boundary',
);

expectNotIncludes(
  detail,
  'apps/web/components/ecosystem-profile-detail.tsx',
  'detail страница',
  'Bulgarian detail copy avoids mixed detail-page wording',
);

expectNotIncludes(
  route,
  'apps/web/app/(public)/community/[slug]/page.tsx',
  'detail страница',
  'Public detail route copy avoids mixed detail-page wording',
);

expectAllIncludes(
  step20Qa,
  'scripts/qa-ecosystem-public-detail-foundation.mjs',
  [
    'getCommunityProfileHref',
    'encodeURIComponent(slug)',
  ],
  'Step 20 detail QA remains aligned with the Step 21 encoded detail href helper',
);

expectAllIncludes(
  repository,
  'packages/db/src/repositories/ecosystem.repository.ts',
  [
    'getPublishedListingBySlug(slug: string)',
    "eq(ecosystemListings.status, 'published')",
    "ne(ecosystemListings.submissionChannel, 'community_suggestion')",
  ],
  'Repository still enforces the published-only non-suggestion public detail boundary',
);

for (const check of checks) {
  console.log(`${check.passed ? 'PASS' : 'FAIL'} ${check.description}${check.detail ? ` — ${check.detail}` : ''}`);
}

if (failures.length > 0) {
  console.error('\nEcosystem public detail polish QA failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('\nEcosystem public detail polish QA complete. Step 21 is ready for local verification.');
