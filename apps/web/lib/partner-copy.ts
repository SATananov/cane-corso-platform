import type { Locale } from '@/lib/i18n';

export const canonicalPartnerCategories = [
  'veterinary_clinic',
  'trainer',
  'handler',
  'breeder',
  'photographer',
  'transport',
  'boarding',
  'pet_friendly_place',
  'shop',
  'other',
] as const;

const categoryLabels: Record<Locale, Record<string, string>> = {
  en: {
    veterinary_clinic: 'Veterinary clinics',
    trainer: 'Training',
    handler: 'Handlers',
    breeder: 'Breeders',
    photographer: 'Photography',
    transport: 'Transport',
    boarding: 'Boarding',
    pet_friendly_place: 'Pet-friendly places',
    shop: 'Shops',
    other: 'Other services',
  },
  bg: {
    veterinary_clinic: 'Ветеринарни клиники',
    trainer: 'Треньори',
    handler: 'Хендлъри',
    breeder: 'Развъдници',
    photographer: 'Фотографи',
    transport: 'Транспорт',
    boarding: 'Хотели и настаняване',
    pet_friendly_place: 'Места, подходящи за Cane Corso',
    shop: 'Магазини',
    other: 'Други услуги',
  },
  it: {
    veterinary_clinic: 'Cliniche veterinarie',
    trainer: 'Trainer',
    handler: 'Handler',
    breeder: 'Allevatori',
    photographer: 'Fotografi',
    transport: 'Trasporto',
    boarding: 'Boarding',
    pet_friendly_place: 'Luoghi pet-friendly',
    shop: 'Negozi',
    other: 'Altri servizi',
  },
};


const standardPartnerTextTranslations: Record<Locale, Record<string, string>> = {
  en: {
    'A premium Cane Corso-focused veterinary service profile for public directory testing.':
      'Premium Cane Corso-focused veterinary service profile prepared for the public partner directory.',
    'Premium boarding and relocation support for large-breed Cane Corso owners.':
      'Premium boarding and relocation support for large-breed Cane Corso owners.',
    'Demo approved service entry used to validate the Partners and Services vertical, detail page rendering, and category filtering.':
      'Approved service partner profile with information for the public directory, detail page, and category filters.',
    'Official Partner / Services profile approved for the Cane Corso ecosystem.':
      'Official partner or service profile approved for the Cane Corso ecosystem.',
    'Visible after administrator approval. Community ratings remain separate from official approval.':
      'Visible after USG approval. Community ratings remain separate from official approval.',
    'Starter Member': 'Verified member',
  },
  bg: {
    'A premium Cane Corso-focused veterinary service profile for public directory testing.':
      'Премиум ветеринарен профил за Cane Corso, подготвен за публичния каталог с партньори.',
    'Premium boarding and relocation support for large-breed Cane Corso owners.':
      'Премиум хотел и съдействие при транспорт за собственици на едри Cane Corso.',
    'Demo approved service entry used to validate the Partners and Services vertical, detail page rendering, and category filtering.':
      'Одобрен партньорски профил за услуга с информация за публичния каталог, детайлната страница и филтрите по категории.',
    'We focus on premium boarding and relocation support for large-breed Cane Corso, including travel preparation and calm handling.':
      'Фокусът е върху премиум престой и съдействие при преместване на едри Cane Corso — с подготовка за пътуване и спокойно отношение.',
    'Official Partner / Services profile approved for the Cane Corso ecosystem.':
      'Официален профил за партньор или услуга, одобрен за Cane Corso екосистемата.',
    'Visible after administrator approval. Community ratings remain separate from official approval.':
      'Видим след USG одобрение. Оценките от общността остават отделени от официалното одобрение.',
    'Starter Member': 'Проверен член',
    Bulgaria: 'България',
    Sofia: 'София',
    Plovdiv: 'Пловдив',
  },
  it: {
    'A premium Cane Corso-focused veterinary service profile for public directory testing.':
      'Profilo veterinario premium per Cane Corso preparato per la directory pubblica dei partner.',
    'Premium boarding and relocation support for large-breed Cane Corso owners.':
      'Pensione premium e supporto al trasporto per proprietari di Cane Corso di taglia grande.',
    'Demo approved service entry used to validate the Partners and Services vertical, detail page rendering, and category filtering.':
      'Profilo partner servizio approvato con informazioni per la directory pubblica, la pagina dettaglio e i filtri categoria.',
    'We focus on premium boarding and relocation support for large-breed Cane Corso, including travel preparation and calm handling.':
      'Il focus è su pensione premium e supporto al trasferimento per Cane Corso di taglia grande, con preparazione al viaggio e gestione calma.',
    'Official Partner / Services profile approved for the Cane Corso ecosystem.':
      'Profilo partner o servizio ufficiale approvato per l’ecosistema Cane Corso.',
    'Visible after administrator approval. Community ratings remain separate from official approval.':
      'Visibile dopo approvazione USG. Le valutazioni della comunità restano separate dall’approvazione ufficiale.',
    'Starter Member': 'Membro verificato',
  },
};

