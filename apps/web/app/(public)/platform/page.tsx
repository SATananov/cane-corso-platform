import Image from 'next/image';
import Link from 'next/link';
import { SectionCard } from '@/components/section-card';
import { UsgIdentityBulgaricoPanel } from '@/components/usg-identity-bulgarico-panel';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';

export default async function PlatformPage() {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const currentSession = await getOptionalCookieMemberSession();

  const communityFallbackByLocale = {
    en: {
      eyebrow: 'Community layer',
      title: 'A living Cane Corso world inside the platform',
      description: 'The platform should grow beyond registry presentation into a refined Cane Corso ecosystem.',
    },
    bg: {
      eyebrow: 'Общностен слой',
      title: 'Жив Cane Corso свят вътре в платформата',
      description: 'Платформата може да расте отвъд регистъра към премиум Cane Corso екосистема.',
    },
    it: {
      eyebrow: 'Livello community',
      title: 'Un mondo Cane Corso vivo dentro la piattaforma',
      description: 'La piattaforma può crescere oltre il registro, verso un ecosistema Cane Corso raffinato.',
    },
  } as const;
  const communityFallback = communityFallbackByLocale[locale] ?? communityFallbackByLocale.en;
  const communityEyebrow = t.home.communityEyebrow ?? communityFallback.eyebrow;
  const communityTitle = t.home.communityTitle ?? communityFallback.title;
  const communityDescription = t.home.communityDescription ?? communityFallback.description;
  const communityLayers = t.home.communityLayers ?? [];

  const structureCopyByLocale = {
    en: {
      eyebrow: 'Master plan structure',
      title: 'Official trust, community usefulness, and clear help',
      description:
        'The next evolution of the platform is a clearer product map: official trust pages, community growth pages, and a central guide so users understand what each zone does.',
      cards: [
        {
          eyebrow: 'Official layer',
          title: 'Registry, verify, and publication trust',
          description: 'The official product core remains the registry, certificate verification, and moderated publication quality.',
          href: '/registry',
          meta: 'Official • trust • publication',
        },
        {
          eyebrow: 'Community layer',
          title: 'Places, services, transport, activity',
          description: 'The broader ecosystem grows through a moderated community layer for useful Cane Corso visibility and future activity.',
          href: '/community',
          meta: 'Community • places • future activity',
        },
        {
          eyebrow: 'Help system',
          title: 'A guide so users do not get lost',
          description: 'Every major page should point back to a clear help guide explaining official vs community, access, and how publication works.',
          href: '/guide',
          meta: 'Guide • access • explanation',
        },
      ],
    },
    bg: {
      eyebrow: 'Структура по MASTER ПЛАНА',
      title: 'Официално доверие, общностна полезност и ясна помощ',
      description:
        'Следващата еволюция на платформата е по-ясна продуктова карта: официални страници на доверие, общностни страници за полезност и централен наръчник, за да разбира потребителят какво прави всяка зона.',
      cards: [
        {
          eyebrow: 'Официален слой',
          title: 'Регистър, проверка и доверено публикуване',
          description: 'Официалното продуктово ядро остава регистърът, сертификатната проверка и модерираното качество на публикуване.',
          href: '/registry',
          meta: 'Официално • доверие • публикуване',
        },
        {
          eyebrow: 'Общностен слой',
          title: 'Места, услуги, транспорт, активност',
          description: 'По-широката екосистема расте чрез модериран общностен слой за полезна Cane Corso видимост и бъдеща активност.',
          href: '/community',
          meta: 'Общност • места • бъдеща активност',
        },
        {
          eyebrow: 'Система за помощ',
          title: 'Наръчник, за да не се лута потребителят',
          description: 'Всяка основна страница трябва да води към ясен помощен наръчник, който обяснява официалния и общностния слой, достъпа и пътя към публикуване.',
          href: '/guide',
          meta: 'Наръчник • достъп • обяснения',
        },
      ],
    },
    it: {
      eyebrow: 'Struttura del MASTER PLAN',
      title: 'Fiducia ufficiale, community utile e guida chiara',
      description:
        'La prossima evoluzione della piattaforma è una mappa più chiara: pagine ufficiali di fiducia, aree community utili e una guida centrale per capire ogni zona.',
      cards: [
        {
          eyebrow: 'Livello ufficiale',
          title: 'Registro, verifica e fiducia pubblica',
          description: 'Il nucleo del prodotto resta il registro, la verifica del certificato e la qualità della pubblicazione moderata.',
          href: '/registry',
          meta: 'Ufficiale • fiducia • pubblicazione',
        },
        {
          eyebrow: 'Livello community',
          title: 'Luoghi, servizi, trasporto e attività',
          description: 'L’ecosistema cresce tramite una community moderata, utile per dare visibilità reale al mondo Cane Corso.',
          href: '/community',
          meta: 'Community • luoghi • attività futura',
        },
        {
          eyebrow: 'Sistema di aiuto',
          title: 'Una guida chiara per non perdersi',
          description: 'Ogni pagina principale dovrebbe rimandare a una guida semplice su livelli ufficiali, community, accesso e pubblicazione.',
          href: '/guide',
          meta: 'Guida • accesso • spiegazione',
        },
      ],
    },
  } as const;
  const structureCopy = structureCopyByLocale[locale] ?? structureCopyByLocale.en;


  const roleGuidanceByLocale = {
    en: {
      helpAction: 'Help for this page',
      rolesEyebrow: 'Guest • member • partner',
      rolesTitle: 'Choose the right entry path before you go deeper',
      rolesDescription:
        'This public platform page is the orientation hub. It helps visitors understand what they can explore now, what requires an account, and how approval works before anything becomes visible.',
      guest: {
        eyebrow: 'Guest',
        title: 'Explore the public side without registration',
        description: 'Browse registry, verify, guide, partners, and community pages to understand the platform before you create an account.',
        href: '/registry',
        action: 'Explore registry',
      },
      member: {
        eyebrow: 'Member',
        title: 'Create a profile and prepare your Cane Corso',
        description: 'Members get access to profile tools, My Cane Corso, submission flow, and deeper private workspace actions before review.',
        joinAction: 'Become a member',
        enterAction: 'Enter member area',
      },
      partner: {
        eyebrow: 'Partner',
        title: 'Apply as a clinic, trainer, service, or business',
        description: 'Partners join through an application flow. Public partner presence appears only after review and approval.',
        href: '/access?intent=partner',
        action: 'Partner access',
      },
      help: {
        eyebrow: 'Help for this page',
        title: 'What this page does before you move deeper',
        description:
          'This is the public welcome hub of the platform. It is designed to orient guests first, then guide members and partners toward the correct entry path.',
        bullets: [
          'You can explore public pages without registration: registry, verify, guide, partners, and community sections.',
          'Member and partner actions unlock personal profiles, submissions, and applications, but nothing becomes public automatically.',
          'Every public profile, partner application, and future ecosystem listing goes through review before visibility.',
          'Official trust pages and community usefulness pages work together, but they should not be confused with each other.',
        ],
      },
      path: {
        eyebrow: 'Recommended first path',
        title: 'Where a new visitor should start',
        description: 'Follow this order if this is your first time here.',
        steps: [
          'Start with the registry and verify pages to understand the official trust layer.',
          'Open the platform guide if you want the full explanation of official vs community, roles, and publication flow.',
          'Choose member access if you want to add your Cane Corso, or partner access if you want a professional presence in the ecosystem.',
        ],
        actions: [
          { href: '/registry', label: 'Registry' },
          { href: '/verify', label: 'Verify' },
          { href: '/guide?topic=overview#overview', label: 'Platform guide' },
        ],
      },
    },
    bg: {
      helpAction: 'Помощ за тази страница',
      rolesEyebrow: 'Гост • член • партньор',
      rolesTitle: 'Избери правилния вход, преди да продължиш по-надълбоко',
      rolesDescription:
        'Тази публична страница е ориентационният вход на платформата. Тя помага на посетителя да разбере какво може да разглежда веднага, какво изисква акаунт и как работи одобрението, преди нещо да стане видимо.',
      guest: {
        eyebrow: 'Гост',
        title: 'Разглеждай публичната част',
        description: 'Можеш да разглеждаш регистъра, проверката, наръчника, партньорите и общностните секции, преди да си направиш акаунт.',
        href: '/registry',
        action: 'Към регистъра',
      },
      member: {
        eyebrow: 'Член',
        title: 'Създай профил за своя Cane Corso',
        description: 'Членският достъп отключва профил, Моите Cane Corso, подаване за преглед и лична зона преди публикуване.',
        joinAction: 'Стани член',
        enterAction: 'Влез в членската зона',
      },
      partner: {
        eyebrow: 'Партньор',
        title: 'Кандидатствай като партньор',
        description: 'Партньорите влизат през кандидатстване. Публичното партньорско присъствие се появява само след преглед и одобрение.',
        href: '/access?intent=partner',
        action: 'Към партньорите',
      },
      help: {
        eyebrow: 'Помощ за тази страница',
        title: 'Какво прави тази страница, преди да продължиш',
        description:
          'Това е публичната ориентационна точка на платформата. Тя първо ориентира госта, а после насочва члена и партньора към правилния вход.',
        bullets: [
          'Публичните страници могат да се разглеждат без регистрация: регистър, проверка, наръчник, партньори и общностни секции.',
          'Членските и партньорските действия отключват профили, подаване и кандидатстване, но нищо не става публично автоматично.',
          'Всеки публичен профил, партньорска кандидатура и бъдеща обява в екосистемата минава през преглед преди видимост.',
          'Официалните страници на доверие и общностната полезност работят заедно, но не трябва да се смесват.',
        ],
      },
      path: {
        eyebrow: 'Препоръчан първи път',
        title: 'Откъде е най-добре да започне новият посетител',
        description: 'Следвай този ред, ако влизаш за първи път.',
        steps: [
          'Започни с регистъра и страницата за проверка, за да разбереш официалния слой на доверие.',
          'Отвори наръчника на платформата, ако искаш пълното обяснение за официалния и общностния слой, ролите и пътя към публикуване.',
          'Избери членски достъп, ако искаш да добавиш своя Cane Corso, или партньорски достъп, ако искаш професионално присъствие в екосистемата.',
        ],
        actions: [
          { href: '/registry', label: 'Регистър' },
          { href: '/verify', label: 'Проверка' },
          { href: '/guide?topic=overview#overview', label: 'За платформата' },
        ],
      },
    },
    it: {
      helpAction: 'Aiuto per questa pagina',
      rolesEyebrow: 'Ospite • membro • partner',
      rolesTitle: 'Scegli il percorso giusto prima di entrare più in profondità',
      rolesDescription:
        'Questa pagina pubblica orienta il visitatore: cosa può esplorare subito, cosa richiede un account e come funziona l’approvazione prima della visibilità.',
      guest: {
        eyebrow: 'Ospite',
        title: 'Esplora il lato pubblico',
        description: 'Puoi esplorare registro, verifica, guida, partner e community prima di creare un account.',
        href: '/registry',
        action: 'Esplora il registro',
      },
      member: {
        eyebrow: 'Membro',
        title: 'Crea il profilo del tuo Cane Corso',
        description: 'L’accesso membro apre profilo, I miei Cane Corso, invii per revisione e uno spazio privato prima della pubblicazione.',
        joinAction: 'Diventa membro',
        enterAction: 'Apri area membri',
      },
      partner: {
        eyebrow: 'Partner',
        title: 'Candidati come partner professionale',
        description: 'La presenza pubblica dei partner appare solo dopo revisione e approvazione.',
        href: '/access?intent=partner',
        action: 'Accesso partner',
      },
      help: {
        eyebrow: 'Aiuto per questa pagina',
        title: 'Cosa fa questa pagina prima di andare oltre',
        description:
          'Questo è il punto di orientamento pubblico della piattaforma. È pensato per orientare prima l’ospite e poi guidare membro e partner verso il percorso corretto.',
        bullets: [
          'Le pagine pubbliche possono essere esplorate senza registrazione: registro, verifica, guida, partner e sezioni community.',
          'Le azioni membro e partner sbloccano profili, invii e candidature, ma nulla diventa pubblico automaticamente.',
          'Ogni profilo pubblico, candidatura partner e futuro listing dell’ecosistema passa in revisione prima della visibilità.',
          'Le pagine ufficiali di fiducia e le aree community lavorano insieme, ma non devono essere confuse.',
        ],
      },
      path: {
        eyebrow: 'Primo percorso consigliato',
        title: 'Dove dovrebbe iniziare un nuovo visitatore',
        description: 'Segui quest’ordine se è la tua prima visita qui.',
        steps: [
          'Inizia dal registro e dalla verifica per capire il livello ufficiale di fiducia.',
          'Apri la guida della piattaforma per capire livello ufficiale, community, ruoli e flusso di pubblicazione.',
          'Scegli l’accesso membro se vuoi aggiungere il tuo Cane Corso, oppure l’accesso partner se vuoi una presenza professionale nell’ecosistema.',
        ],
        actions: [
          { href: '/registry', label: 'Registro' },
          { href: '/verify', label: 'Verifica' },
          { href: '/guide?topic=overview#overview', label: 'Guida piattaforma' },
        ],
      },
    },
  } as const;
  const roleGuidance = roleGuidanceByLocale[locale] ?? roleGuidanceByLocale.en;
  const memberActionHref = currentSession ? '/my-dogs' : '/access?intent=member';
  const memberActionLabel = currentSession ? roleGuidance.member.enterAction : roleGuidance.member.joinAction;

  const publicTrustByLocale = {
    en: {
      eyebrow: 'Public experience map',
      title: 'One public journey, four clear trust doors',
      description:
        'The first public experience should feel unified: official registry presence, certificate verification, useful knowledge, and the curated USG showcase all point back to the same trust system.',
      sealTitle: 'Official USG seal',
      sealText: 'Used only for verified trust surfaces, certificates, selected profiles, and official platform identity.',
      cards: [
        { href: '/registry', label: 'Registry', text: 'Public Cane Corso identity and publication layer.' },
        { href: '/verify', label: 'Verify', text: 'Independent certificate confirmation path.' },
        { href: '/knowledge', label: 'Knowledge', text: 'Owner guidance and breed education layer.' },
        { href: '/gallery', label: 'Gallery', text: 'Admin-curated USG showcase for selected certified profiles.' },
      ],
    },
    bg: {
      eyebrow: 'Карта на публичното преживяване',
      title: 'Един публичен път, четири ясни входа на доверие',
      description:
        'Първото публично преживяване трябва да се усеща като една система: официален регистър, проверка на сертификат, полезни знания и подбрана USG витрина, свързани от един и същ слой на доверие.',
      sealTitle: 'Официален USG печат',
      sealText: 'Използва се само при доверени повърхности, сертификати, отличени профили и официалната идентичност на платформата.',
      cards: [
        { href: '/registry', label: 'Регистър', text: 'Публична идентичност и слой за публикуване на Cane Corso.' },
        { href: '/verify', label: 'Проверка', text: 'Самостоятелен път за потвърждаване на сертификат.' },
        { href: '/knowledge', label: 'Знания', text: 'Насоки за собственици и образователен слой за породата.' },
        { href: '/gallery', label: 'Галерия', text: 'Подбрана USG витрина за избрани сертифицирани профили.' },
      ],
    },
    it: {
      eyebrow: 'Mappa esperienza pubblica',
      title: 'Un percorso pubblico, quattro porte di fiducia chiare',
      description:
        'La prima esperienza pubblica deve sembrare un sistema unico: registro ufficiale, verifica certificato, conoscenza utile e showcase USG curato, collegati dallo stesso livello di fiducia.',
      sealTitle: 'Sigillo ufficiale USG',
      sealText: 'Usato solo per superfici di fiducia, certificati, profili selezionati e identità ufficiale della piattaforma.',
      cards: [
        { href: '/registry', label: 'Registro', text: 'Identità pubblica Cane Corso e layer di pubblicazione.' },
        { href: '/verify', label: 'Verifica', text: 'Percorso indipendente per confermare il certificato.' },
        { href: '/knowledge', label: 'Conoscenza', text: 'Guida owner e layer educativo sulla razza.' },
        { href: '/gallery', label: 'Galleria', text: 'Showcase USG curato per profili certificati selezionati.' },
      ],
    },
  } as const;
  const publicTrust = publicTrustByLocale[locale] ?? publicTrustByLocale.en;

  return (
    <main className="home-shell home-shell--platform">
      <section className="hero hero--signature hero--platform-home">
        <div className="hero__content">
          <div className="hero__eyebrow">{t.home.eyebrow}</div>

          <div className="hero__badge-row">
            <span className="hero-badge">{t.home.badgeA}</span>
            <span className="hero-badge">{t.home.badgeB}</span>
            <span className="hero-badge">{t.home.badgeC}</span>
            <span className="hero-badge">{t.home.badgeD}</span>
          </div>

          <h1 className="hero__title">{t.home.title}</h1>
          <p className="hero__subtitle">{t.home.subtitle}</p>

          <div className="hero__actions">
            {currentSession ? (
              <>
                <Link className="btn btn--primary" href="/my-dogs">
                  {t.common.enterMemberArea}
                </Link>
                <Link className="btn btn--secondary" href="/registry">
                  {t.common.exploreRegistry}
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn--primary" href="/access?intent=member">
                  {t.common.joinMember}
                </Link>
                <Link className="btn btn--secondary" href="/access?intent=partner">
                  {t.common.joinPartner}
                </Link>
                <Link className="btn button-ghost" href="/registry">
                  {t.common.exploreRegistry}
                </Link>
              </>
            )}
            <Link className="btn button-ghost" href="#platform-help">
              {roleGuidance.helpAction}
            </Link>
          </div>

          {!currentSession ? (
            <p className="hero__helper hero__helper--access">
              {locale === 'bg'
                ? 'Вече имаш акаунт? Използвай Вход от хедъра или отвори членския достъп, за да продължиш по-надълбоко.'
                : locale === 'it'
                  ? "Hai già un account? Usa Accedi dall'header oppure apri l'accesso membro per continuare più in profondità."
                  : 'Already have an account? Use Sign in from the header or open member access to continue deeper.'}
            </p>
          ) : null}
        </div>

        <div className="hero__visual-column">
          <div className="hero-brand-panel hero-brand-panel--editorial">
            <div className="hero-brand-panel__image-wrap">
              <Image src="/brand/editorial-platform-heritage.png" alt="Cane Corso heritage platform visual" width={1400} height={1050} className="hero-brand-panel__image" priority />
            </div>
            <div className="hero-brand-panel__copy">
              <span className="hero-brand-panel__eyebrow">{t.home.heroCardEyebrow}</span>
              <h2>{t.home.heroCardTitle}</h2>
              <p>{t.home.heroCardText}</p>
            </div>
          </div>
        </div>

        <div className="hero__fullwidth hero__fullwidth--platform">
          <div className="platform-role-guide">
            <div className="platform-role-guide__header">
              <span className="eyebrow-label">{roleGuidance.rolesEyebrow}</span>
              <h2>{roleGuidance.rolesTitle}</h2>
              <p>{roleGuidance.rolesDescription}</p>
            </div>

            <div className="platform-role-guide__grid">
              <article className="platform-role-guide__card">
                <span className="eyebrow-label">{roleGuidance.guest.eyebrow}</span>
                <h3>{roleGuidance.guest.title}</h3>
                <p>{roleGuidance.guest.description}</p>
                <Link className="button-ghost small" href={roleGuidance.guest.href}>
                  {roleGuidance.guest.action}
                </Link>
              </article>

              <article className={`platform-role-guide__card${currentSession ? ' is-current' : ''}`}>
                <span className="eyebrow-label">{roleGuidance.member.eyebrow}</span>
                <h3>{roleGuidance.member.title}</h3>
                <p>{roleGuidance.member.description}</p>
                <Link className="button-ghost small" href={memberActionHref}>
                  {memberActionLabel}
                </Link>
              </article>

              <article className="platform-role-guide__card">
                <span className="eyebrow-label">{roleGuidance.partner.eyebrow}</span>
                <h3>{roleGuidance.partner.title}</h3>
                <p>{roleGuidance.partner.description}</p>
                <Link className="button-ghost small" href={roleGuidance.partner.href}>
                  {roleGuidance.partner.action}
                </Link>
              </article>
            </div>
          </div>

          <div className="hero-stats" aria-label="Platform highlights">
            <article className="hero-stat-card">
              <div className="hero-stat-card__value">{t.home.statAValue}</div>
              <div className="hero-stat-card__label">{t.home.statALabel}</div>
            </article>
            <article className="hero-stat-card">
              <div className="hero-stat-card__value">{t.home.statBValue}</div>
              <div className="hero-stat-card__label">{t.home.statBLabel}</div>
            </article>
            <article className="hero-stat-card">
              <div className="hero-stat-card__value">{t.home.statCValue}</div>
              <div className="hero-stat-card__label">{t.home.statCLabel}</div>
            </article>
          </div>
        </div>
      </section>


      <section className="section-block section-block--public-experience" aria-label={publicTrust.title}>
        <div className="public-experience-band">
          <div className="public-experience-band__seal" aria-hidden="true">
            <Image src="/brand/seal/usg-official-seal-compact.png" alt="" width={128} height={128} />
          </div>
          <div className="public-experience-band__copy">
            <span className="eyebrow-label">{publicTrust.eyebrow}</span>
            <h2>{publicTrust.title}</h2>
            <p>{publicTrust.description}</p>
          </div>
          <div className="public-experience-band__seal-copy">
            <strong>{publicTrust.sealTitle}</strong>
            <span>{publicTrust.sealText}</span>
          </div>
          <div className="public-experience-band__links">
            {publicTrust.cards.map((card) => (
              <Link href={card.href} className="public-experience-link" key={card.href}>
                <strong>{card.label}</strong>
                <span>{card.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <UsgIdentityBulgaricoPanel locale={locale} variant="platform" />

      <section className="section-block section-block--support section-block--support-home" id="platform-help" aria-label="Platform help and role guidance">
        <div className="section-block__header">
          <div className="section-block__eyebrow">{roleGuidance.help.eyebrow}</div>
          <h2 className="section-block__title">{roleGuidance.help.title}</h2>
          <p className="section-block__description">{roleGuidance.help.description}</p>
        </div>

        <div className="platform-help-grid">
          <article className="platform-help-panel">
            <span className="platform-help-panel__eyebrow">{roleGuidance.help.eyebrow}</span>
            <h3>{roleGuidance.help.title}</h3>
            <ul className="platform-help-list">
              {roleGuidance.help.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>

          <article className="platform-help-panel platform-help-panel--path">
            <span className="platform-help-panel__eyebrow">{roleGuidance.path.eyebrow}</span>
            <h3>{roleGuidance.path.title}</h3>
            <p>{roleGuidance.path.description}</p>

            <ol className="platform-help-steps">
              {roleGuidance.path.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <div className="platform-help-actions">
              {roleGuidance.path.actions.map((action) => (
                <Link key={action.href} className="button-ghost small" href={action.href}>
                  {action.label}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-block section-block--statement" aria-label="Brand philosophy">
        <div className="section-block__header">
          <div className="section-block__eyebrow">{t.home.statementEyebrow}</div>
          <h2 className="section-block__title">{t.home.statementTitle}</h2>
          <p className="section-block__description">{t.home.statementDescription}</p>
        </div>

        <div className="statement-panel">
          <div className="statement-panel__media">
            <Image src="/brand/statements/one-of-a-kind.png" alt="ONE OF A KIND statement" width={420} height={420} />
          </div>
          <div className="statement-panel__brand-column">
            <div className="statement-panel__seal-brand">
              <Image src="/brand/primary/logo.jpg" alt="UNICO SUO GENERE premium identity" width={300} height={300} />
            </div>
            <div className="statement-panel__seal-copy">
              <span className="hero-brand-panel__eyebrow">{t.home.heroCardEyebrow}</span>
              <p>{t.home.statementDescription}</p>
              <div className="statement-chip-row">
                <span className="statement-chip">{t.home.badgeA}</span>
                <span className="statement-chip">{t.home.badgeB}</span>
                <span className="statement-chip">{t.home.badgeC}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" aria-label="Platform pillars">
        <div className="section-block__header">
          <div className="section-block__eyebrow">{t.home.pillarsEyebrow}</div>
          <h2 className="section-block__title">{t.home.pillarsTitle}</h2>
          <p className="section-block__description">{t.home.pillarsDescription}</p>
        </div>

        <div className="section-card-grid section-card-grid--three">
          {(t.home.pillars ?? []).map((pillar: any) => (
            <SectionCard key={pillar.title} {...pillar} actionLabel={t.common.openSection} />
          ))}
        </div>
      </section>

      <section className="section-block" aria-label="Application zones">
        <div className="section-block__header">
          <div className="section-block__eyebrow">{t.home.zonesEyebrow}</div>
          <h2 className="section-block__title">{t.home.zonesTitle}</h2>
          <p className="section-block__description">{t.home.zonesDescription}</p>
        </div>

        <div className="section-card-grid section-card-grid--three">
          {(t.home.zones ?? []).map((zone: any) => (
            <SectionCard key={zone.title} {...zone} actionLabel={t.common.openSection} />
          ))}
        </div>
      </section>


      <section className="section-block" aria-label="Platform structure">
        <div className="section-block__header">
          <div className="section-block__eyebrow">{structureCopy.eyebrow}</div>
          <h2 className="section-block__title">{structureCopy.title}</h2>
          <p className="section-block__description">{structureCopy.description}</p>
        </div>

        <div className="section-card-grid section-card-grid--three">
          {structureCopy.cards.map((card: any) => (
            <SectionCard key={card.title} {...card} actionLabel={t.common.openSection} />
          ))}
        </div>
      </section>

      <section className="section-block section-block--community" aria-label="Community layers">
        <div className="section-block__header">
          <div className="section-block__eyebrow">{communityEyebrow}</div>
          <h2 className="section-block__title">{communityTitle}</h2>
          <p className="section-block__description">{communityDescription}</p>
        </div>

        <div className="section-card-grid section-card-grid--three">
          {communityLayers.map((layer: any) => (
            <SectionCard key={layer.title} {...layer} actionLabel={t.common.learnMore} />
          ))}
        </div>
      </section>
    </main>
  );
}
