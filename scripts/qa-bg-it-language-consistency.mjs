#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';

const checks = [
  'apps/web/components/admin-moderation-action-flow-panel.tsx',
  'apps/web/components/admin-operational-clarity-panel.tsx',
  'apps/web/components/admin-registry-evidence-polish-panel.tsx',
  'apps/web/components/registry-certificate-release-flow-panel.tsx',
  'apps/web/components/review-decision-readiness-panel.tsx',
  'apps/web/components/public-registry-trust-readability-panel.tsx',
  'apps/web/components/public-registry-profile.tsx',
  'apps/web/components/owner-journey-command-center.tsx',
  'apps/web/components/owner-onboarding-final-panel.tsx',
  'apps/web/components/knowledge-center.tsx',
  'apps/web/components/knowledge-education-experience.tsx',
  'apps/web/components/certificate-v2-document.tsx',
  'apps/web/app/(member)/member/page.tsx',
  'apps/web/app/(admin)/admin/registry/page.tsx',
  'apps/web/app/(admin)/admin/knowledge/page.tsx',
  'apps/web/app/(public)/certified/page.tsx',
  'apps/web/app/(public)/community/page.tsx',
  'apps/web/app/verify/page.tsx',
  'apps/web/app/verify/[code]/page.tsx',
];

const forbidden = [
  'owner заяв',
  'operational път',
  'authority слой',
  'visual polish',
  'trust слой',
  'showcase слой',
  'Owner сним',
  'Owner source',
  'Verify път',
  'Gallery избор',
  'Registry профил',
  'snapshot-а',
  'submission owner',
  'working flow admin futuro',
  'layer admin',
  'read-only управление',
  'My Dogs остава',
  'Отвори My Dogs',
  'pedigree и качеството',
  'Прегледани submissions',
  'Cosa significa questo risultato verify',
  'percorso Verify',
  'Percorso Verify',
  'workspace owner',
  'review e pubblicazione',
  'Registry • profilo pubblico',
  'registry pubblico',
  'layer di fiducia pubblica',
  'admin decisione',
  'venue pet-friendly',
  'revisione admin',
  'decisione admin chiara',
  'admin-only',
  'официалния Registry / certificate слой',
  'Сертификатът е отделно админ решение',
  'Registry → Verify → Certificate',
];

let failed = false;
for (const file of checks) {
  if (!existsSync(file)) {
    console.error(`FAIL Missing file: ${file}`);
    failed = true;
    continue;
  }
  const text = readFileSync(file, 'utf8');
  for (const phrase of forbidden) {
    if (text.includes(phrase)) {
      console.error(`FAIL Forbidden mixed-language phrase in ${file}: ${phrase}`);
      failed = true;
    }
  }
}

const positiveChecks = [
  ['apps/web/components/admin-moderation-action-flow-panel.tsx', 'Заявка от собственик'],
  ['apps/web/components/admin-moderation-action-flow-panel.tsx', 'Richiesta del proprietario'],
  ['apps/web/app/(member)/member/page.tsx', 'Отвори „Моите Cane Corso“'],
  ['apps/web/app/(member)/member/page.tsx', 'Apri I miei Cane Corso'],
  ['apps/web/app/verify/page.tsx', "['Регистър', 'Проверка', 'Сертификат']"],
  ['apps/web/app/verify/page.tsx', "['Registro', 'Verifica', 'Certificato']"],
  ['apps/web/app/(public)/certified/page.tsx', 'Запис на сертификата'],
  ['apps/web/app/(public)/certified/page.tsx', 'Percorso di verifica'],
];

for (const [file, phrase] of positiveChecks) {
  const text = readFileSync(file, 'utf8');
  if (!text.includes(phrase)) {
    console.error(`FAIL Expected localized phrase missing in ${file}: ${phrase}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('PASS BG/IT visible language consistency guardrail passed');
