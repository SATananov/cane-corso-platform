'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { useLocale } from '@/components/locale-provider';
import type { Locale } from '@/lib/i18n';

type EntryScene = {
  kicker: string;
  title: string;
  description: string;
  variant: 'brand' | 'statement' | 'seal';
};

type EntryInfoAudience = {
  title: string;
  description: string;
};

type EntryCopy = {
  enterPlatform: string;
  memberJoin: string;
  partnerJoin: string;
  discoverPlatform: string;
  whoCanParticipate: string;
  closeInfo: string;
  infoEyebrow: string;
  infoTitle: string;
  infoDescription: string;
  infoFootnote: string;
  infoAudiences: EntryInfoAudience[];
  infoExamplesLabel: string;
  infoExamples: string[];
  infoPrimaryCta: string;
  infoSecondaryCta: string;
  infoPartnerCta: string;
  loopLabel: string;
  introLabel: string;
  footerTrademark: string;
  scenes: EntryScene[];
};

const ENTRY_CINEMATIC_COVER = '/brand/entry/usg-global-ecosystem-cover.png' as const;

const entryCopy: Record<Locale, EntryCopy> = {
  en: {
    enterPlatform: 'Enter the platform',
    memberJoin: 'Become a member',
    partnerJoin: 'Apply as a partner',
    discoverPlatform: 'About the platform',
    whoCanParticipate: 'Who can participate',
    closeInfo: 'Close',
    infoEyebrow: 'Cane Corso ecosystem',
    infoTitle: 'Who the platform is for and how trusted access works',
    infoDescription:
      'The platform is built as a curated Cane Corso ecosystem for owners, approved partners, services, and future public listings that stay aligned with the USG standard.',
    infoFootnote:
      'Nothing public appears automatically. Listings, partner profiles, and future ecosystem submissions are reviewed before publication.',
    infoAudiences: [
      {
        title: 'For Cane Corso owners',
        description:
          'Create your member presence, manage your Cane Corso profile, follow registry status, and explore trusted services, places, knowledge, and future community layers.'
      },
      {
        title: 'For partners and businesses',
        description:
          'Veterinary clinics, trainers, breeders, photographers, transport providers, boarding services, shops, and other Cane Corso-related professionals can apply for a profile in the platform ecosystem.'
      },
      {
        title: 'For trust and moderation',
        description:
          'The ecosystem is curated, not open chaos. Admin approval keeps quality, relevance, and a stronger standard for everything shown publicly.'
      },
    ],
    infoExamplesLabel: 'Examples of ecosystem sections',
    infoExamples: [
      'Registry and verification',
      'Partners and services',
      'Transport and relocation',
      'Hotels and boarding',
      'Places to walk and play',
      'Pet-friendly public places'
    ],
    infoPrimaryCta: 'Enter the platform',
    infoSecondaryCta: 'Become a member',
    infoPartnerCta: 'Apply as a partner',
    loopLabel: 'Entrance sequence',
    introLabel: 'Language',
    footerTrademark: 'USG — UNICO SUO GENERE™ by Stefano De Tanini',
    scenes: [
      {
        kicker: 'CANE CORSO PRESENCE',
        title: 'Registry, knowledge, community, and partners — clearly separated',
        description:
          'A unified ecosystem home for registration, knowledge, community, and partnerships. Built for owners, breeders, organizations, and businesses united by the values, discipline, and presence of Cane Corso.',
        variant: 'seal'
      },
      {
        kicker: 'UNICO SUO GENERE',
        title: 'A cinematic gateway to the global Cane Corso ecosystem',
        description:
          'The first screen presents USG as a rare, international Cane Corso world shaped by identity, trust, knowledge, community, and approved partners.',
        variant: 'brand'
      },
      {
        kicker: 'ONE OF A KIND',
        title: 'One image, one atmosphere, one-of-a-kind presence',
        description:
          'The global cover stays as the main cinematic brand universe, while the platform itself remains clean, usable, and protected behind the entrance.',
        variant: 'statement'
      },
    ],
  },
  bg: {
    enterPlatform: 'Влез в платформата',
    memberJoin: 'Стани член',
    partnerJoin: 'Стани партньор',
    discoverPlatform: 'За платформата',
    whoCanParticipate: 'Кой може да участва',
    closeInfo: 'Затвори',
    infoEyebrow: 'Екосистема Cane Corso',
    infoTitle: 'Кой може да участва и как работи включването',
    infoDescription:
      'Платформата е изградена като подбрана Cane Corso екосистема за собственици, одобрени партньори, услуги и бъдещи публични профили, които отговарят на стандарта на USG.',
    infoFootnote:
      'Нищо не се показва публично автоматично. Профили, партньорски кандидатури и бъдещи обяви в екосистемата се преглеждат и одобряват преди публикуване.',
    infoAudiences: [
      {
        title: 'За собственици на Cane Corso',
        description:
          'Създай свое членско присъствие, управлявай профила на своя Cane Corso, следи статуса в регистъра и разглеждай доверени услуги, места, полезна информация и бъдещи общностни секции.'
      },
      {
        title: 'За партньори и бизнеси',
        description:
          'Ветеринарни клиники, треньори, развъдници, фотографи, транспортни услуги, хотели за кучета, магазини и други професионалисти, свързани с Cane Corso, могат да кандидатстват за профил в екосистемата.'
      },
      {
        title: 'За доверие и модерация',
        description:
          'Екосистемата не е отворен хаос. Администраторското одобрение пази качество, релевантност и по-висок стандарт за всичко, което се показва публично.'
      },
    ],
    infoExamplesLabel: 'Примери за секции в екосистемата',
    infoExamples: [
      'Регистър и верификация',
      'Партньори и услуги',
      'Транспорт и преместване',
      'Хотели и настаняване',
      'Места за разходка и игра',
      'Обществени места, подходящи за Cane Corso'
    ],
    infoPrimaryCta: 'Влез в платформата',
    infoSecondaryCta: 'Стани член',
    infoPartnerCta: 'Стани партньор',
    loopLabel: 'Входна поредица',
    introLabel: 'Език',
    footerTrademark: 'USG — UNICO SUO GENERE™ by Stefano De Tanini',
    scenes: [
      {
        kicker: 'ПРИСЪСТВИЕ НА CANE CORSO',
        title: 'Регистър, знания, общност и партньори — ясно разделени',
        description:
          'Единен екосистемен дом за регистрация, знания, общност и партньорства. Изграден за фенове, развъдчици, организации и бизнеси, обединени от ценностите, дисциплината и величието на Cane Corso.',
        variant: 'seal'
      },
      {
        kicker: 'UNICO SUO GENERE',
        title: 'Кинематографичен вход към глобалната Cane Corso екосистема',
        description:
          'Първият екран представя USG като рядък международен Cane Corso свят — с идентичност, доверие, знания, общност и одобрени партньори.',
        variant: 'brand'
      },
      {
        kicker: 'ЕДИНСТВЕН ПО РОДА СИ',
        title: 'Една визия, една атмосфера, единствено по рода си присъствие',
        description:
          'Глобалната cover визия остава главният визуален свят на бранда, а самата платформа запазва чиста, използваема и защитена структура след входа.',
        variant: 'statement'
      },
    ],
  },
  it: {
    enterPlatform: 'Entra nella piattaforma',
    memberJoin: 'Diventa membro',
    partnerJoin: 'Candidati come partner',
    discoverPlatform: 'Informazioni sulla piattaforma',
    whoCanParticipate: 'Chi può partecipare',
    closeInfo: 'Chiudi',
    infoEyebrow: 'Ecosistema Cane Corso',
    infoTitle: 'Chi può partecipare e come funziona l’inclusione',
    infoDescription:
      'La piattaforma è costruita come un ecosistema Cane Corso selezionato per proprietari, partner approvati, servizi e futuri profili pubblici in linea con lo standard USG.',
    infoFootnote:
      'Nulla viene mostrato pubblicamente in modo automatico. Profili, candidature partner e futuri inserimenti nell’ecosistema vengono esaminati e approvati prima della pubblicazione.',
    infoAudiences: [
      {
        title: 'Per i proprietari di Cane Corso',
        description:
          'Crea la tua presenza come membro, gestisci il profilo del tuo Cane Corso, segui lo stato nel registro ed esplora servizi affidabili, luoghi, contenuti utili e future sezioni della comunità.'
      },
      {
        title: 'Per partner e attività',
        description:
          'Cliniche veterinarie, addestratori, allevamenti, fotografi, servizi di trasporto, pensioni per cani, negozi e altri professionisti legati al Cane Corso possono candidarsi per un profilo nell’ecosistema.'
      },
      {
        title: 'Per fiducia e moderazione',
        description:
          'L’ecosistema non è uno spazio aperto senza filtro. L’approvazione amministrativa tutela qualità, pertinenza e uno standard più alto per tutto ciò che viene mostrato pubblicamente.'
      },
    ],
    infoExamplesLabel: 'Esempi di sezioni dell’ecosistema',
    infoExamples: [
      'Registro e verifica',
      'Partner e servizi',
      'Trasporto e trasferimento',
      'Hotel e pensioni',
      'Luoghi per passeggiare e giocare',
      'Luoghi pubblici adatti al Cane Corso'
    ],
    infoPrimaryCta: 'Entra nella piattaforma',
    infoSecondaryCta: 'Diventa membro',
    infoPartnerCta: 'Candidati come partner',
    loopLabel: 'Sequenza di ingresso',
    introLabel: 'Lingua',
    footerTrademark: 'USG — UNICO SUO GENERE™ by Stefano De Tanini',
    scenes: [
      {
        kicker: 'PRESENZA CANE CORSO',
        title: 'Registro, conoscenza, comunità e partner — separati con chiarezza',
        description:
          'Una casa ecosistemica unificata per registrazione, conoscenza, comunità e partnership. Costruita per proprietari, allevatori, organizzazioni e attività unite dai valori, dalla disciplina e dalla presenza del Cane Corso.',
        variant: 'seal'
      },
      {
        kicker: 'UNICO SUO GENERE',
        title: 'Un ingresso cinematografico nell’ecosistema Cane Corso globale',
        description:
          'La prima schermata presenta USG come un mondo Cane Corso internazionale, raro, fondato su identità, fiducia, conoscenza, comunità e partner approvati.',
        variant: 'brand'
      },
      {
        kicker: 'ONE OF A KIND',
        title: 'Un’immagine, un’atmosfera, una presenza unica',
        description:
          'La cover globale resta l’universo visivo principale, mentre la piattaforma rimane pulita, usabile e protetta dopo l’ingresso.',
        variant: 'statement'
      },
    ],
  },
};


