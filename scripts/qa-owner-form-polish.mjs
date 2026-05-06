#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let failed = false;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed = true; console.error(`FAIL ${message}`); }
function assert(condition, message) { condition ? pass(message) : fail(message); }
const form = read('apps/web/components/dog-profile-form.tsx');
const preview = read('apps/web/components/dog-profile-preview-card.tsx');
const i18n = read('apps/web/lib/i18n.ts');
const pkg = JSON.parse(read('package.json'));
assert(form.includes("add: 'Качи снимки'"), 'Bulgarian upload action uses снимки wording');
assert(form.includes("remove: 'Премахни снимката'"), 'Bulgarian remove action uses снимка wording');
assert(form.includes("processing: 'Подготвям снимките...'"), 'Bulgarian processing copy uses снимки wording');
assert(form.includes("downloadPreview: 'Покажи USG снимка'"), 'Bulgarian USG preview copy uses снимка wording');
assert(form.includes("download: 'Изтегли USG снимка'"), 'Bulgarian USG download copy uses снимка wording');
assert(!form.includes('Качи изображения'), 'Bulgarian form avoids изображения upload wording');
assert(i18n.includes("livePreview: 'Преглед на профила'"), 'Bulgarian preview label is user-friendly');
assert(i18n.includes("uploadImage: 'Качи снимка'"), 'Bulgarian pedigree upload copy uses снимка');
assert(i18n.includes("removeImage: 'Премахни снимката'"), 'Bulgarian pedigree remove copy uses снимка');
assert(i18n.includes("imageLabel: 'Снимка на предеца'"), 'Bulgarian pedigree image label uses снимка');
assert(!i18n.includes("livePreview: 'Жив преглед'"), 'Bulgarian copy no longer uses Жив преглед');
assert(preview.includes('function localizePreviewValue'), 'Preview card localizes stored option values');
assert(preview.includes('const displayColor = localizePreviewValue'), 'Preview card localizes color values');
assert(preview.includes('const displayCountry = localizePreviewValue'), 'Preview card localizes country values');
assert(preview.includes("['Bulgaria', t.options.countries.bulgaria]"), 'Preview maps Bulgaria to active locale label');
assert(preview.includes('<dd>{displayColor || dictionary.common.notSetYet}</dd>'), 'Preview renders localized color label');
assert(preview.includes('<dd>{displayCountry || dictionary.common.notSetYet}</dd>'), 'Preview renders localized country label');
assert(pkg.scripts['owner:form-polish:qa'] === 'node scripts/qa-owner-form-polish.mjs', 'Package script owner:form-polish:qa exists');
const lockedFiles = ['apps/web/app/api/registry/route.ts','apps/web/app/api/registry/[slug]/route.ts','apps/web/app/api/verify/[code]/route.ts','apps/web/app/api/ecosystem/route.ts','apps/web/app/api/health/db/route.ts'];
for (const file of lockedFiles) assert(fs.existsSync(path.join(root, file)), `Locked backend file remains present: ${file}`);
if (failed) { console.error('\nOwner form polish QA failed.'); process.exit(1); }
console.log('\nOwner form polish QA complete.');
