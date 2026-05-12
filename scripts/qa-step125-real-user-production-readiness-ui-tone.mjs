#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function file(rel) {
  const full = path.join(root, rel);
  if (!existsSync(full)) {
    fail(`Required file missing: ${rel}`);
    return '';
  }
  pass(`Required file exists: ${rel}`);
  return readFileSync(full, 'utf8');
}

function expect(text, pattern, label) {
  if (pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern)) pass(label);
  else fail(`${label}: missing ${pattern}`);
}

function reject(text, pattern, label) {
  if (pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern)) fail(`${label}: found forbidden ${pattern}`);
  else pass(label);
}

function rejectExists(rel, label) {
  if (existsSync(path.join(root, rel))) fail(`${label}: forbidden file exists ${rel}`);
  else pass(label);
}

console.log('\n===============================================================');
console.log('Step 125 — Real User Production Readiness & UI Tone Cleanup QA');
console.log('===============================================================\n');

const verifyContinuity = file('apps/web/components/verify-certificate-trust-continuity-panel.tsx');
const verifyResult = file('apps/web/components/verification-result-panel.tsx');
const verifyCodePage = file('apps/web/app/verify/[code]/page.tsx');
const knowledgeExperience = file('apps/web/components/knowledge-education-experience.tsx');
const ownerReadiness = file('apps/web/components/owner-review-readiness-panel.tsx');
const photoAssistant = file('apps/web/components/admin-photo-review-assistant-panel.tsx');
const ecosystemDirectory = file('apps/web/components/ecosystem-directory.tsx');
const partnerCopy = file('apps/web/lib/partner-copy.ts');
const faq = file('apps/web/app/(public)/faq/page.tsx');
const ownerProfile = file('apps/web/app/(member)/profile/page.tsx');
const ownerHappyPath = file('apps/web/components/owner-submission-happy-path-panel.tsx');
const releaseFlow = file('apps/web/components/registry-certificate-release-flow-panel.tsx');
const registryProfile = file('apps/web/components/public-registry-profile.tsx');
const ecosystemWorkspace = file('apps/web/components/ecosystem-owner-workspace.tsx');
const galleryTrust = file('apps/web/components/gallery-certified-showcase-trust-panel.tsx');
const pkg = file('package.json');
const releaseQa = file('scripts/qa-fullstack-all-in-one-release-lock.mjs');

rejectExists('apps/web/PATCH_DELETE_AFTER_COPY.txt', 'Old temporary patch copy file removed');
rejectExists('apps/web/PATCH_NOTES_REGISTRY_FINAL_POLISH.txt', 'Old registry patch notes removed');

expect(verifyContinuity, /import type \{ Locale \}/, 'Verify continuity imports Locale');
expect(verifyContinuity, /copyByLocale/, 'Verify continuity is localized');
expect(verifyContinuity, /Проверка, Регистър и USG сертификат/, 'Verify continuity has Bulgarian copy');
expect(verifyContinuity, /Verifica, Registro e Certificato USG/, 'Verify continuity has Italian copy');
expect(verifyResult, /<VerifyCertificateTrustContinuityPanel locale=\{locale\} \/>/, 'Verify result passes active locale to trust continuity panel');
reject(verifyContinuity, /Verify, Registry и USG сертификат/, 'No mixed-language Verify continuity title');
reject(verifyContinuity, /separate official decision|официално решение|decisione ufficiale separata/i, 'Verify continuity avoids unsafe official-authority decision wording');

reject(knowledgeExperience, /mutate admin moderation state|не променя админ модерация/i, 'Knowledge experience avoids internal mutation/admin-state copy');
reject(ownerReadiness, /Auth, or moderation logic|администраторски преглед|админ публикация/i, 'Owner readiness avoids internal auth/admin copy');
reject(verifyCodePage, /Подготовка на собственика • private area|trust обяснение/, 'Verify code page avoids mixed-language private/trust copy');
expect(verifyCodePage, /Owner preparation • private area/, 'Verify code page has clean EN owner preparation meta');
expect(verifyCodePage, /пълното обяснение за доверие/, 'Verify code page has clean BG trust guide copy');

reject(photoAssistant, /ML-safe prototype behavior|ML-safe prototype поведение|Comportamento prototype ML-safe|Human-in-the-loop|Краен етикет от админ|training export/i, 'Photo assistant avoids prototype/admin/export UI wording');
expect(photoAssistant, /Photo guidance with final human decision/, 'Photo assistant uses real review guidance title');
expect(photoAssistant, /Насока за снимки с финално човешко решение/, 'Photo assistant has Bulgarian real-user title');
expect(photoAssistant, /Assistente revisione foto/, 'Photo assistant has Italian review title');
expect(photoAssistant, /human label remains the source of truth|крайният човешки етикет остава водещ|etichetta umana finale resta la fonte di verità/i, 'Photo assistant keeps human-label boundary');
expect(photoAssistant, /dog_id, media_id, expected_view, assistant_quality, assistant_confidence, admin_final_label, dataset_use, review_status/, 'Dataset guardrail fields remain present for Step 122 QA');

