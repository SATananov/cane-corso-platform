import { GalleryCertifiedShowcaseTrustPanel } from '@/components/gallery-certified-showcase-trust-panel';
import { PageShell } from '@/components/page-shell';
import { PublicCertifiedOverview } from '@/components/public-certified-overview';
import { getCurrentLocale } from '@/lib/locale.server';
import { getUsgCertifiedDocument } from '@/lib/registry.server';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Certificate archive',
    title: 'USG Certified',
    description:
      'A dedicated archive for Cane Corso that received an official USG certificate issued by admin. This is separate from the Registry list and separate from the curated USG Gallery.',
    note: 'Each certificate uses a frozen snapshot from the moment of issue and opens its own Verify path.',
    chips: ['Issued by admin', 'Certificate snapshot', 'Verify path'],
    helpLabel: 'Verify',
  },
  bg: {
    eyebrow: 'Архив на сертификати',
    title: 'USG Сертифицирани',
    description:
      'Отделен архив за Cane Corso, които имат официално издаден USG сертификат от администратор. Това е различно от списъка в Регистъра и различно от подбраната USG Галерия.',
    note: 'Всеки сертификат пази запис от момента на издаване и има собствен път за проверка.',
    chips: ['Издадено от администратор', 'Запис на сертификата', 'Път за проверка'],
    helpLabel: 'Проверка',
  },
  it: {
    eyebrow: 'Archivio certificati',
    title: 'USG Certificati',
    description:
      'Archivio dedicato ai Cane Corso che hanno ricevuto un certificato USG ufficiale emesso da un amministratore. È separato dal Registro e dalla Galleria USG curata.',
    note: 'Ogni certificato conserva uno record del momento di emissione e apre il proprio percorso di verifica.',
    chips: ['Emesso da un amministratore', 'Record del certificato', 'Percorso di verifica'],
    helpLabel: 'Verifica',
  },
} as const;

export default async function CertifiedPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const document = await getUsgCertifiedDocument();

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      accentLabel={locale === 'bg' ? 'Архив USG Сертифицирани' : locale === 'it' ? 'Archivio USG Certificati' : 'USG certified archive'}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt={locale === 'bg' ? 'USG сертифициран печат' : locale === 'it' ? 'Sigillo USG certificato' : 'USG certified seal'}
      visualFit="contain"
      heroChips={copy.chips}
      heroNote={copy.note}
      helpHref="/verify"
      helpLabel={copy.helpLabel}
    >
      <GalleryCertifiedShowcaseTrustPanel variant="certified" locale={locale} />
      <PublicCertifiedOverview document={document} locale={locale} />
    </PageShell>
  );
}
