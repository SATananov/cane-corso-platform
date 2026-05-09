export const locales = ['en', 'bg', 'it'] as const;

export type Locale = (typeof locales)[number];

export const LOCALE_COOKIE = 'usg-locale';

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  bg: 'BG',
  it: 'IT',
};

export function isLocale(value: string | null | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export const dictionary: Record<Locale, any> = {
  en: {
    meta: {
      title: 'UNICO SUO GENERE — Cane Corso Platform',
      description:
        'Premium registry, member workspace, trusted partner network, knowledge layer, and verification flows for Cane Corso.',
    },
    site: {
      brandEyebrow: 'UNICO SUO GENERE',
      brandTitle: 'CANE CORSO PLATFORM',
      brandStatement: 'ONE OF A KIND',
      brandSubline: 'Elite registry, trusted knowledge, and a premium digital home for the breed.',
      member: 'Member',
      admin: 'Admin',
      exit: 'Exit',
      locale: 'Language',
      theme: 'Theme',
      darkTheme: 'Dark',
      heritageTheme: 'Heritage',
      trademark: 'USG — UNICO SUO GENERE™ by Stefano De Tanini',
      footerTitle: 'UNICO SUO GENERE — ONE OF A KIND',
      footerText:
        'A premium destination for registry presentation, member tools, trusted partner visibility, breed knowledge, and public verification.',
      footerMetaA: 'Cane Corso platform foundation',
      footerMetaB: 'Designed for a distinct identity',
    },
    navigation: {
      home: 'Home',
      registry: 'Registry',
      knowledge: 'Knowledge',
      partners: 'Partners',
      verify: 'Verify',
      myDogs: 'My Cane Corso',
      ecosystem: 'Ecosystem',
      profile: 'Profile',
      reviewQueue: 'Moderation',
      adminRegistry: 'Registry Control',
      adminMembers: 'Members',
      adminPartners: 'Partner Review',
      adminEcosystem: 'Ecosystem Review',
    },
    common: {
      openSection: 'Open section',
      exploreRegistry: 'Explore registry',
      enterMemberArea: 'Enter member area',
      joinMember: 'Become a member',
      joinPartner: 'Become a partner',
      signIn: 'Sign in',
      help: 'Help',
      learnMore: 'Learn more',
      futureLabel: 'Status',
      premiumStatement: 'ONE OF A KIND',
      publicationPath: 'Publication path',
      currentBuildSlice: 'Current focus',
      emptyState: 'Nothing here yet',
      notSetYet: 'Not set yet',
      pending: 'Pending',
      lastPersisted: 'Last persisted',
      saveDraft: 'Save draft',
      savingDraft: 'Saving draft...',
      submitForReview: 'Submit for review',
      submitting: 'Submitting...',
      manageMedia: 'Manage media later',
      createProfile: 'Create profile',
      editProfile: 'Edit profile',
      addNewDog: 'Add Cane Corso',
      auto: 'Auto',
      runValidation: 'Run validation',
      generateSlug: 'Generate slug',
      optional: 'optional',
    },
    home: {
      eyebrow: 'UNICO SUO GENERE',
      badgeA: 'Registry',
      badgeB: 'Knowledge',
      badgeC: 'Trusted Network',
      badgeD: 'Verification',
      title: 'A premium Cane Corso platform with a distinct identity',
      subtitle:
        'Built to feel rare, credible, and unmistakable — a digital ecosystem for Cane Corso, owners, trusted professionals, and long-term breed value.',
      heroCardEyebrow: 'Official brand presence',
      heroCardTitle: 'A premium interface beyond generic kennel directories',
      heroCardText:
        'USG is being shaped as a premium black-and-gold experience with a refined trust layer, editorial depth, and member tools that feel worthy of the breed.',
      statAValue: '01',
      statALabel: 'Distinct premium identity',
      statBValue: '03',
      statBLabel: 'Core platform layers online',
      statCValue: '∞',
      statCLabel: 'Ecosystem growth',
      pillarsEyebrow: 'Platform pillars',
      pillarsTitle: 'Designed as a full Cane Corso ecosystem',
      pillarsDescription:
        'The platform is more than a registry. It is being built as a premium digital home for the breed, its owners, and the trusted network around them.',
      statementEyebrow: 'Brand philosophy',
      statementTitle: 'UNICO SUO GENERE — ONE OF A KIND',
      statementDescription:
        'The identity layer is deliberate: dark, refined, memorable, and clearly separated from ordinary pet-platform visuals.',
      pillars: [
        {
          eyebrow: 'Registry',
          title: 'Dogs & trust layer',
          description:
            'Premium Cane Corso profiles, review flow, public registry presentation, and certificate-backed credibility.',
          href: '/registry',
          meta: 'Published profiles • review flow • verify pages',
        },
        {
          eyebrow: 'Knowledge',
          title: 'Breed intelligence',
          description:
            'History, care, training, health, temperament, and owner guidance shaped into a long-term Cane Corso knowledge base.',
          href: '/knowledge',
          meta: 'Guides • articles • owner education',
        },
        {
          eyebrow: 'Network',
          title: 'Trusted partners',
          description:
            'Clinics, handlers, trainers, photographers, breeders, and other relevant services curated for the breed ecosystem.',
          href: '/partners',
          meta: 'Applications • trusted listings • visibility',
        },
      ],
      zonesEyebrow: 'Application layers',
      zonesTitle: 'Public, member, and moderation spaces',
      zonesDescription:
        'The first version is already structured around the real product layers we need for registry, ownership, moderation, and trusted publication.',
      zones: [
        {
          eyebrow: 'Public',
          title: 'Explore the platform',
          description:
            'Discover registry entries, breed knowledge, partner listings, and the premium identity of the platform.',
          href: '/registry',
          meta: 'Registry • Knowledge • Partners • Verify',
        },
        {
          eyebrow: 'Членска зона',
          title: 'Manage my Cane Corso',
          description:
            'Own profiles, prepare submissions, and control how each Cane Corso enters the public registry.',
          href: '/my-dogs',
          meta: 'Profile • Dogs • Media • Submission flow',
        },
        {
          eyebrow: 'Moderation',
          title: 'Review & publish',
          description:
            'Admin surfaces for publication quality, partner approvals, trust decisions, and audit-friendly moderation.',
          href: '/review',
          meta: 'Опашка за преглед • партньорски преглед • проверки за доверие',
        },
      ],
    },
    pageShell: {
      accentLabel: 'Brand seal',
    },
    pages: {
      registry: {
        eyebrow: 'Public registry',
        title: 'Registry',
        description:
          'Public registry for published Cane Corso profiles, premium presentation, and trusted discovery.',
        heroNote:
          'A published profile is the public trust layer. The certificate is a separate trust signal and is confirmed through Verify.',
        heroChipPublished: 'Published profile',
        heroChipCertificate: 'USG certificate',
        heroChipVerify: 'Verify path',
        cards: [
          {
            eyebrow: 'Published layer',
            title: 'Registry listings',
            description:
              'Public-ready Cane Corso cards with premium presentation, trust-oriented summaries, and clear public discovery.',
            meta: 'Публичен каталог • откриване • премиум визуален език',
          },
          {
            eyebrow: 'Profile depth',
            title: 'Dog detail experience',
            description:
              'Each registry entry will evolve into a rich public detail page with gallery, identity, status, and verification signals.',
            meta: 'Hero изображение • профилни данни • галерия • сертификатен слой',
          },
          {
            eyebrow: 'Trust',
            title: 'Verification path',
            description:
              'The registry connects directly to certificate verification so public visitors can confirm certificate status and public authenticity.',
            href: '/verify',
            meta: 'Публична проверка • слой на доверие • достоверност',
          },
        ],
      },
      knowledge: {
        eyebrow: 'Breed knowledge',
        title: 'Knowledge',
        description:
          'Structured educational space for history, care, training, health, and practical owner guidance.',
        cards: [
          {
            eyebrow: 'Foundation',
            title: 'Breed history & identity',
            description:
              'A curated editorial layer for the origins, purpose, and defining qualities of the Cane Corso breed.',
            meta: 'История • темперамент • идентичност',
          },
          {
            eyebrow: 'Practical guidance',
            title: 'Owner education',
            description:
              'Structured educational content around care, nutrition, routines, preparation, and long-term responsible ownership.',
            meta: 'Грижа • хранене • рутина • насоки за собственици',
          },
          {
            eyebrow: 'Health & training',
            title: 'Applied knowledge',
            description:
              'Practical sections for health awareness, socialization, training, and real-life everyday Cane Corso support.',
            meta: 'Здраве • тренировки • социализация',
          },
        ],
      },
      partners: {
        eyebrow: 'Trusted network',
        title: 'Partners',
        description:
          'Partner directory foundation for clinics, trainers, handlers, breeders, photographers, and other Cane Corso services.',
        cards: [
          {
            eyebrow: 'Trusted network',
            title: 'Partner directory',
            description:
              'A curated network of clinics, handlers, trainers, breeders, photographers, and other Cane Corso-relevant services.',
            meta: 'Каталог • категории • локация',
          },
          {
            eyebrow: 'Visibility',
            title: 'Professional presence',
            description:
              'Approved partners will have a stronger presence with brand assets, business details, and featured visibility.',
            meta: 'Профили • материали • партньорски слой на доверие',
          },
          {
            eyebrow: 'Pipeline',
            title: 'Application flow',
            description:
              'Partner entries are designed to pass through an approval process before becoming part of the trusted network.',
            href: '/admin/partners',
            meta: 'Кандидатури • преглед • доверено одобрение',
          },
        ],
      },
      review: {
        eyebrow: 'Admin moderation',
        title: 'Review Queue',
        description:
          'Admin panel for reviewing Cane Corso submissions, requesting changes, approving, and publishing.',
        cards: [
          {
            eyebrow: 'Moderation',
            title: 'Submission queue',
            description:
              'The core moderation surface for reviewing draft submissions, deciding readiness, and enforcing publication quality.',
            meta: 'Опашка • решения • контрол на публикацията',
          },
          {
            eyebrow: 'Feedback',
            title: 'Review notes',
            description:
              'Reviewers will leave change requests, approval context, and audit-friendly moderation notes here.',
            meta: 'Нужни промени • одобряване • отказ',
          },
          {
            eyebrow: 'Publishing',
            title: 'Registry release',
            description:
              'Approved submissions will move from member space into the public registry with traceable, trust-oriented publication states.',
            href: '/registry',
            meta: 'Одобрение • публикуване • запис в регистъра',
          },
        ],
      },
      adminPartners: {
        eyebrow: 'Admin moderation',
        title: 'Partner Review',
        description:
          'Approval area for partner applications, verification checks, and trusted network curation.',
        cards: [
          {
            eyebrow: 'Applications',
            title: 'Partner intake',
            description:
              'The admin side of the trusted partner network begins with reviewable applications and verification-ready business details.',
            meta: 'Кандидатури • контакти • бизнес данни',
          },
          {
            eyebrow: 'Verification',
            title: 'Проверки за доверие',
            description:
              'Admins will validate eligibility, fit, and quality before a partner becomes visible in the public network.',
            meta: 'Валидация • одобрение • отказ • качество',
          },
          {
            eyebrow: 'Presentation',
            title: 'Featured visibility',
            description:
              'Approved partners will later gain branded pages, featured states, and premium visual positioning inside the platform.',
            href: '/partners',
            meta: 'Одобрени списъци • подчертани позиции',
          },
        ],
      },
      verify: {
        eyebrow: 'Verification',
        titlePrefix: 'Certificate',
        description: 'Public verification for active USG certificates connected to published registry records.',
        cards: {
          identity: {
            eyebrow: 'Lookup',
            title: 'Certificate identity',
            description:
              'Verify confirms whether a certificate belongs to a published Cane Corso registry record and whether the certificate remains active.',
          },
          outcome: {
            eyebrow: 'Trust result',
            title: 'Verification outcome',
            description:
              'Visitors see a clear public result showing whether the certificate is active, revoked, or expired.',
            meta: 'Active • revoked • expired',
          },
          bridge: {
            eyebrow: 'Registry path',
            title: 'Connected dog profile',
            description:
              'Every verified certificate links back to the published Cane Corso profile so visitors can review the full public context.',
            href: '/registry',
            meta: 'Profile link • certificate status • public trust',
          },
        },
      },
      profile: {
        eyebrow: 'Member area',
        title: 'Profile',
        description:
          'Your personal member profile and account details for the private platform area.',
        cards: {
          memberIdentity: 'Member identity',
          ownerDetails: 'Owner details',
          bootstrapStatus: 'Account status',
          activeSession: 'Private access active',
          temporaryAccess: 'Temporary access',
          starterProfile: 'member profile',
          databaseReady: 'Account session',
          databaseReadyText:
            'Your account is signed in and ready for the private member area.',
          ownerDetailsText:
            'This section shows the personal account behind your member presence in the platform.',
          fallbackBio:
            'Complete and refine your member details as your presence in the platform grows.',
          statusMeta: 'identity • access • session',
        },
      },
      myDogs: {
        eyebrow: 'Member area',
        title: 'My Cane Corso',
        description:
          'Add, edit, measure, upload photos, and follow the review status of every Cane Corso profile from one private owner area.',
        noDogsTitle: 'No Cane Corso added yet',
        noDogsDescription:
          'Add your first Cane Corso profile to begin the private owner flow and prepare it for review when ready.',
        publicationTitle: 'From draft to public registry',
        publicationSteps: [
          'Create the profile foundation',
          'Refine registry and owner presentation',
          'Add gallery and primary hero image',
          'Submit for review',
          'Publish to the Cane Corso Platform registry',
        ],
        buildSliceTitle: 'Private member flow is active',
        buildSliceText:
          'My Dogs now follows the real member account and profile relationship before any profile editing or review actions begin.',
        labels: {
          totalProfiles: 'Total profiles',
          publicProfiles: 'Public profiles',
          readyForReview: 'Ready for review',
          drafts: 'Drafts',
          profiles: 'Dog profiles',
        },
      },
      newDog: {
        eyebrow: 'Member area',
        title: 'Add a Cane Corso profile',
        description:
          'Start directly with the form: add the main details, upload photos, add pedigree information if available, then save or send for review.',
        pillA: 'Main details',
        pillB: 'Photos',
        pillC: 'Pedigree',
      },
      editDog: {
        eyebrow: 'Member area',
        title: 'Edit Cane Corso profile',
        description:
          'Update the form, check the preview, and send the profile for review when the important details are ready.',
        pillA: 'Edit form',
        pillB: 'Photos',
        pillC: 'Review',
      },
    },
    form: {
      validationEyebrow: 'Profile check',
      validationClean: 'The profile looks ready for the next step',
      validationDetected: 'field issues detected',
      validationText:
        'Check the required fields before saving a draft or sending the profile for review.',
      sections: {
        foundationTitleCreate: 'Profile foundation',
        foundationTitleEdit: 'Profile data',
        foundationDescription:
          'Fill the most important details first. Name, identity, photos, and basic information create the foundation of the profile.',
        registryTitle: 'Registry information',
        registryDescription:
          'These fields help the administrator understand the registry class, documents, and profile quality.',
        presentationTitle: 'Presentation',
        presentationDescription:
          'The short and long descriptions shape how the Cane Corso is presented later.',
        locationTitle: 'Location',
        locationDescription:
          'Location keeps the profile clear and useful for future filters and public context.',
      },
      fields: {
        name: 'Dog name',
        slug: 'Profile slug',
        sex: 'Sex',
        male: 'Male',
        female: 'Female',
        birthDate: 'Date of birth',
        color: 'Color',
        visibility: 'Visibility',
        private: 'Private',
        public: 'Public',
        microchip: 'Microchip number',
        pedigree: 'Pedigree number',
        currentStatus: 'Current status',
        bloodline: 'Bloodline note',
        shortDescription: 'Short description',
        longDescription: 'Long description',
        city: 'City',
        country: 'Country',
      },
      placeholders: {
        name: 'Enter Cane Corso name',
        slug: 'unique-profile-slug',
        color: 'Black, grey, formentino...',
        selectColor: 'Select color',
        microchip: 'Microchip number',
        pedigree: 'Pedigree number',
        bloodline: 'Optional lineage note',
        shortDescription: 'Short premium summary for the profile card',
        longDescription: 'Optional longer registry story',
        city: 'City',
        country: 'Country',
        selectCountry: 'Select country',
      },
      options: {
        colors: {
          black: 'Black',
          blackBrindle: 'Black Brindle',
          grey: 'Grey',
          greyBrindle: 'Grey Brindle',
          formentino: 'Formentino',
          fawn: 'Fawn',
          red: 'Red',
          chestnutBrindle: 'Chestnut Brindle',
          blue: 'Blue',
          other: 'Other',
        },
        countries: {
          bulgaria: 'Bulgaria',
          italy: 'Italy',
          serbia: 'Serbia',
          romania: 'Romania',
          greece: 'Greece',
          northMacedonia: 'North Macedonia',
          albania: 'Albania',
          montenegro: 'Montenegro',
          croatia: 'Croatia',
          slovenia: 'Slovenia',
          bosniaAndHerzegovina: 'Bosnia and Herzegovina',
          germany: 'Germany',
          france: 'France',
          spain: 'Spain',
          portugal: 'Portugal',
          netherlands: 'Netherlands',
          belgium: 'Belgium',
          austria: 'Austria',
          switzerland: 'Switzerland',
          unitedKingdom: 'United Kingdom',
          ireland: 'Ireland',
          poland: 'Poland',
          czechRepublic: 'Czech Republic',
          slovakia: 'Slovakia',
          hungary: 'Hungary',
          turkey: 'Turkey',
          unitedStates: 'United States',
          canada: 'Canada',
        },
      },
      actions: {
        draftFlow: 'Draft creation flow',
        editingProfile: 'Editing profile',
        saveDraftDefault:
          'Save a draft or send the profile for review when the main details are ready.',
      },
      preview: {
        livePreview: 'Live preview',
        newCover: 'New profile cover',
        currentCover: 'Current profile cover',
        unnamed: 'Unnamed Cane Corso',
        shortFallback: 'A refined Cane Corso profile preview will appear here.',
        readiness: 'Readiness',
        validated: 'Profile foundation validated',
        awaiting: 'Awaiting validation',
        issuesToFix: 'issues to fix',
        slug: 'Profile address',
        sex: 'Sex',
        birthDate: 'Birth date',
        color: 'Color',
        visibility: 'Visibility',
        country: 'Country',
        registryStory: 'Registry story',
        longFallback: 'Long-form profile story and owner presentation will appear here.',
        persistenceTitle: 'Current state',
        persistenceFallback: 'After saving, the latest profile status appears here.',
      },
      status: {
        draft: 'Draft',
        submitted: 'Submitted',
        needs_changes: 'Needs changes',
        approved: 'Approved',
        published: 'Published',
        archived: 'Archived',
      },
      workspace: {
        slugGenerated: 'Slug was generated from the current profile name.',
        validationPassed: 'The profile looks ready to save or send for review.',
        validationIssues: 'Validation found issues. Review the highlighted fields before continuing.',
        submissionBlocked: 'Sending is blocked until all highlighted issues are fixed.',
        submitMessageSuffix: 'core profile fields are currently filled.',
        serverActionFailedPrefix: 'Saving failed:',
        payloadTooLarge: 'The selected photos were too large for one save. The platform now prepares smaller profile copies before saving. Try saving again.',
        unexpectedApiResponse: 'The server returned an unexpected response. Try again after the page finishes preparing the photos.',
        persistedTo: 'Last saved on',
      },
      validation: {
        nameRequired: 'Dog name is required.',
        slugRequired: 'Profile slug is required.',
        slugPattern: 'Use lowercase letters, numbers, and hyphens only.',
        birthDateRequired: 'Birth date is required for a registry-ready profile.',
        colorRequired: 'Color helps classify the registry profile.',
        microchipPattern: 'Microchip number must contain exactly 15 digits.',
        shortDescriptionRequired: 'Add a short profile summary.',
        shortDescriptionLength: 'Short description should be at least 24 characters.',
        longDescriptionRequired: 'Add a longer registry story.',
        longDescriptionLength: 'If you add a long description, use at least 20 characters.',
        cityRequired: 'City is required for discovery and regional context.',
        countryRequired: 'Country is required for registry context.',
      },
      dogCard: {
        pedigreePending: 'Pedigree pending',
        age: 'Age',
        visibility: 'Visibility',
        descriptionFallback: 'Profile presentation is being prepared for the owner workspace.',
        manageMedia: 'Manage media',
        birthDatePending: 'Birth date pending',
        months: 'months',
        years: 'years',
      },
    },
  },
  bg: {
    meta: {
      title: 'UNICO SUO GENERE — Cane Corso Platform',
      description:
        'Премиум регистър, зона за членове, доверена партньорска мрежа, знание за породата и верификационни потоци за Cane Corso.',
    },
    site: {
      brandEyebrow: 'UNICO SUO GENERE',
      brandTitle: 'CANE CORSO PLATFORM',
      brandStatement: 'ЕДИНСТВЕН ПО РОДА СИ',
      brandSubline: 'Елитен регистър, доверено знание и премиум дигитален дом за породата.',
      member: 'Член',
      admin: 'Админ',
      exit: 'Изход',
      locale: 'Език',
      theme: 'Тема',
      darkTheme: 'Тъмна',
      heritageTheme: 'Светла',
      trademark: 'USG — UNICO SUO GENERE™ by Stefano De Tanini',
      footerTitle: 'UNICO SUO GENERE — ЕДИНСТВЕН ПО РОДА СИ',
      footerText:
        'Премиум пространство за регистър, инструменти за членове, доверени партньори, знания за породата и публична верификация.',
      footerMetaA: 'Основа на Cane Corso платформата',
      footerMetaB: 'Създадена с отличима идентичност',
    },
    navigation: {
      home: 'Начало',
      registry: 'Регистър',
      knowledge: 'Знания',
      partners: 'Партньори',
      verify: 'Провери',
      myDogs: 'Моите Cane Corso',
      ecosystem: 'Екосистема',
      profile: 'Профил',
      reviewQueue: 'Модерация',
      adminRegistry: 'Регистър',
      adminMembers: 'Потребители',
      adminPartners: 'Партньорски преглед',
      adminEcosystem: 'Преглед на екосистемата',
    },
    common: {
      openSection: 'Отвори секцията',
      exploreRegistry: 'Разгледай регистъра',
      enterMemberArea: 'Влез в зоната за членове',
      joinMember: 'Стани член',
      joinPartner: 'Стани партньор',
      signIn: 'Вход',
      help: 'Помощ',
      learnMore: 'Научи повече',
      futureLabel: 'Статус',
      premiumStatement: 'ЕДИНСТВЕН ПО РОДА СИ',
      publicationPath: 'Път към публикация',
      currentBuildSlice: 'Активна зона',
      emptyState: 'Все още няма запис',
      notSetYet: 'Все още не е зададено',
      pending: 'Предстои',
      lastPersisted: 'Последно записване',
      saveDraft: 'Запази чернова',
      savingDraft: 'Запазване...',
      submitForReview: 'Изпрати за преглед',
      submitting: 'Изпращане...',
      manageMedia: 'Медията по-късно',
      createProfile: 'Създай профил',
      editProfile: 'Редактирай профила',
      addNewDog: 'Добави Cane Corso',
      auto: 'Авто',
      runValidation: 'Провери',
      generateSlug: 'Генерирай адрес',
      optional: 'незадължително',
    },
    home: {
      eyebrow: 'UNICO SUO GENERE',
      badgeA: 'Регистър',
      badgeB: 'Знание',
      badgeC: 'Доверена мрежа',
      badgeD: 'Верификация',
      title: 'Премиум Cane Corso платформа с отличима идентичност',
      subtitle:
        'Създадена да изглежда рядка, достоверна и разпознаваема — дигитална екосистема за Cane Corso, собственици, доверени професионалисти и дългосрочна стойност за породата.',
      heroCardEyebrow: 'Официално брандово присъствие',
      heroCardTitle: 'Премиум интерфейс отвъд типичните развъдни директории',
      heroCardText:
        'USG се оформя като премиум черно-златно преживяване с изчистен слой на доверие, силна редакционна дълбочина и инструменти за членове, достойни за породата.',
      statAValue: '01',
      statALabel: 'Отличима премиум идентичност',
      statBValue: '03',
      statBLabel: 'Основни продуктови слоя онлайн',
      statCValue: '∞',
      statCLabel: 'Място за бъдещ растеж',
      pillarsEyebrow: 'Стълбове на платформата',
      pillarsTitle: 'Проектирана като цяла Cane Corso екосистема',
      pillarsDescription:
        'Платформата е повече от регистър. Изгражда се като премиум дигитален дом за породата, нейните собственици и доверената мрежа около тях.',
      statementEyebrow: 'Бранд философия',
      statementTitle: 'UNICO SUO GENERE — ЕДИНСТВЕН ПО РОДА СИ',
      statementDescription:
        'Идентичността е нарочна: тъмна, изискана, запомняща се и ясно отделена от обикновените визии за платформи за домашни любимци.',
      pillars: [
        {
          eyebrow: 'Регистър',
          title: 'Профили и слой на доверие',
          description:
            'Премиум Cane Corso профили, поток за преглед, публично представяне в регистъра и достоверност, подсилена със сертификати.',
          href: '/registry',
          meta: 'Публикувани профили • преглед • страници за проверка',
        },
        {
          eyebrow: 'Знание',
          title: 'Интелигентност за породата',
          description:
            'История, грижа, тренировки, здраве, темперамент и насоки за собственици, оформени като дългосрочна база знания за Cane Corso.',
          href: '/knowledge',
          meta: 'Наръчници • статии • обучение за собственици',
        },
        {
          eyebrow: 'Мрежа',
          title: 'Доверени партньори',
          description:
            'Клиники, хендлъри, треньори, фотографи, развъдници и други релевантни услуги, подбрани за екосистемата на породата.',
          href: '/partners',
          meta: 'Кандидатури • доверени списъци • видимост',
        },
      ],
      zonesEyebrow: 'Слоеве на приложението',
      zonesTitle: 'Публична, членска и модераторска зона',
      zonesDescription:
        'Първата версия вече е подредена около реалните продуктови слоеве, нужни за регистър, собственост, модерация и доверено публикуване.',
      zones: [
        {
          eyebrow: 'Публично',
          title: 'Разгледай платформата',
          description:
            'Открий профили в регистъра, знание за породата, партньорски списъци и премиум идентичността на платформата.',
          href: '/registry',
          meta: 'Регистър • Знание • Партньори • Проверка',
        },
        {
          eyebrow: 'Членска зона',
          title: 'Управлявай моите Cane Corso',
          description:
            'Собствени профили, подготвяне на кандидатури и контрол как всеки Cane Corso влиза в публичния регистър.',
          href: '/my-dogs',
          meta: 'Профил • Кучета • Медия • Път към публикация',
        },
        {
          eyebrow: 'Модерация',
          title: 'Преглед и публикуване',
          description:
            'Админ повърхности за качество на публикацията, одобрение на партньори, решения за доверие и проследима модерация.',
          href: '/review',
          meta: 'Опашка за преглед • партньорски преглед • проверки за доверие',
        },
      ],
    },
    pageShell: { accentLabel: 'USG seal' },
    pages: {
      registry: {
        eyebrow: 'Публичен регистър',
        title: 'Регистър',
        description:
          'Публичен регистър за публикувани Cane Corso профили, премиум представяне и доверено откриване.',
        heroNote:
          'Публикуваният профил е публичният слой на доверие. Сертификатът е отделен знак за доверие и се потвърждава през страницата за проверка.',
        heroChipPublished: 'Публикуван профил',
        heroChipCertificate: 'USG сертификат',
        heroChipVerify: 'Път към проверка',
        cards: [
          {
            eyebrow: 'Публикуван слой',
            title: 'Списък с профили',
            description:
              'Публикувани Cane Corso карти с премиум представяне, ясни trust обобщения и удобна ориентация за посетителя.',
            meta: 'Публичен каталог • откриване • премиум визуален език',
          },
          {
            eyebrow: 'Дълбочина на профила',
            title: 'Детайлна страница за Cane Corso',
            description:
              'Всеки запис в регистъра има публична страница с идентичност, снимки, статус, собственик и връзка към проверка.',
            meta: 'Hero изображение • профилни данни • галерия • сертификатен слой',
          },
          {
            eyebrow: 'Доверие',
            title: 'Мост към проверка',
            description:
              'Регистърът се свързва директно със сертификатна верификация, за да може посетителят да потвърди автентичността.',
            href: '/verify',
            meta: 'Публична проверка • слой на доверие • достоверност',
          },
        ],
      },
      knowledge: {
        eyebrow: 'Знание за породата',
        title: 'Знание',
        description:
          'Структурирано образователно пространство за история, грижа, тренировки, здраве и практични насоки за собственици.',
        cards: [
          {
            eyebrow: 'Основа',
            title: 'История и идентичност на породата',
            description:
              'Кураторски редакционен слой за произхода, предназначението и определящите качества на породата Cane Corso.',
            meta: 'История • темперамент • идентичност',
          },
          {
            eyebrow: 'Практически насоки',
            title: 'Обучение за собственици',
            description:
              'Структурирано съдържание за грижи, хранене, рутина, подготовка и дългосрочно отговорно отглеждане.',
            meta: 'Грижа • хранене • рутина • насоки за собственици',
          },
          {
            eyebrow: 'Здраве и тренировки',
            title: 'Приложно знание',
            description:
              'Практични насоки за здравна информираност, социализация, тренировки и ежедневна подкрепа за Cane Corso.',
            meta: 'Здраве • тренировки • социализация',
          },
        ],
      },
      partners: {
        eyebrow: 'Доверена мрежа',
        title: 'Партньори',
        description:
          'Основа на партньорски каталог за клиники, треньори, хендлъри, развъдници, фотографи и други Cane Corso услуги.',
        cards: [
          {
            eyebrow: 'Доверена мрежа',
            title: 'Каталог с партньори',
            description:
              'Кураторска мрежа от клиники, хендлъри, треньори, развъдници, фотографи и други услуги, релевантни за Cane Corso.',
            meta: 'Каталог • категории • локация',
          },
          {
            eyebrow: 'Видимост',
            title: 'Професионално присъствие',
            description:
              'Одобрените партньори имат подредено присъствие с брандови материали, бизнес данни и ясна публична видимост.',
            meta: 'Профили • материали • партньорски слой на доверие',
          },
          {
            eyebrow: 'Поток',
            title: 'Кандидатстване',
            description:
              'Партньорските профили са проектирани да минават през процес на одобрение, преди да станат част от доверената мрежа.',
            href: '/admin/partners',
            meta: 'Кандидатури • преглед • доверено одобрение',
          },
        ],
      },
      review: {
        eyebrow: 'Админ модерация',
        title: 'Преглед',
        description:
          'Админ панел за преглед на Cane Corso кандидатури, искане на промени, одобрение и публикуване.',
        cards: [
          {
            eyebrow: 'Модерация',
            title: 'Опашка за кандидатури',
            description:
              'Основната модераторска повърхност за преглед на чернови, решение за готовност и поддържане на качество на публикацията.',
            meta: 'Опашка • решения • контрол на публикацията',
          },
          {
            eyebrow: 'Обратна връзка',
            title: 'Бележки по прегледа',
            description:
              'Проверяващите ще оставят искания за промени, контекст за одобрение и бъдещи проследими бележки тук.',
            meta: 'Нужни промени • одобряване • отказ',
          },
          {
            eyebrow: 'Публикуване',
            title: 'Пускане в регистъра',
            description:
              'Одобрените профили ще преминават от членското пространство в публичния регистър с проследими състояния, ориентирани към доверие.',
            href: '/registry',
            meta: 'Одобрение • публикуване • запис в регистъра',
          },
        ],
      },
      adminPartners: {
        eyebrow: 'Админ модерация',
        title: 'Преглед на партньори',
        description:
          'Зона за одобрение на партньорски кандидатури, проверки за доверие и курирана доверена мрежа.',
        cards: [
          {
            eyebrow: 'Кандидатури',
            title: 'Прием на партньори',
            description:
              'Админ страната на доверената партньорска мрежа започва с преглеждаеми кандидатури и бизнес данни, готови за проверка.',
            meta: 'Кандидатури • контакти • бизнес данни',
          },
          {
            eyebrow: 'Проверка',
            title: 'Проверки за доверие',
            description:
              'Админите ще валидират допустимост, качество и съответствие, преди партньорът да стане видим в публичната мрежа.',
            meta: 'Валидация • одобрение • отказ • качество',
          },
          {
            eyebrow: 'Представяне',
            title: 'Подчертана видимост',
            description:
              'Одобрените партньори по-късно ще получават брандирани страници, подчертани състояния и премиум визуално позициониране.',
            href: '/partners',
            meta: 'Одобрени списъци • подчертани позиции',
          },
        ],
      },
      verify: {
        eyebrow: 'Верификация',
        titlePrefix: 'Сертификат',
        description: 'Публична проверка за активни USG сертификати, свързани с публикувани записи в регистъра.',
        cards: {
          identity: {
            eyebrow: 'Проверка',
            title: 'Идентичност на сертификата',
            description:
              'Проверката потвърждава дали сертификатът принадлежи на публикуван Cane Corso запис в регистъра и дали остава активен.',
          },
          outcome: {
            eyebrow: 'Резултат',
            title: 'Резултат от верификацията',
            description:
              'Посетителят вижда ясен публичен резултат дали сертификатът е активен, отнет или изтекъл.',
            meta: 'Активен • отнет • изтекъл',
          },
          bridge: {
            eyebrow: 'Път към регистъра',
            title: 'Свързан профил на куче',
            description:
              'Всеки потвърден сертификат води обратно към публикувания Cane Corso профил, за да може посетителят да прегледа пълния публичен контекст.',
            href: '/registry',
            meta: 'Профилна връзка • статус на сертификата • публично доверие',
          },
        },
      },
      profile: {
        eyebrow: 'Членска зона',
        title: 'Профил',
        description:
          'Тук са личните ти данни и членският ти профил за частната зона на платформата.',
        cards: {
          memberIdentity: 'Членска идентичност',
          ownerDetails: 'Данни за собственика',
          bootstrapStatus: 'Статус на акаунта',
          activeSession: 'Активен личен достъп',
          temporaryAccess: 'Временен достъп',
          starterProfile: 'членски профил',
          databaseReady: 'Акаунт сесия',
          databaseReadyText:
            'Акаунтът е влязъл успешно и частната членска зона е готова за работа.',
          ownerDetailsText:
            'Тук виждаш личния акаунт зад своето членско присъствие в платформата.',
          fallbackBio:
            'Допълвай и развивай членския си профил, докато изграждаш присъствието си в платформата.',
          statusMeta: 'идентичност • достъп • сесия',
        },
      },
      myDogs: {
        eyebrow: 'Членска зона',
        title: 'Моето Cane Corso',
        description:
          'Управлявай всеки Cane Corso профил от едно премиум лично пространство. Черновите, редакциите, прегледът и публикуването следват една ясна последователност.',
        noDogsTitle: 'Все още няма добавен Cane Corso',
        noDogsDescription:
          'Добави първия си Cane Corso профил, за да започнеш частния поток като собственик и да го подготвиш за преглед, когато си готов.',
        publicationTitle: 'От чернова до публичен регистър',
        publicationSteps: [
          'Създай основата на профила',
          'Довърши представянето за регистъра и собственика',
          'Добави галерия и главно изображение',
          'Изпрати за преглед',
          'Публикувай в регистъра на Cane Corso Platform',
        ],
        buildSliceTitle: 'Частният членски поток е активен',
        buildSliceText:
          'My Dogs вече следва реалната връзка между членски акаунт и профил, преди да започнат редакции или действия по преглед.',
        labels: {
          totalProfiles: 'Общо профили',
          publicProfiles: 'Публични профили',
          readyForReview: 'Готови за преглед',
          drafts: 'Чернови',
          profiles: 'Профили на Cane Corso',
        },
      },
      newDog: {
        eyebrow: 'Членска зона',
        title: 'Добави Cane Corso профил',
        description:
          'Започни директно с формата: добави основните данни, качи снимки, попълни родословие ако го имаш и после запази или изпрати за преглед.',
        pillA: 'Основни данни',
        pillB: 'Снимки',
        pillC: 'Родословие',
      },
      editDog: {
        eyebrow: 'Членска зона',
        title: 'Редактирай профил на Cane Corso',
        description:
          'Обнови формата, провери прегледа вдясно и изпрати профила за преглед, когато важните данни са готови.',
        pillA: 'Редакция',
        pillB: 'Снимки',
        pillC: 'Преглед',
      },
    },
    form: {
      validationEyebrow: 'Проверка на профила',
      validationClean: 'Профилът е подреден и готов за следващата стъпка',
      validationDetected: 'полета искат внимание',
      validationText:
        'Провери основните полета, преди да запазиш чернова или да изпратиш профила за преглед. Така преминаваш по-спокойно към публикация.',
      sections: {
        foundationTitleCreate: 'Основа на профила',
        foundationTitleEdit: 'Данни за профила',
        foundationDescription:
          'Попълни най-важните данни за профила. Оттук започват името, идентичността и основата на публичния запис.',
        registryTitle: 'Информация за регистъра',
        registryDescription:
          'Тук подреждаш регистрационните данни, класа в регистъра и всичко важно за по-ясно и достоверно присъствие.',
        presentationTitle: 'Представяне',
        presentationDescription:
          'Краткото и дългото описание оформят представянето на твоето Cane Corso в картата и в публичната страница.',
        locationTitle: 'Локация',
        locationDescription:
          'Локацията помага профилът да бъде подреден ясно и полезно за бъдещи търсения, филтри и регионално присъствие.',
      },
      fields: {
        name: 'Име на Cane Corso',
        slug: 'Адрес на профила',
        sex: 'Пол',
        male: 'Мъжки',
        female: 'Женски',
        birthDate: 'Дата на раждане',
        color: 'Цвят',
        visibility: 'Видимост',
        private: 'Частен',
        public: 'Публичен',
        microchip: 'Номер на микрочип',
        pedigree: 'Номер на родословие',
        currentStatus: 'Текущ статус',
        bloodline: 'Бележка за линия',
        shortDescription: 'Кратко описание',
        longDescription: 'Дълго описание',
        city: 'Град',
        country: 'Държава',
      },
      placeholders: {
        name: 'Въведи име на Cane Corso',
        slug: 'unikalen-profil-slug',
        color: 'Черен, сив, formentino...',
        selectColor: 'Избери цвят',
        microchip: 'Номер на микрочип',
        pedigree: 'Номер на родословие',
        bloodline: 'Незадължителна бележка за линия',
        shortDescription: 'Кратко премиум описание за картата на профила',
        longDescription: 'Незадължителна по-дълга история за профила',
        city: 'Град',
        country: 'Държава',
        selectCountry: 'Избери държава',
      },
      options: {
        colors: {
          black: 'Черен',
          blackBrindle: 'Черен тигров',
          grey: 'Сив',
          greyBrindle: 'Сив тигров',
          formentino: 'Форментино',
          fawn: 'Пясъчен',
          red: 'Червеникав',
          chestnutBrindle: 'Кестеняв тигров',
          blue: 'Син',
          other: 'Друг',
        },
        countries: {
          bulgaria: 'България',
          italy: 'Италия',
          serbia: 'Сърбия',
          romania: 'Румъния',
          greece: 'Гърция',
          northMacedonia: 'Северна Македония',
          albania: 'Албания',
          montenegro: 'Черна гора',
          croatia: 'Хърватия',
          slovenia: 'Словения',
          bosniaAndHerzegovina: 'Босна и Херцеговина',
          germany: 'Германия',
          france: 'Франция',
          spain: 'Испания',
          portugal: 'Португалия',
          netherlands: 'Нидерландия',
          belgium: 'Белгия',
          austria: 'Австрия',
          switzerland: 'Швейцария',
          unitedKingdom: 'Обединено кралство',
          ireland: 'Ирландия',
          poland: 'Полша',
          czechRepublic: 'Чехия',
          slovakia: 'Словакия',
          hungary: 'Унгария',
          turkey: 'Турция',
          unitedStates: 'САЩ',
          canada: 'Канада',
        },
      },
      actions: {
        draftFlow: 'Поток за създаване на чернова',
        editingProfile: 'Редактираш профил',
        saveDraftDefault:
          'Запази като чернова или изпрати профила за преглед, когато основните данни и родословието са подредени.',
      },
      preview: {
        livePreview: 'Преглед на профила',
        newCover: 'Нова корица на профила',
        currentCover: 'Текуща корица на профила',
        unnamed: 'Cane Corso без име',
        shortFallback: 'Прегледът ще се подреди автоматично, докато попълваш профила.',
        readiness: 'Състояние',
        validated: 'Профилът е готов за следваща стъпка',
        awaiting: 'Попълни, когато е налично',
        issuesToFix: 'полета за преглед',
        slug: 'Адрес',
        sex: 'Пол',
        birthDate: 'Рождена дата',
        color: 'Цвят',
        visibility: 'Видимост',
        country: 'Държава',
        registryStory: 'Представяне на профила',
        longFallback: 'Добави спокойно описание: произход, характер, линия, ежедневие и най-важното за този Cane Corso.',
        persistenceTitle: 'Текущо състояние',
        persistenceFallback: 'След запазване тук ще виждаш последното записване и готовността на профила за преглед.',
      },
      status: {
        draft: 'Чернова',
        submitted: 'Изпратен',
        needs_changes: 'Нужни промени',
        approved: 'Одобрен',
        published: 'Публикуван',
        archived: 'Архивиран',
      },
      workspace: {
        slugGenerated: 'Адресът на профила беше генериран от текущото име.',
        validationPassed: 'Основата на профила е подредена и е готова за записване или изпращане.',
        validationIssues: 'Валидацията откри проблеми. Прегледай маркираните полета, преди да продължиш.',
        submissionBlocked: 'Изпращането е спряно, докато не бъдат оправени всички маркирани проблеми.',
        submitMessageSuffix: 'основни полета са попълнени в момента.',
        serverActionFailedPrefix: 'Грешка при записване:',
        payloadTooLarge: 'Снимките бяха твърде големи за едно записване. Платформата вече подготвя по-леки копия за профила. Опитай да запазиш отново.',
        unexpectedApiResponse: 'Сървърът върна неочакван отговор. Опитай отново, след като снимките се подготвят докрай.',
        persistedTo: 'Последно записване на',
      },
      validation: {
        nameRequired: 'Името на Cane Corso е задължително.',
        slugRequired: 'Адресът на профила е задължителен.',
        slugPattern: 'Използвай само малки букви, цифри и тирета.',
        birthDateRequired: 'Рождената дата е задължителна за добре подреден профил в регистъра.',
        colorRequired: 'Цветът помага за класифициране на профила в регистъра.',
        microchipPattern: 'Номерът на микрочипа трябва да съдържа точно 15 цифри.',
        shortDescriptionRequired: 'Добави кратко обобщение на профила.',
        shortDescriptionLength: 'Краткото описание трябва да е поне 24 символа.',
        longDescriptionRequired: 'Добави по-дълга история за регистъра.',
        longDescriptionLength: 'Ако добавяш дълго описание, нека е поне 20 символа.',
        cityRequired: 'Градът е задължителен за по-пълен и полезен профил.',
        countryRequired: 'Държавата е задължителна за контекста на регистъра.',
      },
      dogCard: {
        pedigreePending: 'Родословието може да се добави по-късно',
        age: 'Възраст',
        visibility: 'Видимост',
        descriptionFallback: 'Представянето на профила се подготвя за личната работна зона.',
        manageMedia: 'Медии',
        birthDatePending: 'Добави рождената дата, когато е налична',
        months: 'месеца',
        years: 'години',
      },
    },
  },
  it: {
    meta: {
      title: 'UNICO SUO GENERE — Cane Corso Platform',
      description:
        'Registro premium, area membri, rete di partner fidati, conoscenza della razza e flussi di verifica per Cane Corso.',
    },
    site: {
      brandEyebrow: 'UNICO SUO GENERE',
      brandTitle: 'CANE CORSO PLATFORM',
      brandStatement: 'ONE OF A KIND',
      brandSubline: 'Registro d’élite, conoscenza affidabile e una casa digitale premium per la razza.',
      member: 'Membro',
      admin: 'Admin',
      exit: 'Esci',
      locale: 'Lingua',
      theme: 'Tema',
      darkTheme: 'Scura',
      heritageTheme: 'Chiara',
      trademark: 'USG — UNICO SUO GENERE™ by Stefano De Tanini',
      footerTitle: 'UNICO SUO GENERE — ONE OF A KIND',
      footerText:
        'Uno spazio premium per registro, strumenti per i membri, partner fidati, contenuti sulla razza e verifica pubblica.',
      footerMetaA: 'Fondazione della piattaforma Cane Corso',
      footerMetaB: 'Progettata per distinguersi',
    },
    navigation: {
      home: 'Inizio',
      registry: 'Registro',
      knowledge: 'Conoscenza',
      partners: 'Partner',
      verify: 'Verifica',
      myDogs: 'I miei Cane Corso',
      ecosystem: 'Ecosistema',
      profile: 'Profilo',
      reviewQueue: 'Moderazione',
      adminRegistry: 'Registro',
      adminMembers: 'Membri',
      adminPartners: 'Revisione partner',
      adminEcosystem: 'Revisione ecosistema',
    },
    common: {
      openSection: 'Apri sezione',
      exploreRegistry: 'Esplora il registro',
      enterMemberArea: 'Entra nell’area membri',
      joinMember: 'Diventa membro',
      joinPartner: 'Diventa partner',
      signIn: 'Accedi',
      help: 'Aiuto',
      learnMore: 'Scopri di più',
      futureLabel: 'Stato',
      premiumStatement: 'ONE OF A KIND',
      publicationPath: 'Percorso di pubblicazione',
      currentBuildSlice: 'Focus attuale',
      emptyState: 'Nessun record ancora',
      notSetYet: 'Non ancora impostato',
      pending: 'In attesa',
      lastPersisted: 'Ultimo salvataggio',
      saveDraft: 'Salva bozza',
      savingDraft: 'Salvataggio...',
      submitForReview: 'Invia per revisione',
      submitting: 'Invio...',
      manageMedia: 'Media più tardi',
      createProfile: 'Crea profilo',
      editProfile: 'Modifica profilo',
      addNewDog: 'Aggiungi Cane Corso',
      auto: 'Auto',
      runValidation: 'Esegui validazione',
      generateSlug: 'Genera slug',
      optional: 'facoltativo',
    },
    home: {
      eyebrow: 'UNICO SUO GENERE',
      badgeA: 'Registro',
      badgeB: 'Conoscenza',
      badgeC: 'Rete fidata',
      badgeD: 'Verifica',
      title: 'Una piattaforma premium Cane Corso con identità distinta',
      subtitle:
        'Costruita per apparire rara, credibile e inconfondibile — un ecosistema digitale per Cane Corso, proprietari, professionisti fidati e valore duraturo per la razza.',
      heroCardEyebrow: 'Presenza ufficiale del brand',
      heroCardTitle: 'Un’interfaccia premium oltre le directory kennel generiche',
      heroCardText:
        'USG sta prendendo forma come un’esperienza premium in nero e oro, con un raffinato livello di fiducia, profondità editoriale e strumenti membri degni della razza.',
      statAValue: '01',
      statALabel: 'Identità premium distinta',
      statBValue: '03',
      statBLabel: 'Strati principali della piattaforma online',
      statCValue: '∞',
      statCLabel: 'Spazio per futura crescita',
      pillarsEyebrow: 'Pilastri della piattaforma',
      pillarsTitle: 'Pensata come ecosistema completo Cane Corso',
      pillarsDescription:
        'La piattaforma è più di un registro. È costruita come casa digitale premium per la razza, i suoi proprietari e la rete fidata che la circonda.',
      statementEyebrow: 'Filosofia del brand',
      statementTitle: 'UNICO SUO GENERE — ONE OF A KIND',
      statementDescription:
        'Il livello identitario è intenzionale: scuro, raffinato, memorabile e chiaramente diverso dalle comuni piattaforme pet.',
      pillars: [
        {
          eyebrow: 'Registro',
          title: 'Profili e livello di fiducia',
          description:
            'Profili premium Cane Corso, flusso di revisione, presentazione pubblica nel registro e credibilità supportata da certificati.',
          href: '/registry',
          meta: 'Profili pubblicati • revisione • pagine di verifica',
        },
        {
          eyebrow: 'Conoscenza',
          title: 'Intelligenza della razza',
          description:
            'Storia, cura, addestramento, salute, temperamento e guida per i proprietari trasformati in una base di conoscenza Cane Corso a lungo termine.',
          href: '/knowledge',
          meta: 'Guide • articoli • educazione del proprietario',
        },
        {
          eyebrow: 'Rete',
          title: 'Partner fidati',
          description:
            'Cliniche, handler, trainer, fotografi, allevatori e altri servizi rilevanti curati per l’ecosistema della razza.',
          href: '/partners',
          meta: 'Candidature • elenchi fidati • visibilità',
        },
      ],
      zonesEyebrow: 'Livelli dell’applicazione',
      zonesTitle: 'Spazi pubblici, membri e moderazione',
      zonesDescription:
        'La prima versione è già strutturata attorno ai veri livelli di prodotto necessari per registro, proprietà, moderazione e pubblicazione affidabile.',
      zones: [
        {
          eyebrow: 'Pubblico',
          title: 'Esplora la piattaforma',
          description:
            'Scopri profili del registro, conoscenza della razza, partner listings e l’identità premium della piattaforma.',
          href: '/registry',
          meta: 'Registro • Conoscenza • Partner • Verifica',
        },
        {
          eyebrow: 'Membro',
          title: 'Gestisci i miei Cane Corso',
          description:
            'Profili personali, preparazione delle candidature e controllo di come ogni Cane Corso entra nel registro pubblico.',
          href: '/my-dogs',
          meta: 'Profilo • Cane Corso • Foto • Flusso di invio',
        },
        {
          eyebrow: 'Moderazione',
          title: 'Revisione e pubblicazione',
          description:
            'Superfici admin per qualità di pubblicazione, approvazioni partner, decisioni di fiducia e futura moderazione audit-friendly.',
          href: '/review',
          meta: 'Coda di revisione • revisione partner • controlli fiducia',
        },
      ],
    },
    pageShell: { accentLabel: 'Sigillo del brand' },
    pages: {
      registry: {
        eyebrow: 'Registro pubblico',
        title: 'Registro',
        description:
          'Registro pubblico per profili Cane Corso pubblicati, presentazione premium e scoperta affidabile.',
        heroNote:
          'Il profilo pubblicato è il livello pubblico di fiducia. Il certificato è un segnale separato e si conferma tramite Verify.',
        heroChipPublished: 'Profilo pubblicato',
        heroChipCertificate: 'Certificato USG',
        heroChipVerify: 'Percorso Verify',
        cards: [
          {
            eyebrow: 'Livello pubblicato',
            title: 'Elenco del registro',
            description:
              'Dog card pronte al pubblico con presentazione premium, riassunti orientati alla fiducia e discovery pubblica chiara.',
            meta: 'Публичен каталог • откриване • премиум визуален език',
          },
          {
            eyebrow: 'Profondità del profilo',
            title: 'Esperienza dettaglio cane',
            description:
              'Ogni voce del registro evolverà in una ricca pagina pubblica con galleria, identità, stato e segnali di verifica.',
            meta: 'Hero изображение • профилни данни • галерия • сертификатен слой',
          },
          {
            eyebrow: 'Fiducia',
            title: 'Ponte di verifica',
            description:
              'Il registro si collega direttamente alla verifica dei certificati così il pubblico può confermare autenticità e fiducia.',
            href: '/verify',
            meta: 'Публична проверка • слой на доверие • достоверност',
          },
        ],
      },
      knowledge: {
        eyebrow: 'Conoscenza della razza',
        title: 'Conoscenza',
        description:
          'Spazio educativo strutturato per storia, cura, addestramento, salute e guida pratica per i proprietari.',
        cards: [
          {
            eyebrow: 'Fondamento',
            title: 'Storia e identità della razza',
            description:
              'Uno strato editoriale curato sulle origini, lo scopo e le qualità distintive del Cane Corso.',
            meta: 'История • темперамент • идентичност',
          },
          {
            eyebrow: 'Guida pratica',
            title: 'Educazione del proprietario',
            description:
              'Contenuti strutturati su cura, alimentazione, routine, preparazione e proprietà responsabile nel lungo periodo.',
            meta: 'Грижа • хранене • рутина • насоки за собственици',
          },
          {
            eyebrow: 'Salute e training',
            title: 'Conoscenza applicata',
            description:
              'Sezioni pratiche su salute, socializzazione, addestramento e supporto quotidiano per Cane Corso.',
            meta: 'Здраве • тренировки • социализация',
          },
        ],
      },
      partners: {
        eyebrow: 'Rete fidata',
        title: 'Partner',
        description:
          'Base del directory partner per cliniche, trainer, handler, allevatori, fotografi e altri servizi Cane Corso.',
        cards: [
          {
            eyebrow: 'Rete fidata',
            title: 'Directory dei partner',
            description:
              'Una rete curata di cliniche, handler, trainer, allevatori, fotografi e altri servizi rilevanti per Cane Corso.',
            meta: 'Каталог • категории • локация',
          },
          {
            eyebrow: 'Visibilità',
            title: 'Presenza professionale',
            description:
              'I partner approvati avranno una presenza più forte con asset di brand, dettagli business e futura visibilità featured.',
            meta: 'Профили • материали • партньорски слой на доверие',
          },
          {
            eyebrow: 'Pipeline',
            title: 'Flusso di candidatura',
            description:
              'Le voci partner sono pensate per passare attraverso un processo di approvazione prima di entrare nella rete fidata.',
            href: '/admin/partners',
            meta: 'Кандидатури • преглед • доверено одобрение',
          },
        ],
      },
      review: {
        eyebrow: 'Moderazione admin',
        title: 'Revisione',
        description:
          'Shell di moderazione per rivedere candidature canine, richiedere modifiche, approvare e pubblicare.',
        cards: [
          {
            eyebrow: 'Moderazione',
            title: 'Coda delle candidature',
            description:
              'La superficie di moderazione principale per rivedere bozze, decidere la prontezza e imporre qualità di pubblicazione.',
            meta: 'Опашка • решения • контрол на публикацията',
          },
          {
            eyebrow: 'Feedback',
            title: 'Note di revisione',
            description:
              'I revisori lasceranno richieste di modifica, contesto di approvazione e note audit-friendly qui.',
            meta: 'Нужни промени • одобряване • отказ',
          },
          {
            eyebrow: 'Pubblicazione',
            title: 'Rilascio nel registro',
            description:
              'Le candidature approvate passeranno dallo spazio membri al registro pubblico con stati di pubblicazione tracciabili e orientati alla fiducia.',
            href: '/registry',
            meta: 'Одобрение • публикуване • запис в регистъра',
          },
        ],
      },
      adminPartners: {
        eyebrow: 'Moderazione admin',
        title: 'Revisione partner',
        description:
          'Area di approvazione per candidature partner, controlli di fiducia e curatela della rete affidabile.',
        cards: [
          {
            eyebrow: 'Candidature',
            title: 'Intake partner',
            description:
              'Il lato admin della rete partner fidata inizia con candidature revisionabili e dettagli business pronti per la verifica.',
            meta: 'Кандидатури • контакти • бизнес данни',
          },
          {
            eyebrow: 'Verifica',
            title: 'Controlli di fiducia',
            description:
              'Gli admin valideranno idoneità, qualità e coerenza prima che un partner diventi visibile nella rete pubblica.',
            meta: 'Валидация • одобрение • отказ • качество',
          },
          {
            eyebrow: 'Presentazione',
            title: 'Visibilità featured',
            description:
              'I partner approvati otterranno in seguito pagine brandizzate, stati featured e posizionamento premium nella piattaforma.',
            href: '/partners',
            meta: 'Одобрени списъци • подчертани позиции',
          },
        ],
      },
      verify: {
        eyebrow: 'Verifica',
        titlePrefix: 'Certificato',
        description: 'Verifica pubblica per certificati USG attivi collegati a record pubblicati nel registro.',
        cards: {
          identity: {
            eyebrow: 'Ricerca',
            title: 'Identità del certificato',
            description:
              'Verify conferma se un certificato appartiene a un record Cane Corso pubblicato nel registro e se il certificato resta attivo.',
          },
          outcome: {
            eyebrow: 'Risultato',
            title: 'Esito della verifica',
            description:
              'Il visitatore vede un risultato pubblico chiaro che indica se il certificato è attivo, revocato o scaduto.',
            meta: 'Attivo • revocato • scaduto',
          },
          bridge: {
            eyebrow: 'Percorso al registro',
            title: 'Profilo cane collegato',
            description:
              'Ogni certificato verificato rimanda al profilo Cane Corso pubblicato così il visitatore può controllare il contesto pubblico completo.',
            href: '/registry',
            meta: 'Link profilo • stato del certificato • fiducia pubblica',
          },
        },
      },
      profile: {
        eyebrow: 'Area membri',
        title: 'Profilo',
        description:
          'Il tuo profilo membro personale e i dettagli dell’account per l’area privata della piattaforma.',
        cards: {
          memberIdentity: 'Identità membro',
          ownerDetails: 'Dettagli del proprietario',
          bootstrapStatus: 'Stato account',
          activeSession: 'Accesso privato attivo',
          temporaryAccess: 'Accesso temporaneo',
          starterProfile: 'profilo membro',
          databaseReady: 'Sessione account',
          databaseReadyText:
            'Il tuo account ha una sessione attiva ed è pronto per l’area privata membri.',
          ownerDetailsText:
            'Qui vedi l’account personale dietro la tua presenza membro nella piattaforma.',
          fallbackBio:
            'Completa e affina i tuoi dettagli membro mentre la tua presenza nella piattaforma cresce.',
          statusMeta: 'identità • accesso • sessione',
        },
      },
      myDogs: {
        eyebrow: 'Area membri',
        title: 'I miei cani',
        description:
          'Gestisci ogni profilo Cane Corso da un’unica area privata premium. Bozze, modifiche, revisione e pubblicazione restano collegate in un flusso chiaro.',
        noDogsTitle: 'Nessun cane aggiunto',
        noDogsDescription:
          'Aggiungi il tuo primo profilo Cane Corso per iniziare il flusso proprietario privato e prepararlo alla revisione quando sei pronto.',
        publicationTitle: 'Dalla bozza al registro pubblico',
        publicationSteps: [
          'Crea la base del profilo',
          'Raffina la presentazione del registro e del proprietario',
          'Aggiungi galleria e immagine hero principale',
          'Invia per revisione',
          'Pubblica nel registro Cane Corso Platform',
        ],
        buildSliceTitle: 'Il flusso membri privato è attivo',
        buildSliceText:
          'My Dogs ora segue la relazione reale tra account membro e profilo prima che inizino modifiche o azioni di revisione.',
        labels: {
          totalProfiles: 'Profili totali',
          publicProfiles: 'Profili pubblici',
          readyForReview: 'Pronti per revisione',
          drafts: 'Bozze',
          profiles: 'Profili dei cani',
        },
      },
      newDog: {
        eyebrow: 'Area membri',
        title: 'Aggiungi un profilo Cane Corso',
        description:
          'Inizia direttamente dal modulo: aggiungi i dati principali, carica foto, inserisci il pedigree se disponibile, poi salva o invia alla revisione.',
        pillA: 'Dati principali',
        pillB: 'Foto',
        pillC: 'Pedigree',
      },
      editDog: {
        eyebrow: 'Area membri',
        title: 'Modifica profilo Cane Corso',
        description:
          'Aggiorna il modulo, controlla l’anteprima e invia il profilo alla revisione quando i dati importanti sono pronti.',
        pillA: 'Modifica',
        pillB: 'Foto',
        pillC: 'Revisione',
      },
    },
    form: {
      validationEyebrow: 'Controllo profilo',
      validationClean: 'Il profilo sembra pronto per il prossimo passo',
      validationDetected: 'problemi di campo rilevati',
      validationText:
        'Controlla i campi richiesti prima di salvare una bozza o inviare il profilo alla revisione.',
      sections: {
        foundationTitleCreate: 'Base del profilo',
        foundationTitleEdit: 'Dati del profilo',
        foundationDescription:
          'Compila prima i dati più importanti. Nome, identità, foto e informazioni principali creano la base del profilo.',
        registryTitle: 'Informazioni di registro',
        registryDescription:
          'Questi campi aiutano l’amministratore a capire classe di registro, documenti e qualità del profilo.',
        presentationTitle: 'Presentazione',
        presentationDescription:
          'La descrizione breve e quella lunga formano la presentazione futura del Cane Corso.',
        locationTitle: 'Località',
        locationDescription:
          'La posizione mantiene il profilo chiaro e utile per filtri e contesto pubblico futuri.',
      },
      fields: {
        name: 'Nome del cane',
        slug: 'Slug del profilo',
        sex: 'Sesso',
        male: 'Maschio',
        female: 'Femmina',
        birthDate: 'Data di nascita',
        color: 'Colore',
        visibility: 'Visibilità',
        private: 'Privato',
        public: 'Pubblico',
        microchip: 'Numero microchip',
        pedigree: 'Numero pedigree',
        currentStatus: 'Stato corrente',
        bloodline: 'Nota genealogica',
        shortDescription: 'Descrizione breve',
        longDescription: 'Descrizione lunga',
        city: 'Città',
        country: 'Paese',
      },
      placeholders: {
        name: 'Inserisci il nome del cane',
        slug: 'slug-profilo-unico',
        color: 'Nero, grigio, formentino...',
        selectColor: 'Seleziona colore',
        microchip: 'Numero microchip',
        pedigree: 'Numero pedigree',
        bloodline: 'Nota genealogica opzionale',
        shortDescription: 'Breve sintesi premium per la card del profilo',
        longDescription: 'Storia del profilo più ampia, facoltativa',
        city: 'Città',
        country: 'Paese',
        selectCountry: 'Seleziona paese',
      },
      options: {
        colors: {
          black: 'Nero',
          blackBrindle: 'Nero tigrato',
          grey: 'Grigio',
          greyBrindle: 'Grigio tigrato',
          formentino: 'Formentino',
          fawn: 'Fulvo',
          red: 'Rosso',
          chestnutBrindle: 'Castano tigrato',
          blue: 'Blu',
          other: 'Altro',
        },
        countries: {
          bulgaria: 'Bulgaria',
          italy: 'Italia',
          serbia: 'Serbia',
          romania: 'Romania',
          greece: 'Grecia',
          northMacedonia: 'Macedonia del Nord',
          albania: 'Albania',
          montenegro: 'Montenegro',
          croatia: 'Croazia',
          slovenia: 'Slovenia',
          bosniaAndHerzegovina: 'Bosnia ed Erzegovina',
          germany: 'Germania',
          france: 'Francia',
          spain: 'Spagna',
          portugal: 'Portogallo',
          netherlands: 'Paesi Bassi',
          belgium: 'Belgio',
          austria: 'Austria',
          switzerland: 'Svizzera',
          unitedKingdom: 'Regno Unito',
          ireland: 'Irlanda',
          poland: 'Polonia',
          czechRepublic: 'Repubblica Ceca',
          slovakia: 'Slovacchia',
          hungary: 'Ungheria',
          turkey: 'Turchia',
          unitedStates: 'Stati Uniti',
          canada: 'Canada',
        },
      },
      actions: {
        draftFlow: 'Flusso di creazione bozza',
        editingProfile: 'Modifica profilo',
        saveDraftDefault:
          'Salva una bozza o invia il profilo alla revisione quando i dati principali sono pronti.',
      },
      preview: {
        livePreview: 'Anteprima live',
        newCover: 'Nuova copertina profilo',
        currentCover: 'Copertina profilo attuale',
        unnamed: 'Cane Corso senza nome',
        shortFallback: 'Qui apparirà un’anteprima raffinata del profilo Cane Corso.',
        readiness: 'Prontezza',
        validated: 'Base del profilo validata',
        awaiting: 'In attesa di validazione',
        issuesToFix: 'problemi da risolvere',
        slug: 'Slug',
        sex: 'Sesso',
        birthDate: 'Data di nascita',
        color: 'Colore',
        visibility: 'Visibilità',
        country: 'Paese',
        registryStory: 'Storia del registro',
        longFallback: 'Qui appariranno la storia estesa del profilo e la presentazione del proprietario.',
        persistenceTitle: 'Stato corrente',
        persistenceFallback: 'Dopo il salvataggio, qui appare lo stato più recente del profilo.',
      },
      status: {
        draft: 'Bozza',
        submitted: 'Inviato',
        needs_changes: 'Modifiche richieste',
        approved: 'Approvato',
        published: 'Pubblicato',
        archived: 'Archiviato',
      },
      workspace: {
        slugGenerated: 'Lo slug è stato generato dal nome attuale del profilo.',
        validationPassed: 'Il profilo sembra pronto per essere salvato o inviato alla revisione.',
        validationIssues: 'La validazione ha trovato problemi. Rivedi i campi evidenziati prima di continuare.',
        submissionBlocked: 'Invio bloccato finché tutti i problemi evidenziati non vengono corretti.',
        submitMessageSuffix: 'campi principali del profilo sono attualmente compilati.',
        serverActionFailedPrefix: 'Errore durante il salvataggio:',
        payloadTooLarge: 'Le foto selezionate erano troppo grandi per un unico salvataggio. La piattaforma ora prepara copie più leggere prima del salvataggio. Prova a salvare di nuovo.',
        unexpectedApiResponse: 'Il server ha restituito una risposta inattesa. Riprova dopo la preparazione delle foto.',
        persistedTo: 'Ultimo salvataggio il',
      },
      validation: {
        nameRequired: 'Il nome del cane è obbligatorio.',
        slugRequired: 'Lo slug del profilo è obbligatorio.',
        slugPattern: 'Usa solo lettere minuscole, numeri e trattini.',
        birthDateRequired: 'La data di nascita è obbligatoria per un profilo pronto per il registro.',
        colorRequired: 'Il colore aiuta a classificare il profilo nel registro.',
        microchipPattern: 'Il numero microchip deve contenere esattamente 15 cifre.',
        shortDescriptionRequired: 'Aggiungi una breve sintesi del profilo.',
        shortDescriptionLength: 'La descrizione breve deve avere almeno 24 caratteri.',
        longDescriptionRequired: 'Aggiungi una storia più lunga per il registro.',
        longDescriptionLength: 'Se aggiungi una descrizione lunga, usa almeno 20 caratteri.',
        cityRequired: 'La città è obbligatoria per discovery e contesto regionale.',
        countryRequired: 'Il paese è obbligatorio per il contesto del registro.',
      },
      dogCard: {
        pedigreePending: 'Pedigree in attesa',
        age: 'Età',
        visibility: 'Visibilità',
        descriptionFallback: 'La presentazione del profilo è in preparazione nell’area personale.',
        manageMedia: 'Foto',
        birthDatePending: 'Data di nascita in attesa',
        months: 'mesi',
        years: 'anni',
      },
    },
  },
};

const dictionaryExtensions: Record<string, any> = {
  en: {
    common: {
      close: 'Close',
    },
    pages: {
      myDogs: {
        labels: {
          published: 'Published',
          inReview: 'In review',
          needsChanges: 'Needs changes',
        },
      },
    },
    form: {
      sections: {
        pedigreeTitle: 'Family & pedigree',
        pedigreeDescription:
          'Add parents, maternal line, paternal line, and great-grandparents without overloading the page. The main Cane Corso remains central; the family tree stays compact and elegant.',
      },
      fields: {
        registryClass: 'Registry class',
      },
      registryClass: {
        verified_pedigree: 'Verified pedigree',
        documented_without_pedigree: 'Documented without full pedigree',
        owner_declared_cane_corso: 'Owner-declared Cane Corso',
        rescue_unknown_lineage: 'Rescue / unknown lineage',
      },
      registryClassDescriptions: {
        verified_pedigree: 'For Cane Corso with verified pedigree documentation and confirmed lineage.',
        documented_without_pedigree: 'For real Cane Corso with documents or proof, but without a complete pedigree chain.',
        owner_declared_cane_corso: 'For real Cane Corso approved by the registry owner even when pedigree paperwork is missing.',
        rescue_unknown_lineage: 'For rescued or adopted Cane Corso where lineage is incomplete or fully unknown.',
      },
      ownerStatus: {
        eyebrow: 'Публикация',
        title: 'Submission & publication status',
        registryClassLabel: 'Registry class',
        help: {
          draft: 'This profile is still private and editable. Keep refining the details before sending it for review.',
          submitted: 'This profile is in the moderation queue. You can still review what you submitted, but the status itself is controlled by the review team.',
          needs_changes: 'The review team requested adjustments. Update the profile and submit it again when it is ready.',
          approved: 'This profile passed review and is ready for publication handling.',
          published: 'This Cane Corso is already visible in the registry flow.',
          archived: 'This profile is no longer active in the public flow, but the data remains preserved.',
        },
      },
      pedigree: {
        eyebrow: 'Родители и родословие',
        summaryTitle: 'Build lineage without making the page heavy',
        summaryText:
          'First complete the main profile. Then open the pedigree canvas only when you want to build the family line in a calm, visual way.',
        showTree: 'Show pedigree',
        hideTree: 'Hide pedigree',
        collapsedHint: 'Open the pedigree when you are ready to add parents, lines, and great-grandparents in a visual family tree.',
        ready: 'Filled',
        empty: 'Empty',
        treeEyebrow: 'Pedigree view',
        treeTitle: 'Family tree overview',
        treeDescription: 'A visual pedigree board for {dog}. Click any ancestor card to open the image and details.',
        snapshotTitle: 'Family snapshot',
        snapshotHint: 'Use “Show pedigree” in the form to open the visual tree and fill each branch step by step.',
        editorEyebrow: 'Pedigree details',
        editorTitle: 'Fill each branch only when you have real information',
        editorText: 'Open a card only when you want to add a parent, a line, or the next generation. The tree above grows only for the branches you really know.',
        progressive: {
          helpCta: 'Help / how this page works',
          add: 'Add',
          edit: 'Edit',
          remove: 'Remove',
          collapse: 'Hide fields',
          savedHint: 'This relative is already prepared. Open the fields only when you want to refine the details.',
          emptyHint: 'The fields stay hidden until you decide to add this relation.',
          openHint: 'Add a reference photo, then only the details you really know for this ancestor.',
          uploadImage: 'Upload image',
          replaceImage: 'Replace image',
          removeImage: 'Remove image',
          imageLabel: 'Ancestor image',
          imageHint: 'Choose an image from your device. It will appear immediately in the form and pedigree tree.',
          stepOne: 'Complete the main Cane Corso profile first.',
          stepTwo: 'Then add only the parents and branches you truly know.',
          stepThree: 'The tree above expands only for the branches you have filled.',
          parentsTitle: 'Add parents only if they are known',
          parentsText: 'You do not need to fill everything at once. Open only mother and father when you have real information.',
          addParents: 'Add parents (if known)',
          paternalTitle: 'Add the father’s parents only if they are known',
          paternalReady: 'The father is already added. You can now open only his line and continue calmly.',
          waitingForFather: 'First add the father. Then you can open the paternal line.',
          addPaternal: 'Add the father’s parents',
          maternalTitle: 'Add the mother’s parents only if they are known',
          maternalReady: 'The mother is already added. Open only the maternal line and continue step by step.',
          waitingForMother: 'First add the mother. Then you can open the maternal line.',
          addMaternal: 'Add the mother’s parents',
          greatTitle: 'Expand the tree only when you know the next generation too',
          greatReady: 'Only the branches that already have at least one grandparent will open here.',
          waitingForGrandparents: 'First add at least one grandparent. Then the next generation can appear.',
          addGreat: 'Add the next generation',
        },
        groups: {
          parents: 'Parents',
          maternalLine: 'Maternal line',
          paternalLine: 'Paternal line',
          greatGrandparents: 'Great-grandparents',
        },
        groupDescriptions: {
          parents: 'Mother and father of the current Cane Corso.',
          maternalLine: 'The mother’s side of the family tree.',
          paternalLine: 'The father’s side of the family tree.',
          greatGrandparents: 'The next generation above the grandparents, kept compact and optional.',
        },
        stats: {
          filledAncestors: 'filled ancestors',
          ancestorPhotos: 'ancestor photos',
          photoRule: 'main dog photos / ancestor photo rule',
        },
        fields: {
          name: 'Name',
          photoUrl: 'Reference photo URL',
          sex: 'Sex',
          birthDate: 'Birth date',
          color: 'Color',
          country: 'Country',
          titles: 'Titles',
          note: 'Lineage note',
        },
        placeholders: {
          name: 'Enter relative name',
          photoUrl: 'https://...',
          selectSex: 'Select sex',
          color: 'Color',
          country: 'Country',
          titles: 'Titles or kennel note',
          note: 'Short note about the line',
        },
        modal: {
          unknownAncestor: 'Unnamed ancestor',
        },
        relations: {
          mother: 'Mother',
          father: 'Father',
          motherMother: 'Maternal grandmother',
          motherFather: 'Maternal grandfather',
          fatherMother: 'Paternal grandmother',
          fatherFather: 'Paternal grandfather',
          motherMotherMother: 'Mother of maternal grandmother',
          motherMotherFather: 'Father of maternal grandmother',
          motherFatherMother: 'Mother of maternal grandfather',
          motherFatherFather: 'Father of maternal grandfather',
          fatherMotherMother: 'Mother of paternal grandmother',
          fatherMotherFather: 'Father of paternal grandmother',
          fatherFatherMother: 'Mother of paternal grandfather',
          fatherFatherFather: 'Father of paternal grandfather',
        },
        subtitles: {
          mother: 'Primary maternal profile',
          father: 'Primary paternal profile',
          motherMother: 'Mother side • grandmother',
          motherFather: 'Mother side • grandfather',
          fatherMother: 'Father side • grandmother',
          fatherFather: 'Father side • grandfather',
          motherMotherMother: 'Maternal line • upper branch',
          motherMotherFather: 'Maternal line • upper branch',
          motherFatherMother: 'Maternal line • upper branch',
          motherFatherFather: 'Maternal line • upper branch',
          fatherMotherMother: 'Paternal line • upper branch',
          fatherMotherFather: 'Paternal line • upper branch',
          fatherFatherMother: 'Paternal line • upper branch',
          fatherFatherFather: 'Paternal line • upper branch',
        },
      },
    },
  },
  bg: {
    common: {
      close: 'Затвори',
    },
    pages: {
      myDogs: {
        labels: {
          published: 'Публикувани',
          inReview: 'В преглед',
          needsChanges: 'Нужни корекции',
        },
      },
    },
    form: {
      sections: {
        pedigreeTitle: 'Семейство и родословие',
        pedigreeDescription:
          'Добави родители, майчина линия, бащина линия и прародители, без страницата да става тежка. Основното Cane Corso остава водещо, а родословното дърво е компактно и елегантно.',
      },
      fields: {
        registryClass: 'Клас в регистъра',
      },
      registryClass: {
        verified_pedigree: 'Потвърдено родословие',
        documented_without_pedigree: 'Документирано без пълно родословие',
        owner_declared_cane_corso: 'Декларирано от собственика Cane Corso',
        rescue_unknown_lineage: 'Rescue / неизвестен произход',
      },
      registryClassDescriptions: {
        verified_pedigree: 'За Cane Corso с потвърдени pedigree документи и ясна линия.',
        documented_without_pedigree: 'За истинско Cane Corso с документи или доказателства, но без пълна pedigree верига.',
        owner_declared_cane_corso: 'За истинско Cane Corso, одобрено от собственика на регистъра, дори когато липсват родословни документи.',
        rescue_unknown_lineage: 'За rescue или осиновено Cane Corso, при което линията е частично или напълно неизвестна.',
      },
      ownerStatus: {
        eyebrow: 'Публикация',
        title: 'Статус на профила',
        registryClassLabel: 'Клас в регистъра',
        help: {
          draft: 'Профилът е още частен и може спокойно да се редактира. Довърши данните и родословието, преди да го изпратиш за преглед.',
          submitted: 'Профилът вече е изпратен за преглед. Виждаш подаденото от теб съдържание, а статутът се управлява от екипа за преглед.',
          needs_changes: 'Искани са корекции. Обнови профила, прегледай родителите и описанията, и изпрати отново, когато е готов.',
          approved: 'Профилът е одобрен и е готов за публикуване в регистъра.',
          published: 'Този Cane Corso вече е видим в публичния регистър.',
          archived: 'Профилът вече не е активен публично, но данните са запазени.',
        },
      },
      pedigree: {
        eyebrow: 'Родители и родословие',
        summaryTitle: 'Добави родители и семейна линия спокойно и подредено',
        summaryText:
          'Първо попълни основния профил. После отвори родословието, когато искаш да добавиш майка, баща и следващите линии във визуално дърво.',
        showTree: 'Покажи родословие',
        hideTree: 'Скрий родословие',
        collapsedHint: 'Отвори родословието, когато си готов да добавиш майка, баща, линии и прапредци във визуално дърво.',
        ready: 'Попълнено',
        empty: 'Празно',
        treeEyebrow: 'Родословно дърво',
        treeTitle: 'Преглед на семейното дърво',
        treeDescription: 'Визуално родословно дърво за {dog}. Кликни върху всяка карта на предец, за да отвориш снимката и данните.',
        snapshotTitle: 'Семейна моментна картина',
        snapshotHint: 'Използвай „Покажи родословие“, за да добавяш всеки родител и всяка линия стъпка по стъпка, без да утежняваш страницата.',
        editorEyebrow: 'Детайли за родители и линии',
        editorTitle: 'Попълвай всеки родител и всяка линия само когато имаш реална информация',
        editorText: 'Отваряй карта само когато искаш да добавиш родител, линия или следващо поколение. Дървото отгоре расте само за клоновете, които наистина знаеш.',
        progressive: {
          helpCta: 'Помощ / как се работи',
          add: 'Добави',
          edit: 'Редактирай',
          remove: 'Премахни',
          collapse: 'Скрий полетата',
          savedHint: 'Този роднина вече е подготвен. Отвори полетата само когато искаш да допълниш детайлите.',
          emptyHint: 'Полетата остават скрити, докато не решиш да добавиш тази връзка.',
          openHint: 'Добави референтна снимка, после само детайлите, които наистина знаеш за този предец.',
          uploadImage: 'Качи снимка',
          replaceImage: 'Смени снимката',
          removeImage: 'Премахни снимката',
          imageLabel: 'Снимка на предеца',
          imageHint: 'Избери снимка от устройството си. Тя ще се покаже веднага във формата и в родословното дърво.',
          stepOne: 'Първо попълни основния Cane Corso профил.',
          stepTwo: 'После добавяй само родителите и линиите, които реално знаеш.',
          stepThree: 'Дървото отгоре се разширява само за попълнените клонове.',
          parentsTitle: 'Добави родители само ако са известни',
          parentsText: 'Не е нужно да попълваш всичко наведнъж. Отвори само майка и баща, когато имаш реална информация.',
          addParents: 'Добави родители (ако се знаят)',
          paternalTitle: 'Добави родителите на бащата само ако са известни',
          paternalReady: 'Бащата вече е добавен. Можеш да отвориш само неговата линия и да продължиш спокойно.',
          waitingForFather: 'Първо добави бащата. След това ще можеш да отвориш бащината линия.',
          addPaternal: 'Добави родители на бащата',
          maternalTitle: 'Добави родителите на майката само ако са известни',
          maternalReady: 'Майката вече е добавена. Отвори само майчината линия и продължи стъпка по стъпка.',
          waitingForMother: 'Първо добави майката. След това ще можеш да отвориш майчината линия.',
          addMaternal: 'Добави родители на майката',
          greatTitle: 'Разшири дървото само ако знаеш и следващото поколение',
          greatReady: 'Тук ще се покажат само клоновете, за които вече има баба или дядо.',
          waitingForGrandparents: 'Първо добави поне една баба или дядо. После ще можеш да покажеш следващото поколение.',
          addGreat: 'Добави следващо поколение',
        },
        groups: {
          parents: 'Родители',
          maternalLine: 'Майчина линия',
          paternalLine: 'Бащина линия',
          greatGrandparents: 'Прапредци',
        },
        groupDescriptions: {
          parents: 'Майка и баща на текущото Cane Corso.',
          maternalLine: 'Линията от страната на майката.',
          paternalLine: 'Линията от страната на бащата.',
          greatGrandparents: 'Следващото поколение над бабите и дядовците, запазено компактно и по избор.',
        },
        stats: {
          filledAncestors: 'попълнени предци',
          ancestorPhotos: 'снимки на предци',
          photoRule: 'главни снимки / снимки на предци',
        },
        fields: {
          name: 'Име',
          photoUrl: 'URL на референтна снимка',
          sex: 'Пол',
          birthDate: 'Дата на раждане',
          color: 'Цвят',
          country: 'Държава',
          titles: 'Титли',
          note: 'Бележка за линията',
        },
        placeholders: {
          name: 'Въведи име на роднината',
          photoUrl: 'https://...',
          selectSex: 'Избери пол',
          color: 'Цвят',
          country: 'Държава',
          titles: 'Титли или бележка за линията',
          note: 'Кратка бележка за линията',
        },
        modal: {
          unknownAncestor: 'Предец без име',
        },
        relations: {
          mother: 'Майка',
          father: 'Баща',
          motherMother: 'Майчина баба',
          motherFather: 'Майчин дядо',
          fatherMother: 'Бащина баба',
          fatherFather: 'Бащин дядо',
          motherMotherMother: 'Майка на майчината баба',
          motherMotherFather: 'Баща на майчината баба',
          motherFatherMother: 'Майка на майчиния дядо',
          motherFatherFather: 'Баща на майчиния дядо',
          fatherMotherMother: 'Майка на бащината баба',
          fatherMotherFather: 'Баща на бащината баба',
          fatherFatherMother: 'Майка на бащиния дядо',
          fatherFatherFather: 'Баща на бащиния дядо',
        },
        subtitles: {
          mother: 'Основен майчин профил',
          father: 'Основен бащин профил',
          motherMother: 'Майчина страна • баба',
          motherFather: 'Майчина страна • дядо',
          fatherMother: 'Бащина страна • баба',
          fatherFather: 'Бащина страна • дядо',
          motherMotherMother: 'Майчина линия • горен клон',
          motherMotherFather: 'Майчина линия • горен клон',
          motherFatherMother: 'Майчина линия • горен клон',
          motherFatherFather: 'Майчина линия • горен клон',
          fatherMotherMother: 'Бащина линия • горен клон',
          fatherMotherFather: 'Бащина линия • горен клон',
          fatherFatherMother: 'Бащина линия • горен клон',
          fatherFatherFather: 'Бащина линия • горен клон',
        },
      },
    },
  },
  it: {
    common: {
      close: 'Chiudi',
    },
    pages: {
      myDogs: {
        labels: {
          published: 'Pubblicati',
          inReview: 'In revisione',
          needsChanges: 'Modifiche richieste',
        },
      },
    },
    form: {
      sections: {
        pedigreeTitle: 'Famiglia e pedigree',
        pedigreeDescription:
          'Aggiungi genitori, linea materna, linea paterna e bisnonni senza appesantire la pagina. Il Cane Corso principale resta centrale; l’albero genealogico rimane compatto ed elegante.',
      },
      fields: {
        registryClass: 'Classe nel registro',
      },
      registryClass: {
        verified_pedigree: 'Pedigree verificato',
        documented_without_pedigree: 'Documentato senza pedigree completo',
        owner_declared_cane_corso: 'Cane Corso dichiarato dal proprietario',
        rescue_unknown_lineage: 'Rescue / linea sconosciuta',
      },
      registryClassDescriptions: {
        verified_pedigree: 'Per Cane Corso con documenti pedigree verificati e linea confermata.',
        documented_without_pedigree: 'Per Cane Corso reale con documenti o prove, ma senza catena pedigree completa.',
        owner_declared_cane_corso: 'Per Cane Corso reale approvato dal proprietario del registro anche senza documenti pedigree.',
        rescue_unknown_lineage: 'Per Cane Corso rescue o adottato con linea parziale o completamente sconosciuta.',
      },
      ownerStatus: {
        eyebrow: 'Panoramica proprietario',
        title: 'Stato di invio e pubblicazione',
        registryClassLabel: 'Classe nel registro',
        help: {
          draft: 'Questo profilo è ancora privato e modificabile. Continua a rifinirlo prima di inviarlo in revisione.',
          submitted: 'Questo profilo è nella coda di moderazione. Puoi vedere ciò che hai inviato, ma lo stato è controllato dal team di revisione.',
          needs_changes: 'Il team di revisione ha richiesto modifiche. Aggiorna il profilo e invialo di nuovo quando è pronto.',
          approved: 'Questo profilo ha superato la revisione ed è pronto per la pubblicazione.',
          published: 'Questo Cane Corso è già visibile nel flusso del registro.',
          archived: 'Questo profilo non è più attivo nel flusso pubblico, ma i dati restano conservati.',
        },
      },
      pedigree: {
        eyebrow: 'Родители и родословие',
        summaryTitle: 'Costruisci la linea senza appesantire la pagina',
        summaryText:
          'Compila prima il profilo principale. Poi apri il pedigree solo quando vuoi costruire la linea familiare in modo visivo e ordinato.',
        showTree: 'Mostra pedigree',
        hideTree: 'Nascondi pedigree',
        collapsedHint: 'Apri il pedigree quando sei pronto ad aggiungere genitori, linee e bisnonni in un albero visivo.',
        ready: 'Compilato',
        empty: 'Vuoto',
        treeEyebrow: 'Vista pedigree',
        treeTitle: 'Panoramica dell’albero familiare',
        treeDescription: 'Un albero visivo del pedigree per {dog}. Clicca una carta antenato per aprire immagine e dettagli.',
        snapshotTitle: 'Snapshot familiare',
        snapshotHint: 'Usa “Mostra pedigree” nel form per aprire l’albero visivo e compilare ogni ramo passo dopo passo.',
        editorEyebrow: 'Dettagli pedigree',
        editorTitle: 'Compila ogni ramo solo quando hai informazioni reali',
        editorText: 'Apri una carta solo quando vuoi aggiungere un genitore, una linea o la generazione successiva. L’albero sopra cresce solo per i rami che conosci davvero.',
        progressive: {
          helpCta: 'Aiuto / come funziona',
          add: 'Aggiungi',
          edit: 'Modifica',
          remove: 'Rimuovi',
          collapse: 'Nascondi campi',
          savedHint: 'Questo parente è già preparato. Apri i campi solo quando vuoi rifinire i dettagli.',
          emptyHint: 'I campi restano nascosti finché non scegli di aggiungere questo legame.',
          openHint: 'Aggiungi una foto di riferimento, poi solo i dettagli che conosci davvero per questo antenato.',
          uploadImage: 'Carica immagine',
          replaceImage: 'Sostituisci immagine',
          removeImage: 'Rimuovi immagine',
          imageLabel: 'Immagine dell’antenato',
          imageHint: 'Scegli un’immagine dal tuo dispositivo. Apparirà subito nel form e nell’albero genealogico.',
          stepOne: 'Compila prima il profilo principale del Cane Corso.',
          stepTwo: 'Poi aggiungi solo i genitori e i rami che conosci davvero.',
          stepThree: 'L’albero sopra si espande solo per i rami compilati.',
          parentsTitle: 'Aggiungi i genitori solo se li conosci',
          parentsText: 'Non serve compilare tutto subito. Apri solo madre e padre quando hai informazioni reali.',
          addParents: 'Aggiungi i genitori (se noti)',
          paternalTitle: 'Aggiungi i genitori del padre solo se li conosci',
          paternalReady: 'Il padre è già inserito. Ora puoi aprire solo la sua linea e continuare con calma.',
          waitingForFather: 'Prima aggiungi il padre. Poi potrai aprire la linea paterna.',
          addPaternal: 'Aggiungi i genitori del padre',
          maternalTitle: 'Aggiungi i genitori della madre solo se li conosci',
          maternalReady: 'La madre è già inserita. Apri solo la linea materna e continua passo dopo passo.',
          waitingForMother: 'Prima aggiungi la madre. Poi potrai aprire la linea materna.',
          addMaternal: 'Aggiungi i genitori della madre',
          greatTitle: 'Espandi l’albero solo se conosci anche la generazione successiva',
          greatReady: 'Qui si mostreranno solo i rami che hanno già almeno un nonno o una nonna.',
          waitingForGrandparents: 'Prima aggiungi almeno un nonno o una nonna. Poi potrai mostrare la generazione successiva.',
          addGreat: 'Aggiungi la generazione successiva',
        },
        groups: {
          parents: 'Genitori',
          maternalLine: 'Linea materna',
          paternalLine: 'Linea paterna',
          greatGrandparents: 'Bisnonni',
        },
        groupDescriptions: {
          parents: 'Madre e padre del Cane Corso corrente.',
          maternalLine: 'Il lato della madre nell’albero familiare.',
          paternalLine: 'Il lato del padre nell’albero familiare.',
          greatGrandparents: 'La generazione sopra i nonni, mantenuta compatta e opzionale.',
        },
        stats: {
          filledAncestors: 'antenati compilati',
          ancestorPhotos: 'foto antenati',
          photoRule: 'foto cane principale / regola antenati',
        },
        fields: {
          name: 'Nome',
          photoUrl: 'URL foto di riferimento',
          sex: 'Sesso',
          birthDate: 'Data di nascita',
          color: 'Colore',
          country: 'Paese',
          titles: 'Titoli',
          note: 'Nota sulla linea',
        },
        placeholders: {
          name: 'Inserisci il nome del parente',
          photoUrl: 'https://...',
          selectSex: 'Seleziona sesso',
          color: 'Colore',
          country: 'Paese',
          titles: 'Titoli o nota kennel',
          note: 'Breve nota sulla linea',
        },
        modal: {
          unknownAncestor: 'Antenato senza nome',
        },
        relations: {
          mother: 'Madre',
          father: 'Padre',
          motherMother: 'Nonna materna',
          motherFather: 'Nonno materno',
          fatherMother: 'Nonna paterna',
          fatherFather: 'Nonno paterno',
          motherMotherMother: 'Madre della nonna materna',
          motherMotherFather: 'Padre della nonna materna',
          motherFatherMother: 'Madre del nonno materno',
          motherFatherFather: 'Padre del nonno materno',
          fatherMotherMother: 'Madre della nonna paterna',
          fatherMotherFather: 'Padre della nonna paterna',
          fatherFatherMother: 'Madre del nonno paterno',
          fatherFatherFather: 'Padre del nonno paterno',
        },
        subtitles: {
          mother: 'Profilo materno principale',
          father: 'Profilo paterno principale',
          motherMother: 'Lato madre • nonna',
          motherFather: 'Lato madre • nonno',
          fatherMother: 'Lato padre • nonna',
          fatherFather: 'Lato padre • nonno',
          motherMotherMother: 'Linea materna • ramo superiore',
          motherMotherFather: 'Linea materna • ramo superiore',
          motherFatherMother: 'Linea materna • ramo superiore',
          motherFatherFather: 'Linea materna • ramo superiore',
          fatherMotherMother: 'Linea paterna • ramo superiore',
          fatherMotherFather: 'Linea paterna • ramo superiore',
          fatherFatherMother: 'Linea paterna • ramo superiore',
          fatherFatherFather: 'Linea paterna • ramo superiore',
        },
      },
    },
  },
};

function deepMerge(base: any, extension: any): any {
  if (Array.isArray(base) || Array.isArray(extension)) {
    return extension ?? base;
  }

  if (typeof base !== 'object' || base === null) {
    return extension ?? base;
  }

  if (typeof extension !== 'object' || extension === null) {
    return base;
  }

  const merged: Record<string, any> = { ...base };

  for (const [key, value] of Object.entries(extension)) {
    merged[key] = key in base ? deepMerge(base[key], value) : value;
  }

  return merged;
}

export type Dictionary = Record<string, any>;

export function getDictionary(locale: Locale): Dictionary {
  return deepMerge(dictionary[locale] as Dictionary, dictionaryExtensions[locale] ?? {});
}
