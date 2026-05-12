'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

type JourneyVariant = 'public' | 'member' | 'myDogsEmpty';

type JourneySlide = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  imageSrc: string;
  imageAlt: string;
  meta: string;
};

type JourneyCopy = {
  eyebrow: string;
  title: string;
  description: string;
  progressLabel: string;
  previousLabel: string;
  nextLabel: string;
  slides: JourneySlide[];
};

type JourneyCopyByVariant = Record<JourneyVariant, JourneyCopy>;

const copyByLocale: Record<Locale, JourneyCopyByVariant> = {
  en: {
    public: {
      eyebrow: 'First path through USG',
      title: 'Start your Cane Corso journey in USG',
      description:
        'A calm visual path for guests: verify trust, explore knowledge, discover community, and create a private profile only when ready.',
      progressLabel: 'Guest journey slide',
      previousLabel: 'Previous step',
      nextLabel: 'Next step',
      slides: [
        {
          eyebrow: 'Trust check',
          title: 'Check a Cane Corso certificate or profile',
          description:
            'Use Verify when you already have a code or public reference. It keeps official trust separate from community content.',
          href: '/verify',
          actionLabel: 'Open Verify',
          secondaryHref: '/faq',
          secondaryLabel: 'How trust works',
          imageSrc: '/brand/seal/usg-official-seal-compact.png',
          imageAlt: '',
          meta: 'Verify • official trust',
        },
        {
          eyebrow: 'Public registry',
          title: 'Explore published Cane Corso profiles',
          description:
            'The Registry is the official public layer. Profiles appear there only after human review and publication.',
          href: '/registry',
          actionLabel: 'Browse Registry',
          secondaryHref: '/certified',
          secondaryLabel: 'Certified archive',
          imageSrc: '/brand/entry/usg-corso-presence.jpg',
          imageAlt: '',
          meta: 'Registry • reviewed profiles',
        },
        {
          eyebrow: 'Breed knowledge',
          title: 'Learn before you submit anything',
          description:
            'Read history, standard orientation, owner guidance, and USG educational notes before preparing a profile.',
          href: '/knowledge',
          actionLabel: 'Open Knowledge',
          secondaryHref: '/guide?topic=overview#overview',
          secondaryLabel: 'Platform guide',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Knowledge • education',
        },
        {
          eyebrow: 'Community and services',
          title: 'Find useful places, requests, and services',
          description:
            'The community layer helps owners orient themselves without confusing it with official Registry authority.',
          href: '/community',
          actionLabel: 'Open Community',
          secondaryHref: '/partners',
          secondaryLabel: 'View partners',
          imageSrc: '/brand/editorial-platform-heritage.png',
          imageAlt: '',
          meta: 'Community • moderated usefulness',
        },
        {
          eyebrow: 'Member access',
          title: 'Create your private owner workspace',
          description:
            'After registration you can add your Cane Corso, prepare photos, follow health and growth, and submit for review when ready.',
          href: '/access?intent=member',
          actionLabel: 'Create profile',
          secondaryHref: '/platform',
          secondaryLabel: 'Read platform overview',
          imageSrc: '/brand/primary/welcome-logo.jpg',
          imageAlt: '',
          meta: 'Member • private first',
        },
      ],
    },
    member: {
      eyebrow: 'Owner journey',
      title: 'Your first clear actions after login',
      description:
        'A focused owner path: add one Cane Corso, prepare the profile, then use review, health, and community tools when they matter.',
      progressLabel: 'Member journey slide',
      previousLabel: 'Previous action',
      nextLabel: 'Next action',
      slides: [
        {
          eyebrow: 'Step 1',
          title: 'Add your Cane Corso',
          description: 'Start with one private profile. Nothing becomes public just because you saved basic information.',
          href: '/my-dogs/new',
          actionLabel: 'Add Cane Corso',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'My Cane Corso',
          imageSrc: '/brand/editorial-member-shadow-eye.jpg',
          imageAlt: '',
          meta: 'Private profile',
        },
        {
          eyebrow: 'Step 2',
          title: 'Upload clear photos',
          description: 'Prepare front, side, head, and natural standing photos so review has useful visual evidence.',
          href: '/my-dogs',
          actionLabel: 'Open photo workspace',
          secondaryHref: '/guide?topic=member-workspace#member-workspace',
          secondaryLabel: 'Photo guidance',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Photos • readiness',
        },
        {
          eyebrow: 'Step 3',
          title: 'Prepare for USG review',
          description: 'Complete identity, profile details, origin notes, and evidence before requesting a human review.',
          href: '/my-dogs',
          actionLabel: 'Prepare profile',
          secondaryHref: '/profile',
          secondaryLabel: 'Owner profile',
          imageSrc: '/brand/seal/usg-seal-wide.png',
          imageAlt: '',
          meta: 'Review • human decision',
        },
        {
          eyebrow: 'Step 4',
          title: 'Track health and growth',
          description: 'Use health and growth records as an owner tool. They support better care and clearer long-term context.',
          href: '/my-dogs',
          actionLabel: 'Open health tools',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Owner knowledge',
          imageSrc: '/brand/heritage/di-casa-tananov/mark-ii.jpg',
          imageAlt: '',
          meta: 'Health • owner care',
        },
        {
          eyebrow: 'Step 5',
          title: 'Use community and services when needed',
          description: 'Find requests, services, partners, and useful places while official Registry decisions remain separate.',
          href: '/ecosystem',
          actionLabel: 'Open community tools',
          secondaryHref: '/partners',
          secondaryLabel: 'Public partners',
          imageSrc: '/brand/entry/usg-global-ecosystem-cover.png',
          imageAlt: '',
          meta: 'Community • services',
        },
      ],
    },
    myDogsEmpty: {
      eyebrow: 'First Cane Corso profile',
      title: 'Build the first profile step by step',
      description:
        'Before the first profile exists, this path keeps the flow clear: identity, photos, origin, review, and public profile only after approval.',
      progressLabel: 'My Cane Corso setup slide',
      previousLabel: 'Previous setup step',
      nextLabel: 'Next setup step',
      slides: [
        {
          eyebrow: 'Profile basics',
          title: 'Add the essential information first',
          description: 'Name, date of birth, sex, color, location, and short description create the private profile foundation.',
          href: '/my-dogs/new',
          actionLabel: 'Start profile',
          secondaryHref: '/profile',
          secondaryLabel: 'Owner identity',
          imageSrc: '/brand/editorial-member-shadow-eye.jpg',
          imageAlt: '',
          meta: 'Basic profile',
        },
        {
          eyebrow: 'Photos',
          title: 'Prepare clear owner photos',
          description: 'Photos should help the admin understand structure and presentation. They do not prove pedigree by themselves.',
          href: '/my-dogs/new',
          actionLabel: 'Start profile',
          secondaryHref: '/guide?topic=member-workspace#member-workspace',
          secondaryLabel: 'Photo guide',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Photo readiness',
        },
        {
          eyebrow: 'Origin',
          title: 'Add parents and origin notes when available',
          description: 'Pedigree numbers, parents, grandparents, and photos are useful context, but missing data can be explained honestly.',
          href: '/my-dogs/new',
          actionLabel: 'Add details',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Learn more',
          imageSrc: '/brand/heritage/di-casa-tananov/hera.jpg',
          imageAlt: '',
          meta: 'Origin • context',
        },
        {
          eyebrow: 'USG review',
          title: 'Submit only when the profile is ready',
          description: 'USG review is a human moderation step. The profile can be returned for changes before publication.',
          href: '/my-dogs/new',
          actionLabel: 'Create profile',
          secondaryHref: '/faq',
          secondaryLabel: 'Review FAQ',
          imageSrc: '/brand/seal/usg-official-seal.png',
          imageAlt: '',
          meta: 'Review • not automatic',
        },
        {
          eyebrow: 'Public profile',
          title: 'Publication happens only after approval',
          description: 'A public Registry page and certificate flow stay separate. Saving a private profile never publishes it automatically.',
          href: '/my-dogs/new',
          actionLabel: 'Begin now',
          secondaryHref: '/registry',
          secondaryLabel: 'View Registry',
          imageSrc: '/brand/entry/usg-corso-presence.jpg',
          imageAlt: '',
          meta: 'Registry • after approval',
        },
      ],
    },
  },
  bg: {
    public: {
      eyebrow: 'Първи път през USG',
      title: 'Започни своя Cane Corso път в USG',
      description:
        'Спокоен визуален път за гости: провери доверие, разгледай знания, открий общност и създай личен профил само когато си готов.',
      progressLabel: 'Слайд от пътя за гости',
      previousLabel: 'Предишна стъпка',
      nextLabel: 'Следваща стъпка',
      slides: [
        {
          eyebrow: 'Проверка на доверие',
          title: 'Провери Cane Corso сертификат или профил',
          description:
            'Използвай Проверка, когато имаш код или публична референция. Така официалното доверие остава отделено от общностното съдържание.',
          href: '/verify',
          actionLabel: 'Отвори Проверка',
          secondaryHref: '/faq',
          secondaryLabel: 'Как работи доверието',
          imageSrc: '/brand/seal/usg-official-seal-compact.png',
          imageAlt: '',
          meta: 'Проверка • официално доверие',
        },
        {
          eyebrow: 'Публичен Регистър',
          title: 'Разгледай публикувани Cane Corso профили',
          description:
            'Регистърът е официалният публичен слой. Профили се показват там само след човешки преглед и публикуване.',
          href: '/registry',
          actionLabel: 'Към Регистъра',
          secondaryHref: '/certified',
          secondaryLabel: 'Сертифицирани',
          imageSrc: '/brand/entry/usg-corso-presence.jpg',
          imageAlt: '',
          meta: 'Регистър • прегледани профили',
        },
        {
          eyebrow: 'Знание за породата',
          title: 'Научи преди да подаваш каквото и да е',
          description:
            'Прочети история, стандартна ориентация, насоки за стопани и USG образователни бележки преди подготовка на профил.',
          href: '/knowledge',
          actionLabel: 'Отвори Знания',
          secondaryHref: '/guide?topic=overview#overview',
          secondaryLabel: 'Наръчник',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Знания • образование',
        },
        {
          eyebrow: 'Общност и услуги',
          title: 'Намери полезни места, заявки и услуги',
          description:
            'Общностният слой помага на собствениците да се ориентират, без да се смесва с официалния авторитет на Регистъра.',
          href: '/community',
          actionLabel: 'Отвори Общност',
          secondaryHref: '/partners',
          secondaryLabel: 'Партньори',
          imageSrc: '/brand/editorial-platform-heritage.png',
          imageAlt: '',
          meta: 'Общност • модерирана полезност',
        },
        {
          eyebrow: 'Членски достъп',
          title: 'Създай лична зона за собственик',
          description:
            'След регистрация можеш да добавиш Cane Corso, да подготвиш снимки, да следиш здраве и растеж и да подадеш за преглед, когато си готов.',
          href: '/access?intent=member',
          actionLabel: 'Създай профил',
          secondaryHref: '/platform',
          secondaryLabel: 'За платформата',
          imageSrc: '/brand/primary/welcome-logo.jpg',
          imageAlt: '',
          meta: 'Член • първо лично',
        },
      ],
    },
    member: {
      eyebrow: 'Път на собственика',
      title: 'Първите ясни действия след вход',
      description:
        'Фокусиран път за собственик: добави един Cane Corso, подготви профила, после използвай преглед, здраве и общност, когато има смисъл.',
      progressLabel: 'Слайд от пътя на собственика',
      previousLabel: 'Предишно действие',
      nextLabel: 'Следващо действие',
      slides: [
        {
          eyebrow: 'Стъпка 1',
          title: 'Добави своя Cane Corso',
          description: 'Започни с един личен профил. Нищо не става публично само защото си запазил основна информация.',
          href: '/my-dogs/new',
          actionLabel: 'Добави Cane Corso',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Моите Cane Corso',
          imageSrc: '/brand/editorial-member-shadow-eye.jpg',
          imageAlt: '',
          meta: 'Личен профил',
        },
        {
          eyebrow: 'Стъпка 2',
          title: 'Качи ясни снимки',
          description: 'Подготви снимки отпред, отстрани, глава и естествен стоеж, за да има полезна визуална основа за преглед.',
          href: '/my-dogs',
          actionLabel: 'Отвори снимките',
          secondaryHref: '/guide?topic=member-workspace#member-workspace',
          secondaryLabel: 'Насоки за снимки',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Снимки • готовност',
        },
        {
          eyebrow: 'Стъпка 3',
          title: 'Подготви профила за USG преглед',
          description: 'Попълни идентичност, данни за профила, произход и доказателства преди да поискаш човешки преглед.',
          href: '/my-dogs',
          actionLabel: 'Подготви профила',
          secondaryHref: '/profile',
          secondaryLabel: 'Профил на собственик',
          imageSrc: '/brand/seal/usg-seal-wide.png',
          imageAlt: '',
          meta: 'Преглед • човешко решение',
        },
        {
          eyebrow: 'Стъпка 4',
          title: 'Следи здраве и растеж',
          description: 'Използвай здравните и растежните записи като инструмент за стопанина. Те помагат за грижа и по-ясен дългосрочен контекст.',
          href: '/my-dogs',
          actionLabel: 'Към здравните инструменти',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Знания за стопани',
          imageSrc: '/brand/heritage/di-casa-tananov/mark-ii.jpg',
          imageAlt: '',
          meta: 'Здраве • грижа',
        },
        {
          eyebrow: 'Стъпка 5',
          title: 'Използвай общност и услуги при нужда',
          description: 'Намери заявки, услуги, партньори и полезни места, докато официалните решения за Регистър остават отделни.',
          href: '/ecosystem',
          actionLabel: 'Отвори общността',
          secondaryHref: '/partners',
          secondaryLabel: 'Публични партньори',
          imageSrc: '/brand/entry/usg-global-ecosystem-cover.png',
          imageAlt: '',
          meta: 'Общност • услуги',
        },
      ],
    },
    myDogsEmpty: {
      eyebrow: 'Първи Cane Corso профил',
      title: 'Изгради първия профил стъпка по стъпка',
      description:
        'Преди да има първи профил, този път държи потока ясен: идентичност, снимки, произход, преглед и публичен профил само след одобрение.',
      progressLabel: 'Слайд за подготовка в Моите Cane Corso',
      previousLabel: 'Предишна стъпка за попълване',
      nextLabel: 'Следваща стъпка за попълване',
      slides: [
        {
          eyebrow: 'Основни данни',
          title: 'Първо добави най-важната информация',
          description: 'Име, дата на раждане, пол, цвят, локация и кратко описание създават личната основа на профила.',
          href: '/my-dogs/new',
          actionLabel: 'Започни профил',
          secondaryHref: '/profile',
          secondaryLabel: 'Собственик',
          imageSrc: '/brand/editorial-member-shadow-eye.jpg',
          imageAlt: '',
          meta: 'Основен профил',
        },
        {
          eyebrow: 'Снимки',
          title: 'Подготви ясни снимки от собственика',
          description: 'Снимките помагат на админа да разбере структура и представяне. Сами по себе си не доказват родословие.',
          href: '/my-dogs/new',
          actionLabel: 'Започни профил',
          secondaryHref: '/guide?topic=member-workspace#member-workspace',
          secondaryLabel: 'Насоки за снимки',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Готовност на снимки',
        },
        {
          eyebrow: 'Произход',
          title: 'Добави родители и произход, ако ги знаеш',
          description: 'Родословни номера, родители, прародители и снимки са полезен контекст, но липсващи данни могат да се обяснят честно.',
          href: '/my-dogs/new',
          actionLabel: 'Добави данни',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Научи повече',
          imageSrc: '/brand/heritage/di-casa-tananov/hera.jpg',
          imageAlt: '',
          meta: 'Произход • контекст',
        },
        {
          eyebrow: 'USG преглед',
          title: 'Изпрати само когато профилът е готов',
          description: 'USG прегледът е човешка модерация. Профилът може да бъде върнат за корекции преди публикуване.',
          href: '/my-dogs/new',
          actionLabel: 'Създай профил',
          secondaryHref: '/faq',
          secondaryLabel: 'FAQ за преглед',
          imageSrc: '/brand/seal/usg-official-seal.png',
          imageAlt: '',
          meta: 'Преглед • не е автоматично',
        },
        {
          eyebrow: 'Публичен профил',
          title: 'Публикуване има само след одобрение',
          description: 'Публичната страница в Регистъра и сертификатният поток остават отделни. Запазването на личен профил никога не го публикува автоматично.',
          href: '/my-dogs/new',
          actionLabel: 'Започни сега',
          secondaryHref: '/registry',
          secondaryLabel: 'Виж Регистъра',
          imageSrc: '/brand/entry/usg-corso-presence.jpg',
          imageAlt: '',
          meta: 'Регистър • след одобрение',
        },
      ],
    },
  },
  it: {
    public: {
      eyebrow: 'Primo percorso in USG',
      title: 'Inizia il tuo percorso Cane Corso in USG',
      description:
        'Un percorso visivo calmo per ospiti: verifica fiducia, esplora conoscenza, scopri community e crea un profilo privato solo quando sei pronto.',
      progressLabel: 'Slide percorso ospite',
      previousLabel: 'Passo precedente',
      nextLabel: 'Passo successivo',
      slides: [
        {
          eyebrow: 'Controllo fiducia',
          title: 'Verifica un certificato o profilo Cane Corso',
          description:
            'Usa Verifica quando hai un codice o riferimento pubblico. La fiducia ufficiale resta separata dal contenuto community.',
          href: '/verify',
          actionLabel: 'Apri Verifica',
          secondaryHref: '/faq',
          secondaryLabel: 'Come funziona',
          imageSrc: '/brand/seal/usg-official-seal-compact.png',
          imageAlt: '',
          meta: 'Verifica • fiducia ufficiale',
        },
        {
          eyebrow: 'Registro pubblico',
          title: 'Esplora profili Cane Corso pubblicati',
          description:
            'Il Registro è il livello pubblico ufficiale. I profili compaiono solo dopo revisione umana e pubblicazione.',
          href: '/registry',
          actionLabel: 'Sfoglia Registro',
          secondaryHref: '/certified',
          secondaryLabel: 'Archivio certificati',
          imageSrc: '/brand/entry/usg-corso-presence.jpg',
          imageAlt: '',
          meta: 'Registro • profili rivisti',
        },
        {
          eyebrow: 'Conoscenza razza',
          title: 'Impara prima di inviare qualsiasi cosa',
          description:
            'Leggi storia, orientamento allo standard, guida proprietario e note educative USG prima di preparare un profilo.',
          href: '/knowledge',
          actionLabel: 'Apri Conoscenza',
          secondaryHref: '/guide?topic=overview#overview',
          secondaryLabel: 'Guida piattaforma',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Conoscenza • educazione',
        },
        {
          eyebrow: 'Community e servizi',
          title: 'Trova luoghi, richieste e servizi utili',
          description:
            'Il livello community orienta i proprietari senza confondersi con l’autorità ufficiale del Registro.',
          href: '/community',
          actionLabel: 'Apri Community',
          secondaryHref: '/partners',
          secondaryLabel: 'Partner',
          imageSrc: '/brand/editorial-platform-heritage.png',
          imageAlt: '',
          meta: 'Community • utilità moderata',
        },
        {
          eyebrow: 'Accesso membro',
          title: 'Crea il tuo spazio privato proprietario',
          description:
            'Dopo la registrazione puoi aggiungere il tuo Cane Corso, preparare foto, seguire salute e crescita e inviare per revisione quando pronto.',
          href: '/access?intent=member',
          actionLabel: 'Crea profilo',
          secondaryHref: '/platform',
          secondaryLabel: 'Panoramica piattaforma',
          imageSrc: '/brand/primary/welcome-logo.jpg',
          imageAlt: '',
          meta: 'Membro • prima privato',
        },
      ],
    },
    member: {
      eyebrow: 'Percorso proprietario',
      title: 'Le prime azioni chiare dopo il login',
      description:
        'Un percorso proprietario focalizzato: aggiungi un Cane Corso, prepara il profilo, poi usa revisione, salute e community quando servono.',
      progressLabel: 'Slide percorso membro',
      previousLabel: 'Azione precedente',
      nextLabel: 'Azione successiva',
      slides: [
        {
          eyebrow: 'Passo 1',
          title: 'Aggiungi il tuo Cane Corso',
          description: 'Inizia con un profilo privato. Nulla diventa pubblico solo perché hai salvato le informazioni di base.',
          href: '/my-dogs/new',
          actionLabel: 'Aggiungi Cane Corso',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'I miei Cane Corso',
          imageSrc: '/brand/editorial-member-shadow-eye.jpg',
          imageAlt: '',
          meta: 'Profilo privato',
        },
        {
          eyebrow: 'Passo 2',
          title: 'Carica foto chiare',
          description: 'Prepara foto frontali, laterali, testa e posizione naturale, così la revisione ha evidenza visiva utile.',
          href: '/my-dogs',
          actionLabel: 'Apri foto',
          secondaryHref: '/guide?topic=member-workspace#member-workspace',
          secondaryLabel: 'Guida foto',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Foto • prontezza',
        },
        {
          eyebrow: 'Passo 3',
          title: 'Prepara il profilo per revisione USG',
          description: 'Completa identità, dettagli profilo, origine ed evidenze prima di chiedere una revisione umana.',
          href: '/my-dogs',
          actionLabel: 'Prepara profilo',
          secondaryHref: '/profile',
          secondaryLabel: 'Profilo proprietario',
          imageSrc: '/brand/seal/usg-seal-wide.png',
          imageAlt: '',
          meta: 'Revisione • decisione umana',
        },
        {
          eyebrow: 'Passo 4',
          title: 'Segui salute e crescita',
          description: 'Usa salute e crescita come strumenti proprietario. Aiutano cura e contesto a lungo termine.',
          href: '/my-dogs',
          actionLabel: 'Apri strumenti salute',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Conoscenza proprietario',
          imageSrc: '/brand/heritage/di-casa-tananov/mark-ii.jpg',
          imageAlt: '',
          meta: 'Salute • cura',
        },
        {
          eyebrow: 'Passo 5',
          title: 'Usa community e servizi quando servono',
          description: 'Trova richieste, servizi, partner e luoghi utili mentre le decisioni ufficiali del Registro restano separate.',
          href: '/ecosystem',
          actionLabel: 'Apri community',
          secondaryHref: '/partners',
          secondaryLabel: 'Partner pubblici',
          imageSrc: '/brand/entry/usg-global-ecosystem-cover.png',
          imageAlt: '',
          meta: 'Community • servizi',
        },
      ],
    },
    myDogsEmpty: {
      eyebrow: 'Primo profilo Cane Corso',
      title: 'Costruisci il primo profilo passo dopo passo',
      description:
        'Prima che esista il primo profilo, questo percorso mantiene chiaro il flusso: identità, foto, origine, revisione e profilo pubblico solo dopo approvazione.',
      progressLabel: 'Slide setup I miei Cane Corso',
      previousLabel: 'Passo setup precedente',
      nextLabel: 'Passo setup successivo',
      slides: [
        {
          eyebrow: 'Dati base',
          title: 'Aggiungi prima le informazioni essenziali',
          description: 'Nome, data di nascita, sesso, colore, posizione e breve descrizione creano la base privata del profilo.',
          href: '/my-dogs/new',
          actionLabel: 'Inizia profilo',
          secondaryHref: '/profile',
          secondaryLabel: 'Identità proprietario',
          imageSrc: '/brand/editorial-member-shadow-eye.jpg',
          imageAlt: '',
          meta: 'Profilo base',
        },
        {
          eyebrow: 'Foto',
          title: 'Prepara foto proprietario chiare',
          description: 'Le foto aiutano l’admin a capire struttura e presentazione. Da sole non provano il pedigree.',
          href: '/my-dogs/new',
          actionLabel: 'Inizia profilo',
          secondaryHref: '/guide?topic=member-workspace#member-workspace',
          secondaryLabel: 'Guida foto',
          imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
          imageAlt: '',
          meta: 'Prontezza foto',
        },
        {
          eyebrow: 'Origine',
          title: 'Aggiungi genitori e origine se disponibili',
          description: 'Pedigree, genitori, nonni e foto sono contesto utile, ma i dati mancanti possono essere spiegati con onestà.',
          href: '/my-dogs/new',
          actionLabel: 'Aggiungi dettagli',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Scopri di più',
          imageSrc: '/brand/heritage/di-casa-tananov/hera.jpg',
          imageAlt: '',
          meta: 'Origine • contesto',
        },
        {
          eyebrow: 'Revisione USG',
          title: 'Invia solo quando il profilo è pronto',
          description: 'La revisione USG è una moderazione umana. Il profilo può tornare per correzioni prima della pubblicazione.',
          href: '/my-dogs/new',
          actionLabel: 'Crea profilo',
          secondaryHref: '/faq',
          secondaryLabel: 'FAQ revisione',
          imageSrc: '/brand/seal/usg-official-seal.png',
          imageAlt: '',
          meta: 'Revisione • non automatica',
        },
        {
          eyebrow: 'Profilo pubblico',
          title: 'La pubblicazione avviene solo dopo approvazione',
          description: 'Pagina pubblica Registro e certificato restano separati. Salvare un profilo privato non lo pubblica mai automaticamente.',
          href: '/my-dogs/new',
          actionLabel: 'Inizia ora',
          secondaryHref: '/registry',
          secondaryLabel: 'Vedi Registro',
          imageSrc: '/brand/entry/usg-corso-presence.jpg',
          imageAlt: '',
          meta: 'Registro • dopo approvazione',
        },
      ],
    },
  },
};