expect(ecosystemDirectory + partnerCopy, /prepared for the public directory|prepared for the public partner directory/, 'Public ecosystem/partner EN copy translates seed/demo text into real product wording');
expect(ecosystemDirectory + partnerCopy, /подготвен за публичн/, 'Public ecosystem/partner BG copy translates seed/demo text into real product wording');
expect(ecosystemDirectory + partnerCopy, /directory pubblica/, 'Public ecosystem/partner IT copy translates seed/demo text into real product wording');
expect(ecosystemDirectory + partnerCopy, /USG одобрение|approvazione USG|USG approval/, 'Public ecosystem/partner copy uses USG approval language');

expect(faq, /USG • Registry • Knowledge/, 'FAQ EN card meta stays English');
expect(faq, /USG • Регистър • Знания/, 'FAQ BG card meta stays Bulgarian');
expect(faq, /USG • Registro • Conoscenza/, 'FAQ IT card meta stays Italian');
reject(faq, /Owner submissions|community listings|trust states|service listings|Може ли админ|нискокачествени listings|админ наблюдения|админ-посредничество|contact preferences и/i, 'FAQ avoids internal workflow/mixed-language terms');
expect(faq, /USG посредничество/, 'FAQ explains sensitive matching through USG mediation');
expect(faq, /обучителни материали за съдии/, 'FAQ keeps Bulgarian judge-education wording clean');

reject(ownerProfile, /private\/admin-visible|Private address for admin use only|лични\/видими за админ|Личен адрес само за админ|visibili all.admin|solo per admin/i, 'Owner profile avoids raw admin privacy wording');
expect(ownerProfile, /USG ги вижда при преглед|You and USG can see the full data|Tu e USG vedete i dati completi/, 'Owner profile uses USG visibility language');

reject(ownerHappyPath, /administrator decisions|submit it to the administrator|Решение от администратор|Стъпка на администратор|amministratore/i, 'Owner submission path avoids administrator workflow wording');
expect(ownerHappyPath, /USG review decision|Решение след USG преглед|Decisione della revisione USG/, 'Owner submission path uses USG review decision wording');

reject(releaseFlow, /second admin decision|Администраторът може|Apri revisione amministrativa|Път за публикация в Регистъра',\n    title: 'Publication/i, 'Registry/certificate release flow avoids mixed/admin copy');
expect(releaseFlow, /Registry publication path/, 'Registry/certificate release flow has clean English eyebrow');
expect(releaseFlow, /second USG review decision|второ USG решение за преглед|seconda decisione della revisione USG/, 'Registry/certificate release flow uses USG review language');

reject(registryProfile, /Admin \/ USG rating|Official admin assessment|Public admin note|Awaiting admin assessment|Официална админ оценка|Публична админ бележка|Очаква админ оценка|Valutazione ufficiale admin|Nota pubblica admin/i, 'Public Registry profile avoids raw admin assessment labels');
expect(registryProfile, /USG official rating|Официална USG оценка|Valutazione ufficiale USG/, 'Public Registry profile uses official USG assessment labels');

reject(ecosystemWorkspace, /admin approval|admin review|admin publication|админ одобрение|админ преглед|админ публикация|approvazione admin|revisione admin|pubblicazione admin/i, 'Community owner workspace avoids raw admin review/publication copy');
expect(ecosystemWorkspace, /USG approval|USG review|USG одобрение|USG преглед|approvazione USG|revisione USG/, 'Community owner workspace uses USG approval/review language');

reject(galleryTrust, /Admin choice|Админ решение|Scelta admin|admin decision|админ решение|decisione admin/i, 'Gallery/certified trust panel avoids admin-choice wording');
expect(galleryTrust, /USG choice|USG решение|Scelta USG/, 'Gallery/certified trust panel uses USG decision wording');

expect(pkg, /step125:real-user-production-readiness:qa/, 'package.json includes Step 125 QA script');
expect(releaseQa, /docs\/qa\/step125-real-user-production-readiness-ui-tone\.md/, 'Full release QA requires Step 125 QA doc');
expect(releaseQa, /scripts\/qa-step125-real-user-production-readiness-ui-tone\.mjs/, 'Full release QA requires Step 125 QA script');
expect(releaseQa, /step125:real-user-production-readiness:qa/, 'Full release QA requires Step 125 package script');
expect(releaseQa, /Step 125 real-user production readiness and UI tone/, 'Full release QA runs Step 125 QA');

if (process.exitCode) {
  console.error('\n===============================================================');
  console.error('Step 125 Real User Production Readiness & UI Tone Cleanup QA FAILED');
  console.error('===============================================================');
  process.exit(process.exitCode);
}

console.log('\n===============================================================');
console.log('Step 125 Real User Production Readiness & UI Tone Cleanup QA PASS');
console.log('===============================================================');