function localizeKnownPartnerValue(locale: Locale, value: string) {
  const trimmed = value.trim();
  const translations = standardPartnerTextTranslations[locale] ?? standardPartnerTextTranslations.en;
  return translations[trimmed] ?? trimmed;
}

const uiCopy = {
  en: {
    allCategories: 'All services',
    stats: {
      totalVisible: 'Visible partners',
      totalApproved: 'Approved directory',
      featured: 'Featured entries',
      pendingApplications: 'Pending applications',
      approvedApplications: 'Approved applications',
      rejectedApplications: 'Rejected applications',
      suspendedPartners: 'Suspended partners',
      liveEntries: 'Live entries',
    },
    labels: {
      help: 'Help',
      category: 'Category',
      businessName: 'Business / service name',
      city: 'City',
      country: 'Country',
      location: 'Location',
      contact: 'Contact',
      website: 'Website',
      email: 'Email',
      phone: 'Phone',
      owner: 'Owner',
      published: 'Published',
      featured: 'Featured',
      viewProfile: 'Open profile',
      relatedServices: 'Related services',
      directory: 'Partner directory',
      noDirectoryTitle: 'No approved services yet',
      noDirectoryDescription:
        'As approved services enter the platform, they will appear here with category filters, metadata, and detail pages.',
      noRelated: 'No related services are visible yet.',
      noApplicationsTitle: 'No incoming applications right now',
      noApplicationsDescription:
        'When members submit service applications, they will appear here for review and publication.',
      liveEntries: 'Live partner entries',
      applications: 'Incoming applications',
      approve: 'Approve and publish',
      reject: 'Reject application',
      feature: 'Mark featured',
      unfeature: 'Remove featured',
      suspend: 'Suspend entry',
      restore: 'Restore entry',
      details: 'Details',
      submitted: 'Submitted',
      reviewNote: 'Review note',
      applicationMessage: 'Application note',
      liveStatus: 'Live status',
      openPublicProfile: 'Open public profile',
      noWebsite: 'No website yet',
      openWebsite: 'Open website',
      noContact: 'No direct contact listed yet',
      noDescription: 'A longer business description will appear here after the service profile is enriched.',
      unknown: 'Not specified',
      moderation: 'Moderation',
      approvedVisibility: 'Approved entries appear in the public partner directory.',
      openApplyWorkspace: 'Become a partner',
      partnerCtaTitle: 'Need a trusted Cane Corso service?',
      partnerCtaDescription: 'Explore approved clinics, trainers, handlers, breeders, transport, boarding, photographers, and other services selected for the Cane Corso ecosystem.',
      partnerCtaSecondaryTitle: 'Do you offer a business or service?',
      partnerCtaSecondaryDescription: 'If you run a clinic, training service, kennel, transport, hotel, shop, photography studio, or another relevant service, you can apply for a partner profile in the catalog.',
      partnerCtaModerationNote: 'Every application is reviewed by an administrator before it becomes public.',
      workspace: 'Partner application',
      serviceSummary: 'Service summary',
      longDescription: 'Full service profile',
      coverImage: 'Cover image URL',
      logoImage: 'Logo image URL',
      applicationForm: 'Application form',
      yourApplications: 'Your submitted applications',
      yourLiveEntries: 'Your live entries',
      noMemberApplicationsTitle: 'No submissions yet',
      noMemberApplicationsDescription:
        'Use the form to submit the first partner or service profile for moderation.',
      applyGuidance: 'Moderation path',
      queueVisibility: 'Every new application appears in the admin queue before publication.',
      submitApplication: 'Submit for review',
      serviceNoteHelp: 'Optional note for the review team',
      openDirectory: 'Open directory',
      applicationReady: 'Application ready',
      reviewFlowHint: 'Submit once, review in admin, approve, then publish to the public directory.',
    },
    workspace: {
      eyebrow: 'Partner application',
      title: 'Become a partner in the directory',
      description:
        'Submit your business or service for review so it can appear in the approved public catalog for the Cane Corso ecosystem.',
      formDescription:
        'Add the public-facing service details now, so the approved profile can enter the directory without a second manual rewrite.',
      latestStatus: 'Latest queue status',
      publicSurface: 'Public partner directory',
      moderationSteps: [
        'Prepare the service profile with category, summary, and contact details.',
        'Submit the application into the moderation queue.',
        'After approval, the profile becomes visible in the public directory and partner detail pages.',
      ],
    },
  },
  bg: {
    allCategories: 'Всички услуги',
    stats: {
      totalVisible: 'Видими партньори',
      totalApproved: 'Одобрен каталог',
      featured: 'Препоръчани профили',
      pendingApplications: 'Чакащи кандидатури',
      approvedApplications: 'Одобрени кандидатури',
      rejectedApplications: 'Отхвърлени кандидатури',
      suspendedPartners: 'Спрени партньори',
      liveEntries: 'Активни профили',
    },
    labels: {
      help: 'Помощ',
      category: 'Категория',
      businessName: 'Име на бизнеса / услугата',
      city: 'Град',
      country: 'Държава',
      location: 'Локация',
      contact: 'Контакт',
      website: 'Уебсайт',
      email: 'Имейл',
      phone: 'Телефон',
      owner: 'Собственик',
      published: 'Публикуван',
      featured: 'Препоръчан',
      viewProfile: 'Отвори профила',
      relatedServices: 'Свързани услуги',
      directory: 'Партньори и услуги',
      noDirectoryTitle: 'Все още няма одобрени услуги',
      noDirectoryDescription:
        'Когато одобрени услуги влязат в платформата, те ще се показват тук с филтри по категории, ключова информация и отделни детайлни страници.',
      noRelated: 'Все още няма други видими услуги в тази категория.',
      noApplicationsTitle: 'В момента няма нови кандидатури',
      noApplicationsDescription:
        'Когато членове изпращат кандидатури за услуги, те ще се появят тук за преглед и публикация.',
      liveEntries: 'Активни партньорски профили',
      applications: 'Входящи кандидатури',
      approve: 'Одобри и публикувай',
      reject: 'Отхвърли кандидатурата',
      feature: 'Маркирай като препоръчан',
      unfeature: 'Махни препоръчан',
      suspend: 'Спри профила',
      restore: 'Възстанови профила',
      details: 'Детайли',
      submitted: 'Изпратена',
      reviewNote: 'Бележка от преглед',
      applicationMessage: 'Бележка към кандидатурата',
      liveStatus: 'Текущ статус',
      openPublicProfile: 'Отвори публичния профил',
      noWebsite: 'Все още няма сайт',
      openWebsite: 'Отвори сайта',
      noContact: 'Все още няма директен контакт',
      noDescription: 'По-дългото описание на бизнеса ще се покаже тук, след като профилът бъде обогатен.',
      unknown: 'Не е посочено',
      moderation: 'Модерация',
      approvedVisibility: 'Одобрените профили се показват в публичния каталог с партньори.',
      openApplyWorkspace: 'Стани партньор',
      partnerCtaTitle: 'Търсиш полезна услуга за своя Cane Corso?',
      partnerCtaDescription: 'Разгледай одобрени ветеринарни клиники, треньори, хендлъри, развъдници, транспорт, хотели, фотографи, магазини и други полезни услуги за Cane Corso.',
      partnerCtaSecondaryTitle: 'Имаш бизнес или услуга?',
      partnerCtaSecondaryDescription: 'Ако предлагаш ветеринарна помощ, тренировки, развъдник, транспорт, хотел, магазин, фотография или друга подходяща услуга, можеш да кандидатстваш за партньорски профил в каталога.',
      partnerCtaModerationNote: 'Всяка кандидатура се преглежда и одобрява от администратор преди публикуване.',
      workspace: 'Кандидатура за партньор',
      serviceSummary: 'Кратко представяне',
      longDescription: 'Пълен профил на услугата',
      coverImage: 'URL за основно изображение',
      logoImage: 'URL за лого',
      applicationForm: 'Форма за кандидатстване',
      yourApplications: 'Твоите изпратени кандидатури',
      yourLiveEntries: 'Твоите активни профили',
      noMemberApplicationsTitle: 'Все още няма изпратени кандидатури',
      noMemberApplicationsDescription:
        'Използвай формата, за да изпратиш първия партньорски или сервизен профил за модерация.',
      applyGuidance: 'Път на модерацията',
      queueVisibility: 'Всяка нова кандидатура влиза в опашката за админ преглед преди публикация.',
      submitApplication: 'Изпрати за преглед',
      serviceNoteHelp: 'Незадължителна бележка към екипа по преглед',
      openDirectory: 'Отвори каталога',
      applicationReady: 'Кандидатурата е готова',
      reviewFlowHint: 'Изпращаш веднъж, преглежда се от админ, одобрява се и после влиза в публичния каталог.',
    },
    workspace: {
      eyebrow: 'Кандидатура за партньор',
      title: 'Стани партньор в каталога',
      description:
        'Подай своя бизнес или услуга за преглед, за да може след одобрение да се появи в публичния каталог за Cane Corso екосистемата.',
      formDescription:
        'Въведи още сега публичните данни за услугата, за да може при одобрение профилът да влезе директно в каталога без второ пренаписване.',
      latestStatus: 'Последен статус в опашката',
      publicSurface: 'Публичен каталог с партньори',
      moderationSteps: [
        'Подготви профила на услугата с категория, кратко представяне и контакти.',
        'Изпрати кандидатурата в опашката за модерация.',
        'След одобрение профилът става видим в публичния каталог и детайлните страници.',
      ],
    },
  },
  it: {
    allCategories: 'Tutti i servizi',
    stats: {
      totalVisible: 'Partner visibili',
      totalApproved: 'Directory approvata',
      featured: 'Voci in evidenza',
      pendingApplications: 'Candidature in attesa',
      approvedApplications: 'Candidature approvate',
      rejectedApplications: 'Candidature rifiutate',
      suspendedPartners: 'Partner sospesi',
      liveEntries: 'Voci live',
    },
    labels: {
      help: 'Aiuto',
      category: 'Categoria',
      businessName: 'Nome del business / servizio',
      city: 'Città',
      country: 'Paese',
      location: 'Località',
      contact: 'Contatto',
      website: 'Sito web',
      email: 'Email',
      phone: 'Telefono',
      owner: 'Proprietario',
      published: 'Pubblicato',
      featured: 'In evidenza',
      viewProfile: 'Apri profilo',
      relatedServices: 'Servizi correlati',
      directory: 'Partner e servizi',
      noDirectoryTitle: 'Nessun servizio approvato',
      noDirectoryDescription:
        'Quando i servizi approvati entreranno nella piattaforma, appariranno qui con filtri di categoria, metadata e pagine dettaglio.',
      noRelated: 'Non ci sono ancora altri servizi visibili in questa categoria.',
      noApplicationsTitle: 'Nessuna candidatura in arrivo',
      noApplicationsDescription:
        'Quando i membri invieranno candidature servizio, appariranno qui per revisione e pubblicazione.',
      liveEntries: 'Voci partner live',
      applications: 'Candidature in arrivo',
      approve: 'Approva e pubblica',
      reject: 'Rifiuta candidatura',
      feature: 'Segna come featured',
      unfeature: 'Rimuovi featured',
      suspend: 'Sospendi voce',
      restore: 'Ripristina voce',
      details: 'Dettagli',
      submitted: 'Inviata',
      reviewNote: 'Nota di revisione',
      applicationMessage: 'Nota candidatura',
      liveStatus: 'Stato live',
      openPublicProfile: 'Apri profilo pubblico',
      noWebsite: 'Nessun sito web ancora',
      openWebsite: 'Apri sito',
      noContact: 'Nessun contatto diretto ancora',
      noDescription: 'Una descrizione più ampia apparirà qui quando il profilo del servizio sarà arricchito.',
      unknown: 'Non specificato',
      moderation: 'Moderazione',
      approvedVisibility: 'Le voci approvate compaiono nella directory partner pubblica.',
      openApplyWorkspace: 'Diventa partner',
      partnerCtaTitle: 'Cerchi un servizio utile per il tuo Cane Corso?',
      partnerCtaDescription: 'Esplora cliniche veterinarie approvate, trainer, handler, allevatori, trasporto, boarding, fotografi, negozi e altri servizi utili per l’ecosistema Cane Corso.',
      partnerCtaSecondaryTitle: 'Hai un business o un servizio?',
      partnerCtaSecondaryDescription: 'Se offri clinica veterinaria, training, allevamento, trasporto, hotel, negozio, fotografia o un altro servizio adatto, puoi candidarti per un profilo partner nel catalogo.',
      partnerCtaModerationNote: 'Ogni candidatura viene revisionata e approvata da un amministratore prima della pubblicazione.',
      workspace: 'Candidatura partner',
      serviceSummary: 'Sintesi del servizio',
      longDescription: 'Profilo completo del servizio',
      coverImage: 'URL immagine cover',
      logoImage: 'URL logo',
      applicationForm: 'Modulo candidatura',
      yourApplications: 'Le tue candidature inviate',
      yourLiveEntries: 'Le tue voci live',
      noMemberApplicationsTitle: 'Nessuna candidatura inviata',
      noMemberApplicationsDescription:
        'Usa il modulo per inviare il primo profilo partner o servizio alla moderazione.',
      applyGuidance: 'Percorso moderazione',
      queueVisibility: 'Ogni nuova candidatura appare nella coda admin prima della pubblicazione.',
      submitApplication: 'Invia per revisione',
      serviceNoteHelp: 'Nota opzionale per il team di revisione',
      openDirectory: 'Apri directory',
      applicationReady: 'Candidatura pronta',
      reviewFlowHint: 'Invia una volta, revisione in admin, approvazione e poi pubblicazione nella directory pubblica.',
    },
    workspace: {
      eyebrow: 'Candidatura partner',
      title: 'Diventa partner nella directory',
      description:
        'Invia il tuo business o servizio per revisione, così dopo l’approvazione potrà apparire nella directory pubblica dell’ecosistema Cane Corso.',
      formDescription:
        'Aggiungi ora i dettagli pubblici del servizio, così il profilo approvato potrà entrare nella directory senza una seconda riscrittura manuale.',
      latestStatus: 'Ultimo stato in coda',
      publicSurface: 'Directory partner pubblica',
      moderationSteps: [
        'Prepara il profilo servizio con categoria, sintesi e contatti.',
        'Invia la candidatura nella coda di moderazione.',
        'Dopo l’approvazione, il profilo diventa visibile nella directory pubblica e nelle pagine dettaglio.',
      ],
    },
  },
} as const;

export function getPartnerUiCopy(locale: Locale) {
  return uiCopy[locale] ?? uiCopy.en;
}

export function getPartnerCategoryLabel(locale: Locale, category: string) {
  const normalized = category.trim();
  return categoryLabels[locale]?.[normalized] ?? categoryLabels.en[normalized] ?? normalized.replace(/_/g, ' ');
}

export function formatPartnerLocation(city: string | null, country: string | null, fallback: string, locale: Locale = 'en') {
  const parts = [city, country]
    .filter((value): value is string => Boolean(value))
    .map((value) => localizeKnownPartnerValue(locale, value));
  return parts.length > 0 ? parts.join(', ') : fallback;
}

export function localizePartnerText(locale: Locale, value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  return localizeKnownPartnerValue(locale, value);
}

export function formatPartnerOwnerName(locale: Locale, value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  return localizeKnownPartnerValue(locale, value);
}

export function formatPartnerDate(locale: Locale, value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(value));
}
