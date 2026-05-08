import { PageShell } from '@/components/page-shell';
import { VerifyEntryPanel } from '@/components/verify-entry-panel';
import { InfoPanelGrid } from '@/components/info-panel-grid';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

export default async function VerifyLandingPage() {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);

  const copyByLocale = {
    en: {
      contractEyebrow: 'Verify contract',
      contractTitle: 'Verify belongs to certificate trust, not to every public profile',
      contractDescription:
        'This page should make the trust path simple: registry publication, certificate issuance, and verify are related but not identical steps.',
      contractCards: [
        { eyebrow: 'Registry', title: 'A profile can be published without becoming a certificate record', description: 'Publication is the official public profile step, but certificate trust is a later decision.', href: '/registry', meta: 'Published profile • official visibility', icon: 'registry' as const },
        { eyebrow: 'Certificate', title: 'Certificate trust exists only when it is actively issued', description: 'Verify checks the active certificate layer, not private drafts and not every published profile.', href: '/guide?topic=registry#registry', meta: 'Issued certificate • active trust', icon: 'verify' as const },
        { eyebrow: 'Owner workspace', title: 'Owners prepare long before Verify becomes relevant', description: 'Profile work, review, and publication happen first in the member area.', href: '/my-dogs', meta: 'Owner preparation • review • publish', icon: 'member' as const },
        { eyebrow: 'Guide', title: 'The guide explains how the trust layers connect', description: 'Use the guide whenever you need the full picture of registry vs certificate vs community visibility.', href: '/guide?topic=registry#registry', meta: 'Guide • trust clarity', icon: 'guide' as const },
      ],
      journeyEyebrow: 'How to use Verify',
      journeyTitle: 'A simple order for reading the public trust layer',
      journeyDescription: 'Verify makes more sense after the user already understands registry publication and owner preparation.',
      journeyCards: [
        { eyebrow: 'Step 1', title: 'Start from the public registry', description: 'Understand the official profile layer before checking certificate trust.', href: '/registry', meta: 'Registry first', icon: 'registry' as const },
        { eyebrow: 'Step 2', title: 'Use Verify only for certificate trust questions', description: 'Verify is not a search replacement for every public Cane Corso profile.', href: '/verify', meta: 'Certificate trust • verify', icon: 'verify' as const },
        { eyebrow: 'Step 3', title: 'Open the guide if the layers feel confusing', description: 'The guide exists to explain official publication, member preparation, and community usefulness together.', href: '/guide?topic=official-community#official-community', meta: 'Guide • clarity • layers', icon: 'guide' as const },
        { eyebrow: 'Step 4', title: 'Return to member preparation if you are the owner', description: 'Owners should work from My Dogs and Profile first, not from the verify page.', href: '/my-dogs', meta: 'My Dogs • profile • owner path', icon: 'member' as const },
      ],
    },
    bg: {
      contractEyebrow: 'Договор за проверка',
      contractTitle: 'Проверката е за сертификатно доверие, не за всеки публичен профил',
      contractDescription:
        'Тази страница прави пътя на доверие ясен: публикацията в Регистъра, издаването на сертификат и проверката са свързани, но не са една и съща стъпка.',
      contractCards: [
        { eyebrow: 'Регистър', title: 'Един профил може да е публикуван, без да е сертификатен запис', description: 'Публикацията е официалната публична стъпка за профила, а сертификатното доверие е отделно по-късно решение.', href: '/registry', meta: 'Публикуван профил • официална видимост', icon: 'registry' as const },
        { eyebrow: 'Сертификат', title: 'Сертификатното доверие съществува само когато е активно издадено', description: 'Проверката проверява активния сертификатен слой, не частните чернови и не всеки публикуван профил.', href: '/guide?topic=registry#registry', meta: 'Издаден сертификат • активно доверие', icon: 'verify' as const },
        { eyebrow: 'Работна зона на собственика', title: 'Собствениците подготвят профила много преди проверката да стане важна', description: 'Работата по профила, прегледът и публикацията започват първо в членската зона.', href: '/my-dogs', meta: 'Подготовка • преглед • публикация', icon: 'member' as const },
        { eyebrow: 'Наръчник', title: 'Наръчникът обяснява как се свързват слоевете на доверие', description: 'Ползвай наръчника, когато ти трябва цялата картина за Регистър, сертификат и общностна видимост.', href: '/guide?topic=registry#registry', meta: 'Наръчник • ясно доверие', icon: 'guide' as const },
      ],
      journeyEyebrow: 'Как да използваш проверката',
      journeyTitle: 'Прост ред за четене на публичния слой на доверие',
      journeyDescription: 'Проверката има повече смисъл, след като потребителят вече разбира публикацията в Регистъра и подготовката на собственика.',
      journeyCards: [
        { eyebrow: 'Стъпка 1', title: 'Започни от публичния регистър', description: 'Разбери официалния профилен слой, преди да проверяваш сертификатното доверие.', href: '/registry', meta: 'Първо регистърът', icon: 'registry' as const },
        { eyebrow: 'Стъпка 2', title: 'Ползвай проверката само за въпроси за сертификатно доверие', description: 'Проверката не е заместител на търсене за всеки публичен Cane Corso профил.', href: '/verify', meta: 'Сертификатно доверие • проверка', icon: 'verify' as const },
        { eyebrow: 'Стъпка 3', title: 'Отвори наръчника, ако слоевете се объркват', description: 'Наръчникът съществува, за да обясни официалната публикация, членската подготовка и общностната полезност заедно.', href: '/guide?topic=official-community#official-community', meta: 'Наръчник • яснота • слоеве', icon: 'guide' as const },
        { eyebrow: 'Стъпка 4', title: 'Върни се към подготовката на собственика, ако ти си собственикът', description: 'Собствениците трябва да работят първо от „Моите Cane Corso“ и „Профил“, не от страницата за проверка.', href: '/my-dogs', meta: 'Моите Cane Corso • профил • път на собственика', icon: 'member' as const },
      ],
    },
    it: {
      contractEyebrow: 'Contratto di verifica',
      contractTitle: 'La verifica appartiene alla fiducia del certificato, non a ogni profilo pubblico',
      contractDescription:
        'Questa pagina dovrebbe rendere semplice il percorso di fiducia: pubblicazione nel Registro, emissione del certificato e verifica sono passaggi collegati ma non identici.',
      contractCards: [
        { eyebrow: 'Registro', title: 'Un profilo può essere pubblicato senza diventare un record certificato', description: 'La pubblicazione è il passo ufficiale del profilo pubblico, ma la fiducia del certificato è una decisione successiva.', href: '/registry', meta: 'Profilo pubblicato • visibilità ufficiale', icon: 'registry' as const },
        { eyebrow: 'Certificato', title: 'La fiducia del certificato esiste solo quando viene emessa attivamente', description: 'La verifica controlla il livello certificato attivo, non le bozze private e non ogni profilo pubblicato.', href: '/guide?topic=registry#registry', meta: 'Certificato emesso • fiducia attiva', icon: 'verify' as const },
        { eyebrow: 'Area di lavoro del proprietario', title: 'I proprietari preparano molto prima che la verifica diventi rilevante', description: 'Lavoro sul profilo, revisione e pubblicazione avvengono prima nell’area membri.', href: '/my-dogs', meta: 'Preparazione proprietario • revisione • pubblicazione', icon: 'member' as const },
        { eyebrow: 'Guida', title: 'La guida spiega come si collegano i livelli di fiducia', description: 'Usa la guida quando ti serve il quadro completo di Registro, certificato e visibilità comunitaria.', href: '/guide?topic=registry#registry', meta: 'Guida • chiarezza fiducia', icon: 'guide' as const },
      ],
      journeyEyebrow: 'Come usare la verifica',
      journeyTitle: 'Un ordine semplice per leggere i livelli di fiducia pubblica',
      journeyDescription: 'La verifica ha più senso dopo che l’utente ha già capito la pubblicazione nel Registro e la preparazione del proprietario.',
      journeyCards: [
        { eyebrow: 'Passo 1', title: 'Inizia dal Registro pubblico', description: 'Comprendi il livello del profilo ufficiale prima di controllare la fiducia del certificato.', href: '/registry', meta: 'Prima il Registro', icon: 'registry' as const },
        { eyebrow: 'Passo 2', title: 'Usa la verifica solo per domande sulla fiducia del certificato', description: 'La verifica non sostituisce la ricerca per ogni profilo Cane Corso pubblico.', href: '/verify', meta: 'Fiducia del certificato • verifica', icon: 'verify' as const },
        { eyebrow: 'Passo 3', title: 'Apri la guida se i livelli sembrano confusi', description: 'La guida esiste per spiegare insieme pubblicazione ufficiale, preparazione membro e utilità della comunità.', href: '/guide?topic=official-community#official-community', meta: 'Guida • chiarezza • livelli', icon: 'guide' as const },
        { eyebrow: 'Passo 4', title: 'Torna alla preparazione del proprietario se sei il proprietario', description: 'I proprietari dovrebbero lavorare prima da I miei Cane Corso e Profilo, non dalla pagina di verifica.', href: '/my-dogs', meta: 'I miei Cane Corso • profilo • percorso proprietario', icon: 'member' as const },
      ],
    },
  } as const;

  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={t.pages.verify.eyebrow}
      title={t.navigation.verify}
      description={t.pages.verify.description}
      accentLabel={t.pageShell.accentLabel}
      helpHref="/guide?topic=registry#registry"
      helpLabel={t.common.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG verify trust layer"
      visualFit="contain"
      heroChips={locale === 'bg' ? ['Регистър', 'Проверка', 'Сертификат'] : locale === 'it' ? ['Registro', 'Verifica', 'Certificato'] : ['Registry', 'Verify', 'Certificate']}
      heroNote={locale === 'bg' ? 'Тук се проверява само активен публичен сертификатен запис.' : locale === 'it' ? 'Qui viene verificato solo un record certificato pubblico attivo.' : 'Only an active public certificate record is verified here.'}
    >
      <VerifyEntryPanel locale={locale} />
      <SectionContentGuidePanel locale={locale} surface="verify" />
      <InfoPanelGrid eyebrow={copy.contractEyebrow} title={copy.contractTitle} description={copy.contractDescription} cards={copy.contractCards} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} ariaLabel={copy.contractTitle} />
      <InfoPanelGrid eyebrow={copy.journeyEyebrow} title={copy.journeyTitle} description={copy.journeyDescription} cards={copy.journeyCards} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} ariaLabel={copy.journeyTitle} />
    </PageShell>
  );
}
