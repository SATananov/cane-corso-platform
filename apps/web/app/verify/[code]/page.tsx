import { PageShell } from '@/components/page-shell';
import { VerificationResultPanel } from '@/components/verification-result-panel';
import { InfoPanelGrid } from '@/components/info-panel-grid';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getVerificationDocument } from '@/lib/registry.server';

interface VerifyPageProps {
  params: Promise<{ code: string }>;
}

export const dynamic = 'force-dynamic';

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { code } = await params;
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const document = await getVerificationDocument(code);

  const copyByLocale = {
    en: {
      title: 'What this verification result means',
      description: 'A valid result confirms an active public certificate record. It does not mean every registry profile automatically has the same trust state.',
      cards: [
        { eyebrow: 'Active record', title: 'A successful result confirms active certificate trust', description: 'This means the code matches an active public certificate record tied to a published Cane Corso profile.', href: '/verify', meta: 'Active • public • certificate', icon: 'verify' as const },
        { eyebrow: 'Published profile', title: 'The registry profile is the public profile layer', description: 'The published profile and the certificate trust layer are related, but they are not the same thing.', href: '/registry', meta: 'Registry • public profile', icon: 'registry' as const },
        { eyebrow: 'Guide', title: 'Use the guide if you need the full trust explanation', description: 'The guide explains registry publication, member preparation, moderation, and certificate trust together.', href: '/guide?topic=registry#registry', meta: 'Guide • trust layers', icon: 'guide' as const },
        { eyebrow: 'Owner path', title: 'Owners still work from the private member area first', description: 'Profile work begins in My Dogs and Profile long before verify becomes relevant.', href: '/my-dogs', meta: 'Owner prep • private area', icon: 'member' as const },
      ],
    },
    bg: {
      title: 'Какво означава този verify резултат',
      description: 'Валидният резултат потвърждава активен публичен сертификатен запис. Това не значи, че всеки registry профил автоматично носи същото trust състояние.',
      cards: [
        { eyebrow: 'Активен запис', title: 'Успешният резултат потвърждава активно сертификатно доверие', description: 'Това значи, че кодът съвпада с активен публичен сертификатен запис, вързан към публикуван Cane Corso профил.', href: '/verify', meta: 'Активен • публичен • сертификат', icon: 'verify' as const },
        { eyebrow: 'Публикуван профил', title: 'Registry профилът е публичният профилен слой', description: 'Публикуваният профил и сертификатният trust слой са свързани, но не са едно и също.', href: '/registry', meta: 'Регистър • публичен профил', icon: 'registry' as const },
        { eyebrow: 'Наръчник', title: 'Ползвай наръчника за пълното trust обяснение', description: 'Наръчникът обяснява заедно registry публикацията, member подготовката, модерацията и сертификатното доверие.', href: '/guide?topic=registry#registry', meta: 'Наръчник • trust слоеве', icon: 'guide' as const },
        { eyebrow: 'Owner път', title: 'Собствениците пак работят първо от частната членска зона', description: 'Работата по профила започва в My Dogs и Profile много преди verify да стане релевантен.', href: '/my-dogs', meta: 'Owner подготовка • частна зона', icon: 'member' as const },
      ],
    },
    it: {
      title: 'Cosa significa questo risultato verify',
      description: 'Un risultato valido conferma un record certificato pubblico attivo. Non significa che ogni profilo registry porti automaticamente lo stesso stato di fiducia.',
      cards: [
        { eyebrow: 'Record attivo', title: 'Un risultato positivo conferma fiducia certificata attiva', description: 'Questo significa che il codice corrisponde a un record certificato pubblico attivo collegato a un profilo Cane Corso pubblicato.', href: '/verify', meta: 'Attivo • pubblico • certificato', icon: 'verify' as const },
        { eyebrow: 'Profilo pubblicato', title: 'Il profilo registry è il layer del profilo pubblico', description: 'Il profilo pubblicato e il layer di fiducia del certificato sono collegati, ma non sono la stessa cosa.', href: '/registry', meta: 'Registry • profilo pubblico', icon: 'registry' as const },
        { eyebrow: 'Guida', title: 'Usa la guida per la spiegazione completa della fiducia', description: 'La guida spiega insieme pubblicazione nel registry, preparazione membro, moderazione e fiducia del certificato.', href: '/guide?topic=registry#registry', meta: 'Guida • layer di fiducia', icon: 'guide' as const },
        { eyebrow: 'Percorso owner', title: 'I proprietari lavorano comunque prima dall’area membri privata', description: 'Il lavoro sul profilo inizia in My Dogs e Profile molto prima che verify diventi rilevante.', href: '/my-dogs', meta: 'Preparazione owner • area privata', icon: 'member' as const },
      ],
    },
  } as const;

  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={t.pages.verify.eyebrow}
      title={`${t.pages.verify.titlePrefix} ${code}`}
      description={document?.entry.summary || t.pages.verify.description}
      accentLabel={t.pageShell.accentLabel}
      helpHref="/guide?topic=registry#registry"
      helpLabel={t.common.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG verification result"
      visualFit="contain"
      heroChips={locale === 'bg' ? ['Публично доверие', 'Verify', code] : locale === 'it' ? ['Fiducia pubblica', 'Verify', code] : ['Public trust', 'Verify', code]}
      heroNote={document ? (locale === 'bg' ? 'Активният сертификатен запис е свързан с публикуван Cane Corso профил.' : locale === 'it' ? 'Il record certificato attivo è collegato a un profilo Cane Corso pubblicato.' : 'The active certificate record is tied to a published Cane Corso profile.') : (locale === 'bg' ? 'Кодът не съвпадна с активен публичен сертификатен запис.' : locale === 'it' ? 'Il codice non corrisponde a un record certificato pubblico attivo.' : 'The code did not match an active public certificate record.')}
    >
      <VerificationResultPanel document={document} locale={locale} code={code} />
      <InfoPanelGrid eyebrow={t.pages.verify.eyebrow} title={copy.title} description={copy.description} cards={copy.cards} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} ariaLabel={copy.title} />
    </PageShell>
  );
}
