import { PageShell } from '@/components/page-shell';
import { VerifyEntryPanel } from '@/components/verify-entry-panel';
import { InfoPanelGrid } from '@/components/info-panel-grid';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';

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
        { eyebrow: 'Owner workspace', title: 'Owners prepare long before Verify becomes relevant', description: 'Profile work, review, and publication happen first in the member area.', href: '/my-dogs', meta: 'Owner prep • review • publish', icon: 'member' as const },
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
      contractEyebrow: 'Verify договор',
      contractTitle: 'Verify принадлежи към сертификатното доверие, не към всеки публичен профил',
      contractDescription:
        'Тази страница трябва да прави trust пътя прост: registry публикацията, издаването на сертификат и verify са свързани, но не са една и съща стъпка.',
      contractCards: [
        { eyebrow: 'Регистър', title: 'Един профил може да е публикуван, без да е сертификатен запис', description: 'Публикацията е official публичната профилна стъпка, но сертификатното доверие е по-късно решение.', href: '/registry', meta: 'Публикуван профил • official видимост', icon: 'registry' as const },
        { eyebrow: 'Сертификат', title: 'Сертификатното доверие съществува само когато е активно издадено', description: 'Verify проверява активния сертификатен слой, не частните чернови и не всеки публикуван профил.', href: '/guide?topic=registry#registry', meta: 'Издаден сертификат • активно доверие', icon: 'verify' as const },
        { eyebrow: 'Owner workspace', title: 'Собствениците подготвят дълго преди Verify да стане релевантен', description: 'Работата по профила, review и публикацията се случват първо в членската зона.', href: '/my-dogs', meta: 'Owner подготовка • review • publish', icon: 'member' as const },
        { eyebrow: 'Наръчник', title: 'Наръчникът обяснява как trust слоевете се свързват', description: 'Ползвай наръчника, когато ти трябва цялата картина за registry vs certificate vs community видимост.', href: '/guide?topic=registry#registry', meta: 'Наръчник • trust яснота', icon: 'guide' as const },
      ],
      journeyEyebrow: 'Как да използваш Verify',
      journeyTitle: 'Прост ред за четене на публичния trust слой',
      journeyDescription: 'Verify има повече смисъл, след като потребителят вече разбира registry публикацията и owner подготовката.',
      journeyCards: [
        { eyebrow: 'Стъпка 1', title: 'Започни от публичния регистър', description: 'Разбери official профилния слой, преди да проверяваш сертификатното доверие.', href: '/registry', meta: 'Първо регистърът', icon: 'registry' as const },
        { eyebrow: 'Стъпка 2', title: 'Ползвай Verify само за сертификатни trust въпроси', description: 'Verify не е заместител на търсене за всеки публичен Cane Corso профил.', href: '/verify', meta: 'Сертификатно доверие • verify', icon: 'verify' as const },
        { eyebrow: 'Стъпка 3', title: 'Отвори наръчника, ако слоевете се объркват', description: 'Наръчникът съществува, за да обясни official публикацията, member подготовката и community полезността заедно.', href: '/guide?topic=official-community#official-community', meta: 'Наръчник • яснота • слоеве', icon: 'guide' as const },
        { eyebrow: 'Стъпка 4', title: 'Върни се към owner подготовката, ако ти си собственикът', description: 'Собствениците трябва да работят първо от My Dogs и Profile, не от verify страницата.', href: '/my-dogs', meta: 'My Dogs • profile • owner път', icon: 'member' as const },
      ],
    },
    it: {
      contractEyebrow: 'Contratto Verify',
      contractTitle: 'Verify appartiene alla fiducia del certificato, non a ogni profilo pubblico',
      contractDescription:
        'Questa pagina dovrebbe rendere semplice il percorso di fiducia: pubblicazione nel registry, emissione del certificato e verify sono passaggi collegati ma non identici.',
      contractCards: [
        { eyebrow: 'Registry', title: 'Un profilo può essere pubblicato senza diventare un record certificato', description: 'La pubblicazione è il passo ufficiale del profilo pubblico, ma la fiducia del certificato è una decisione successiva.', href: '/registry', meta: 'Profilo pubblicato • visibilità official', icon: 'registry' as const },
        { eyebrow: 'Certificato', title: 'La fiducia del certificato esiste solo quando viene emessa attivamente', description: 'Verify controlla il layer certificato attivo, non le bozze private e non ogni profilo pubblicato.', href: '/guide?topic=registry#registry', meta: 'Certificato emesso • fiducia attiva', icon: 'verify' as const },
        { eyebrow: 'Owner workspace', title: 'I proprietari preparano molto prima che Verify diventi rilevante', description: 'Lavoro sul profilo, review e pubblicazione avvengono prima nell’area membri.', href: '/my-dogs', meta: 'Preparazione owner • review • publish', icon: 'member' as const },
        { eyebrow: 'Guida', title: 'La guida spiega come si collegano i layer di fiducia', description: 'Usa la guida quando ti serve il quadro completo di registry vs certificate vs visibilità community.', href: '/guide?topic=registry#registry', meta: 'Guida • chiarezza fiducia', icon: 'guide' as const },
      ],
      journeyEyebrow: 'Come usare Verify',
      journeyTitle: 'Un ordine semplice per leggere il layer di fiducia pubblica',
      journeyDescription: 'Verify ha più senso dopo che l’utente ha già capito la pubblicazione nel registry e la preparazione owner.',
      journeyCards: [
        { eyebrow: 'Passo 1', title: 'Inizia dal registry pubblico', description: 'Comprendi il layer profilo official prima di controllare la fiducia del certificato.', href: '/registry', meta: 'Prima il registry', icon: 'registry' as const },
        { eyebrow: 'Passo 2', title: 'Usa Verify solo per domande sulla fiducia del certificato', description: 'Verify non sostituisce la ricerca per ogni profilo Cane Corso pubblico.', href: '/verify', meta: 'Fiducia certificato • verify', icon: 'verify' as const },
        { eyebrow: 'Passo 3', title: 'Apri la guida se i layer sembrano confusi', description: 'La guida esiste per spiegare insieme pubblicazione official, preparazione membro e utilità community.', href: '/guide?topic=official-community#official-community', meta: 'Guida • chiarezza • layer', icon: 'guide' as const },
        { eyebrow: 'Passo 4', title: 'Torna alla preparazione owner se sei il proprietario', description: 'I proprietari dovrebbero lavorare prima da My Dogs e Profile, non dalla pagina verify.', href: '/my-dogs', meta: 'My Dogs • profile • percorso owner', icon: 'member' as const },
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
      heroChips={locale === 'bg' ? ['Регистър', 'Verify', 'Сертификат'] : locale === 'it' ? ['Registro', 'Verify', 'Certificato'] : ['Registry', 'Verify', 'Certificate']}
      heroNote={locale === 'bg' ? 'Тук се проверява само активен публичен сертификатен запис.' : locale === 'it' ? 'Qui viene verificato solo un record certificato pubblico attivo.' : 'Only an active public certificate record is verified here.'}
    >
      <VerifyEntryPanel locale={locale} />
      <InfoPanelGrid eyebrow={copy.contractEyebrow} title={copy.contractTitle} description={copy.contractDescription} cards={copy.contractCards} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} ariaLabel={copy.contractTitle} />
      <InfoPanelGrid eyebrow={copy.journeyEyebrow} title={copy.journeyTitle} description={copy.journeyDescription} cards={copy.journeyCards} actionLabel={locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open'} ariaLabel={copy.journeyTitle} />
    </PageShell>
  );
}
