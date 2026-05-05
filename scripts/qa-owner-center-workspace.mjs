import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'apps/web/app/(member)/ecosystem/page.tsx',
  'apps/web/components/owner-center-workspace.tsx',
  'apps/web/components/ecosystem-owner-workspace.tsx',
  'apps/web/lib/owner-center.server.ts',
  'docs/qa/step10-owner-center-workspace.md',
  'docs/qa/step10-1-owner-center-i18n-polish.md',
  'docs/qa/step10-2-ecosystem-submission-form-ux.md',
];

const forbiddenRouteFiles = [
  'apps/web/app/(public)/registry/page.tsx',
  'apps/web/app/(public)/registry/[slug]/page.tsx',
  'apps/web/app/(public)/gallery/page.tsx',
  'apps/web/app/certificate/[code]/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/verify/[code]/page.tsx',
  'apps/web/app/(admin)/review/page.tsx',
  'apps/web/app/(admin)/admin/partners/page.tsx',
  'apps/web/app/(admin)/admin/ecosystem/page.tsx',
];

const pageSource = readFileSync('apps/web/app/(member)/ecosystem/page.tsx', 'utf8');
const componentSource = readFileSync('apps/web/components/owner-center-workspace.tsx', 'utf8');
const ecosystemWorkspaceSource = readFileSync('apps/web/components/ecosystem-owner-workspace.tsx', 'utf8');
const serverSource = readFileSync('apps/web/lib/owner-center.server.ts', 'utf8');
const cssSource = readFileSync('apps/web/app/globals.css', 'utf8');

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing Step 10 file: ${file}`);
  }
}

for (const file of forbiddenRouteFiles) {
  if (!existsSync(file)) {
    throw new Error(`Locked route file is unexpectedly missing: ${file}`);
  }
}

const bgMixedCopyFragments = [
  'Owner Center управление',
  'Member ecosystem workspace',
  'owner identity',
  'Owner профили',
  'Ecosystem submissions',
  'Личен owner слой',
  'review flow-а',
  'Owner workspace е чист',
  'owner identity чиста',
  'member пространство',
];

const assertions = [
  ['ecosystem page renders OwnerCenterWorkspace', pageSource.includes('<OwnerCenterWorkspace document={document} locale={locale} />')],
  ['ecosystem page preserves EcosystemOwnerWorkspace', pageSource.includes('<EcosystemOwnerWorkspace document={document.ecosystem} locale={locale} />')],
  ['owner center server aggregates member dogs', serverSource.includes('listMemberDogs({ allowDevFallback: false })')],
  ['owner center server aggregates ecosystem workspace', serverSource.includes('getCurrentOwnerEcosystemDocument({ allowDevFallback: false })')],
  ['owner center component links only member-safe routes', componentSource.includes("href: '/my-dogs'") && componentSource.includes("href: '/partners/apply'")],
  ['owner center CSS is scoped', cssSource.includes('Step 10 — Owner Center / Member Ecosystem Workspace') && cssSource.includes('.owner-center-stack')],
  ['Bulgarian page copy uses polished owner center wording', pageSource.includes('Център на собственика') && pageSource.includes('Лично Cane Corso пространство')],
  ['Bulgarian component copy uses polished member wording', componentSource.includes('Работното пространство е подредено') && componentSource.includes('Профил на собственика')],
  ['owner role is localized in the member identity card', componentSource.includes('formatRole(document.member.role, locale)') && componentSource.includes("admin: 'Администратор'")],
  ['old mixed Bulgarian owner-center fragments removed', bgMixedCopyFragments.every((fragment) => !pageSource.includes(fragment) && !componentSource.includes(fragment) && !ecosystemWorkspaceSource.includes(fragment))],
  ['ecosystem submission form uses premium grouped layout', ecosystemWorkspaceSource.includes('ecosystem-owner-submission-form') && ecosystemWorkspaceSource.includes('ecosystem-form-card--flow') && ecosystemWorkspaceSource.includes('ecosystem-form-card__fields--three')],
  ['ecosystem submission copy has Bulgarian section headings', ecosystemWorkspaceSource.includes('Основна идентичност') && ecosystemWorkspaceSource.includes('Контакт за връзка') && ecosystemWorkspaceSource.includes('Локация и обхват') && ecosystemWorkspaceSource.includes('Условия и уточнения')],
  ['ecosystem submission form removed old flat grid wrapper', !ecosystemWorkspaceSource.includes('ecosystem-form-grid ecosystem-form-grid--owner')],
  ['ecosystem submission CSS is scoped', cssSource.includes('Step 10.2 — Owner Center ecosystem submission form UX polish') && cssSource.includes('.ecosystem-owner-submission-form') && cssSource.includes('.ecosystem-form-card__fields--three')],
  ['old review-flow wording removed from ecosystem submission copy', !ecosystemWorkspaceSource.includes('review flow')],
];

for (const [label, passed] of assertions) {
  if (!passed) {
    throw new Error(`Owner Center QA failed: ${label}`);
  }

  console.log(`PASS ${label}`);
}

console.log('Owner Center workspace QA complete.');
