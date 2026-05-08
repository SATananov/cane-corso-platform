import { PageShell } from '@/components/page-shell';
import { VerificationResultPanel } from '@/components/verification-result-panel';
import { InfoPanelGrid } from '@/components/info-panel-grid';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getVerificationDocument } from '@/lib/registry.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

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
        { eyebrow: 'Owner path', title: 'Owners still work from the private member area first', description: 'Profile work begins in My Dogs and Profile long before verification becomes relevant.', href: '/my-dogs', meta: 'Подготовка на собственика • private area', icon: 'member' as const },
      ],
    },
    bg: {
      title: 'Какво означава този резултат от проверката',
      description: 'Валидният резултат потвърждава активен публичен сертификатен запис. Това не значи, че всеки профил в Регистъра автоматично носи същото доверено състояние.',
      cards: [
        { eyebrow: 'Активен запис', title: 'Успешният резултат потвърждава активно сертификатно доверие', description: 'Това значи, че кодът съвпада с активен публичен сертификатен запис, вързан към публикуван Cane Corso профил.', href: '/verify', meta: 'Активен • публичен • сертификат', icon: 'verify' as const },
        { eyebrow: 'Публикуван профил', title: 'Профилът в Регистъра е публичният профилен слой', description: 'Публикуваният профил и сертификатният слой на доверие са свързани, но не са едно и също.', href: '/registry', meta: 'Регистър • публичен профил', icon: 'registry' as const },
        { eyebrow: 'Наръчник', title: 'Ползвай наръчника за пълното trust обяснение', description: 'Наръчникът обяснява заедно публикацията в Регистъра, членската подготовка, модерацията и сертификатното доверие.', href: '/guide?topic=registry#registry', meta: 'Наръчник • слоеве на доверие', icon: 'guide' as const },
        { eyebrow: 'Път на собственика', title: 'Собствениците пак работят първо от частната членска зона', description: 'Работата по профила започва в „Моите Cane Corso“ и „Профил“ много преди проверката да стане важна.', href: '/my-dogs', meta: 'Подготовка на собственика • частна зона', icon: 'member' as const },
      ],
    },
    it: {
      title: 'Cosa significa questo risultato di verifica',
      description: 'Un risultato valido conferma un record certificato pubblico attivo. Non significa che ogni profilo nel Registro porti automaticamente lo stesso stato di fiducia.',
      cards: [
        { eyebrow: 'Record attivo', title: 'Un risultato positivo conferma fiducia certificata attiva', description: 'Questo significa che il codice corrisponde a un record certificato pubblico attivo collegato a un profilo Cane Corso pubblicato.', href: '/verify', meta: 'Attivo • pubblico • certificato', icon: 'verify' as const },
        { eyebrow: 'Profilo pubblicato', title: 'Il profilo nel Registro è il livello del profilo pubblico', description: 'Il profilo pubblicato e il livello di fiducia del certificato sono collegati, ma non sono la stessa cosa.', href: '/registry', meta: 'Registro • profilo pubblico', icon: 'registry' as const },
        { eyebrow: 'Guida', title: 'Usa la guida per la spiegazione completa della fiducia', description: 'La guida spiega insieme pubblicazione nel Registro, preparazione membro, moderazione e fiducia del certificato.', href: '/guide?topic=registry#registry', meta: 'Guida • livello di fiducia', icon: 'guide' as const },
        { eyebrow: 'Percorso proprietario', title: 'I proprietari lavorano comunque prima dall’area membri privata', description: 'Il lavoro sul profilo inizia in I miei Cane Corso e Profilo molto prima che la verifica diventi rilevante.', href: '/my-dogs', meta: 'Preparazione proprietario • area privata', icon: 'member' as const },
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
      heroChips={locale === 'bg' ? ['Публично доверие', 'Проверка', code] : locale === 'it' ? ['Fiducia pubblica', 'Verifica', code] : ['Public trust', 'Verify', code]}
      heroNote={document ? (locale === 'bg' ? 'Активният сертификатен запис е свързан с публикуван Cane Corso профил.' : locale === 'it' ? 'Il record certificato attivo è collegato a un profilo Cane Corso pubblicato.' : 'The active certificate record is tied to a published Cane Corso profile.') : (locale === 'bg' ? 'Кодът не съвпадна с активен публичен сертификатен запис.' : locale === 'it' ? 'Il codice non corrisponde a un record certificato pubblico attivo.' : 'The code did not match an active public certificate record.')}
    >
      <VerificationResultPanel document={document} locale={locale} code={code} />
      <SectionContentGuidePanel locale={locale} surface="verify" />
      <InfoPanelGrid eyebrow={t.pages.verify.eyebrow} title={copy.title} description={copy.description} cards={copy.cards} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} ariaLabel={copy.title} />
    </PageShell>
  );
}
