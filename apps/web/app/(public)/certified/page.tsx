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
      'Отделен архив за Cane Corso, които имат официално издаден USG сертификат от админ. Това е различно от Registry списъка и различно от curated USG Галерия.',
    note: 'Всеки сертификат пази snapshot от момента на издаване и има собствен Verify път.',
    chips: ['Издадено от админ', 'Certificate snapshot', 'Verify път'],
    helpLabel: 'Проверка',
  },
  it: {
    eyebrow: 'Archivio certificati',
    title: 'USG Certificati',
    description:
      'Archivio dedicato ai Cane Corso che hanno ricevuto un certificato USG ufficiale emesso da admin. È separato dal Registro e dalla USG Gallery curata.',
    note: 'Ogni certificato conserva uno snapshot del momento di emissione e apre il proprio percorso Verify.',
    chips: ['Emesso da admin', 'Snapshot certificato', 'Percorso Verify'],
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
      accentLabel="USG certified archive"
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG certified seal"
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
