#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let failed = false;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed = true; console.error(`FAIL ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }
const workspace = read('apps/web/components/my-dog-form-workspace.tsx');
const form = read('apps/web/components/dog-profile-form.tsx');
const happyPath = read('apps/web/components/owner-submission-happy-path-panel.tsx');
const newPage = read('apps/web/app/(member)/my-dogs/new/page.tsx');
const editPage = read('apps/web/app/(member)/my-dogs/[dogId]/edit/page.tsx');
const css = read('apps/web/app/globals.css');
const i18n = read('apps/web/lib/i18n.ts');
const pkg = JSON.parse(read('package.json'));
assert(workspace.includes('dog-form-layout--form-first'), 'Form workspace uses form-first layout class');
assert(workspace.indexOf('<DogProfileForm') < workspace.indexOf('<OwnerSubmissionHappyPathPanel'), 'Dog form appears before owner checklist');
assert(form.indexOf('<FormSectionCard') < form.indexOf('validation-banner-row'), 'Form sections appear before validation/status helper panels');
assert(form.includes('dog-form-secondary-panels'), 'Secondary helper panels are grouped after the main form');
assert(newPage.includes('route-hero-card--form-first'), 'New Cane Corso page uses compact form-first hero');
assert(editPage.includes('route-hero-card--form-first'), 'Edit Cane Corso page uses compact form-first hero');
assert(css.includes('Step 85 — Add Cane Corso form-first UX reorder START'), 'Step 85 CSS block exists');
assert(css.includes('.dog-form-layout--form-first .preview-certificate-card'), 'Form-first preview hides secondary certificate block in sidebar');
assert(pkg.scripts['owner:form-first-ux:qa'] === 'node scripts/qa-owner-form-first-ux.mjs', 'Package script owner:form-first-ux:qa exists');
const bgSliceStart = happyPath.indexOf('  bg: {');
const bgSliceEnd = happyPath.indexOf('  it: {', bgSliceStart);
const bgSlice = happyPath.slice(bgSliceStart, bgSliceEnd);
const forbiddenBgFragments = ['Owner happy path','server validation','Draft запис','Owner действието','lifecycle','Admin решение','Admin controlled','media workspace','Gallery exposure','Registry / Certificate'];
for (const fragment of forbiddenBgFragments) assert(!bgSlice.includes(fragment), `Bulgarian owner checklist avoids mixed fragment: ${fragment}`);
const bgNewDogStart = i18n.indexOf('newDog: {', i18n.indexOf('bg: {'));
const bgNewDogSlice = i18n.slice(bgNewDogStart, bgNewDogStart + 900);
assert(bgNewDogSlice.includes('Започни директно с формата'), 'Bulgarian new/edit copy tells the user to start with the form');
assert(bgNewDogSlice.includes("pillA: 'Основни данни'"), 'Bulgarian new page uses clear form-first pills');
const lockedFiles = ['apps/web/app/api/registry/route.ts','apps/web/app/api/registry/[slug]/route.ts','apps/web/app/api/verify/[code]/route.ts','apps/web/app/api/ecosystem/route.ts','apps/web/app/api/health/db/route.ts'];
for (const file of lockedFiles) assert(fs.existsSync(path.join(root, file)), `Locked backend file remains present: ${file}`);
if (failed) { console.error('\nOwner form-first UX QA failed.'); process.exit(1); }
console.log('\nOwner form-first UX QA complete.');