const entryNavItems = [
  { href: '/platform', labels: { en: 'Home', bg: 'Начало', it: 'Inizio' } },
  { href: '/registry', labels: { en: 'Registry', bg: 'Регистър', it: 'Registro' } },
  { href: '/gallery', labels: { en: 'Gallery', bg: 'Галерия', it: 'Galleria' } },
  { href: '/knowledge', labels: { en: 'Knowledge', bg: 'Знания', it: 'Conoscenza' } },
  { href: '/partners', labels: { en: 'Partners', bg: 'Партньори', it: 'Partner' } },
  { href: '/community', labels: { en: 'Community', bg: 'Общност', it: 'Comunità' } },
] as const;

export function EntryExperience() {
  const { locale, dictionary } = useLocale();
  const copy = entryCopy[locale];
  const [activeScene, setActiveScene] = useState(0);

  // Step 31.2: keep the approved registry/knowledge/community/partners scene as the first impression.
  // The supporting cinematic scenes remain available through the manual brand pills below.

  const indicators = useMemo(
    () => copy.scenes.map((scene) => scene.kicker),
    [copy.scenes],
  );
  return (
    <main className="entry-page">
      <div className="entry-page__backdrop" />
      <div className="entry-page__grain" />

      <div className="entry-page__topbar">
        <Link className="entry-mini-brand entry-mini-brand--lockup" href="/" aria-label={dictionary.site.brandTitle}>
          <span className="entry-mini-brand__seal">USG</span>
          <span className="entry-mini-brand__text">
            <span className="entry-mini-brand__eyebrow">{dictionary.site.brandEyebrow}</span>
            <span className="entry-mini-brand__title">{dictionary.site.brandTitle}</span>
            <span className="entry-mini-brand__subline">Global Cane Corso Ecosystem</span>
          </span>
        </Link>

        <nav className="entry-page__nav" aria-label="Entry navigation">
          {entryNavItems.map((item, index) => (
            <Link
              key={item.href}
              className={`entry-page__nav-link${index === 0 ? ' is-active' : ''}`}
              href={item.href}
            >
              {item.labels[locale]}
            </Link>
          ))}
        </nav>

        <div className="entry-page__locale-cluster">
          <Link className="entry-page__login" href="/access">{dictionary.common.signIn}</Link>
          <LocaleSwitcher />
        </div>
      </div>

      <section className="entry-stage entry-stage--global-cover" aria-label={copy.loopLabel}>
        <div className="entry-stage__cinematic-cover" aria-hidden="true">
          <Image
            src={ENTRY_CINEMATIC_COVER}
            alt=""
            fill
            sizes="100vw"
            className="entry-stage__cinematic-cover-image"
            priority
          />
        </div>

        <div className="entry-stage__scenes" aria-hidden="true">
          {copy.scenes.map((scene, index) => (
            <div
              key={scene.kicker}
              className={`entry-stage__scene entry-stage__scene--${scene.variant}${index === activeScene ? ' is-active' : ''}`}
            >
              <div className="entry-stage__scene-tone" />
              <div className="entry-stage__visual-glow" />
            </div>
          ))}
        </div>

        <div className="entry-stage__overlay" />
        <div className="entry-stage__content">
          <div className="entry-stage__copy" aria-live="polite">
            <span className="entry-stage__kicker">{copy.scenes[activeScene].kicker}</span>
            <h1 className="entry-stage__title">{copy.scenes[activeScene].title}</h1>
            <p className="entry-stage__description">{copy.scenes[activeScene].description}</p>
          </div>

          <div className="entry-stage__actions">
            <Link className="btn btn--primary entry-stage__button" href="/platform">
              {copy.enterPlatform}
            </Link>
            <Link className="btn btn--secondary entry-stage__button" href="/access?intent=member">
              {copy.memberJoin}
            </Link>
            <Link className="btn btn--secondary entry-stage__button" href="/access?intent=partner">
              {copy.partnerJoin}
            </Link>
            <Link className="btn btn--ghost entry-stage__button entry-stage__button--info" href="/guide?topic=overview#overview">
              {copy.discoverPlatform}
            </Link>
            <Link className="btn btn--ghost entry-stage__button entry-stage__button--info" href="/platform#participants">
              {copy.whoCanParticipate}
            </Link>
          </div>

          <p className="entry-stage__helper">{copy.infoFootnote}</p>

          <div className="entry-stage__indicators">
            {indicators.map((label, index) => (
              <button
                type="button"
                key={label}
                className={`entry-stage__indicator${index === activeScene ? ' is-active' : ''}`}
                onClick={() => setActiveScene(index)}
                aria-pressed={index === activeScene}
              >
                <span className="entry-stage__indicator-line" />
                <span className="entry-stage__indicator-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>


      <footer className="entry-page__footer">{copy.footerTrademark}</footer>
    </main>
  );
}