export function UsgJourneyCarousel({
  locale,
  variant,
  className = '',
}: {
  locale: Locale;
  variant: JourneyVariant;
  className?: string;
}) {
  const copy = copyByLocale[locale]?.[variant] ?? copyByLocale.en[variant];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = copy.slides[activeIndex] ?? copy.slides[0];

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? copy.slides.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % copy.slides.length);
  }

  return (
    <section className={`usg-journey-carousel usg-journey-carousel--${variant} ${className}`.trim()} aria-label={copy.title} data-step130="journey-carousel">
      <div className="usg-journey-carousel__intro">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>

      <div className="usg-journey-carousel__stage">
        <div className="usg-journey-carousel__media" aria-hidden="true">
          <Image src={activeSlide.imageSrc} alt={activeSlide.imageAlt} width={920} height={640} priority={variant === 'public'} />
          <div className="usg-journey-carousel__seal">USG</div>
        </div>

        <article className="usg-journey-carousel__active-card">
          <div className="usg-journey-carousel__meta-row">
            <span>{activeSlide.eyebrow}</span>
            <em>{activeSlide.meta}</em>
          </div>
          <h3>{activeSlide.title}</h3>
          <p>{activeSlide.description}</p>
          <div className="usg-journey-carousel__actions">
            <Link href={activeSlide.href} className="button-primary">
              {activeSlide.actionLabel}
            </Link>
            {activeSlide.secondaryHref && activeSlide.secondaryLabel ? (
              <Link href={activeSlide.secondaryHref} className="button-ghost small">
                {activeSlide.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </article>
      </div>

      <div className="usg-journey-carousel__controls" aria-label={copy.progressLabel}>
        <button type="button" className="usg-journey-carousel__arrow" onClick={goToPrevious} aria-label={copy.previousLabel}>
          ←
        </button>
        <div className="usg-journey-carousel__dots">
          {copy.slides.map((slide, index) => (
            <button
              type="button"
              key={`${slide.title}-${index}`}
              className={`usg-journey-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`${copy.progressLabel} ${index + 1}`}
              aria-current={index === activeIndex ? 'step' : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{slide.title}</strong>
            </button>
          ))}
        </div>
        <button type="button" className="usg-journey-carousel__arrow" onClick={goToNext} aria-label={copy.nextLabel}>
          →
        </button>
      </div>
    </section>
  );
}
