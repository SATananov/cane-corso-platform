import type { Locale } from '@/lib/i18n';

export type KnowledgeCenterCard = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
};

export type KnowledgeTimelineItem = {
  period: string;
  title: string;
  description: string;
};

export type KnowledgeFact = {
  label: string;
  value: string;
  note?: string;
};

export type KnowledgeSource = {
  label: string;
  description: string;
  href: string;
};

export type KnowledgeCenterCopy = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    chips: readonly string[];
    note: string;
    cards: readonly KnowledgeCenterCard[];
  };
  overview: {
    eyebrow: string;
    title: string;
    description: string;
    cards: readonly KnowledgeCenterCard[];
  };
  timeline: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly KnowledgeTimelineItem[];
  };
  standard: {
    eyebrow: string;
    title: string;
    description: string;
    facts: readonly KnowledgeFact[];
    notes: readonly KnowledgeCenterCard[];
  };
  temperament: {
    eyebrow: string;
    title: string;
    description: string;
    principles: readonly KnowledgeCenterCard[];
  };
  health: {
    eyebrow: string;
    title: string;
    description: string;
    screenings: readonly KnowledgeFact[];
    disclaimer: string;
  };
  ownerGuide: {
    eyebrow: string;
    title: string;
    description: string;
    sections: readonly KnowledgeCenterCard[];
  };
  editorialModel: {
    eyebrow: string;
    title: string;
    description: string;
    fields: readonly string[];
  };
  sources: {
    eyebrow: string;
    title: string;
    description: string;
    items: readonly KnowledgeSource[];
  };
};

const officialSources: readonly KnowledgeSource[] = [
  {
    label: 'FCI Standard N°343 — Cane Corso Italiano',
    description: 'Official FCI breed standard reference for origin, classification, history summary, proportions, coat, size, temperament, faults, and breeding note.',
    href: 'https://www.fci.be/nomenclature/standards/343g02-en.pdf',
  },
  {
    label: 'FCI breed nomenclature — Cane Corso Italiano (343)',
    description: 'Official FCI breed page confirming Group 2, Molossian / Mastiff type, definitive recognition, origin Italy, and current standard publication data.',
    href: 'https://www.fci.be/en/nomenclature/ITALIAN-CANE-CORSO-343.html',
  },
  {
    label: 'American Kennel Club — Cane Corso breed information',
    description: 'AKC public breed overview for temperament language, ancient Roman lineage framing, and owner education orientation.',
    href: 'https://www.akc.org/dog-breeds/cane-corso/',
  },
  {
    label: 'Cane Corso Association of America — AKC CHF + CHIC health testing',
    description: 'Parent-club health testing reference for hips, elbows, cardiac, patella, NCL, and DSR / DSRA screening expectations.',
    href: 'https://www.canecorso.org/akc-canine-health-foundation--chic.html',
  },
  {
    label: 'Orthopedic Foundation for Animals — CHIC browse by breed',
    description: 'Database reference for breed-specific CHIC screening protocols and public health record orientation.',
    href: 'https://ofa.org/chic-programs/browse-by-breed/',
  },
];


const officialSourcesBg: readonly KnowledgeSource[] = [
  {
    label: 'FCI Standard N°343 — Cane Corso Italiano',
    description: 'Официален стандарт за произход, класификация, кратка история, пропорции, козина, размер, темперамент, недостатъци и развъдна бележка.',
    href: 'https://www.fci.be/nomenclature/standards/343g02-en.pdf',
  },
  {
    label: 'FCI breed nomenclature — Cane Corso Italiano (343)',
    description: 'Официална страница на FCI за група, тип молос / мастиф, окончателно признание, произход Италия и данни за текущия стандарт.',
    href: 'https://www.fci.be/en/nomenclature/ITALIAN-CANE-CORSO-343.html',
  },
  {
    label: 'American Kennel Club — Cane Corso breed information',
    description: 'Публичен породен профил с насоки за характер, древна римска линия и отговорно притежание.',
    href: 'https://www.akc.org/dog-breeds/cane-corso/',
  },
  {
    label: 'Cane Corso Association of America — AKC CHF + CHIC health testing',
    description: 'Референция от породния клуб за тазобедрени стави, лакти, сърце, колене, NCL и DSR / DSRA скрининг.',
    href: 'https://www.canecorso.org/akc-canine-health-foundation--chic.html',
  },
  {
    label: 'Orthopedic Foundation for Animals — CHIC browse by breed',
    description: 'База за породни CHIC скрининг протоколи и публична ориентация към здравни записи.',
    href: 'https://ofa.org/chic-programs/browse-by-breed/',
  },
];

export const knowledgeCenterContent: Record<Locale, KnowledgeCenterCopy> = {
  en: {
    hero: {
      eyebrow: 'Cane Corso Knowledge Center',
      title: 'A serious breed guide for owners, guests, and the USG ecosystem',
      description:
        'This layer turns Knowledge into a premium Cane Corso reference: history, official standard context, temperament, health awareness, care, training, responsible breeding, and safe ownership — all separated from registry, certificate, and gallery logic.',
      chips: ['History', 'FCI standard', 'Temperament', 'Health', 'Owner guide', 'Responsible breeding'],
      note: 'Educational information only. Health content supports awareness and should never replace a veterinarian, qualified trainer, or official kennel-club standard.',
      cards: [
        {
          eyebrow: 'Official anchor',
          title: 'Reference-based, not random internet text',
          description: 'The page now separates official standard facts, owner guidance, health awareness, and USG editorial interpretation.',
          meta: 'FCI • AKC • CCAA / CHIC',
        },
        {
          eyebrow: 'Breed first',
          title: 'Cane Corso before product features',
          description: 'Users first understand the breed, then understand why registry review, verification, and curated visibility matter.',
          meta: 'Breed identity • trust path',
        },
        {
          eyebrow: 'Editorial system',
          title: 'Ready to become a multilingual knowledge base',
          description: 'The structure uses published articles, source references, reviewed labels, categories, and multilingual editorial discipline.',
          meta: 'BG • EN • IT ready',
        },
      ],
    },
    overview: {
      eyebrow: 'Knowledge architecture',
      title: 'The breed information is organized as a long-term editorial foundation',
      description:
        'Instead of one overloaded page, the content is divided into practical reading zones that can later become separate articles or admin-managed knowledge records.',
      cards: [
        {
          eyebrow: 'History & identity',
          title: 'Where the breed comes from and why the name matters',
          description: 'The origin story covers Italy, the old Roman Molossian link, Southern Italy / Apulia, and the guardian meaning behind the name.',
          meta: 'Origins • name • modern identity',
        },
        {
          eyebrow: 'Official standard reading',
          title: 'How to read structure without turning the page into a judge manual',
          description: 'Classification, size, coat, proportion, movement, temperament, and faults are presented in an owner-readable way.',
          meta: 'FCI Standard N°343',
        },
        {
          eyebrow: 'Real ownership',
          title: 'Practical guidance for living with a powerful guardian breed',
          description: 'The guide frames socialization, training, boundaries, health awareness, travel, and family responsibility calmly and clearly.',
          meta: 'Care • training • safety',
        },
      ],
    },
    timeline: {
      eyebrow: 'Breed history',
      title: 'A concise timeline for the Cane Corso identity',
      description:
        'This timeline is intentionally short and credible. It gives the platform historical weight without pretending to replace full academic breed research.',
      items: [
        {
          period: 'Ancient roots',
          title: 'Old Roman Molossian ancestry',
          description: 'The FCI standard frames the direct ancestor as the old Roman Molossian, giving the breed a strong historical guardian lineage.',
        },
        {
          period: 'Rural Italy',
          title: 'Guardian, farm, livestock, and utility work',
          description: 'The breed identity is tied to property, family, livestock, agility, responsiveness, cattle work, and big-game hunting history.',
        },
        {
          period: 'Southern Italy',
          title: 'Apulia and adjacent regions',
          description: 'In the more recent past, the standard notes that the breed remained prevalent mainly in Apulia and nearby areas of Southern Italy.',
        },
        {
          period: 'Modern recognition',
          title: 'Definitive FCI recognition and current standard layer',
          description: 'The FCI breed page records definitive recognition and the current official standard publication data that should anchor the platform.',
        },
        {
          period: 'USG layer',
          title: 'Knowledge connects history to responsibility',
          description: 'USG should use history not as decoration, but as a reason to promote serious ownership, careful breeding, and trustworthy public profiles.',
        },
      ],
    },
    standard: {
      eyebrow: 'Official standard reading',
      title: 'FCI reference facts that belong in the knowledge core',
      description:
        'This is not a replacement for the full standard. It is a practical orientation layer that helps owners understand the official framework before reading profiles, registry records, or certificates.',
      facts: [
        { label: 'Official breed name', value: 'Cane Corso Italiano / Italian Cane Corso' },
        { label: 'FCI standard', value: 'N°343 — English standard dated 13.10.2023; official valid standard date 25.09.2023' },
        { label: 'Origin', value: 'Italy' },
        { label: 'Classification', value: 'Group 2 — Pinscher and Schnauzer, Molossoid and Swiss Mountain and Cattledogs; Section 2.1 Molossian, Mastiff type' },
        { label: 'Utilization', value: 'Utility dog, polyvalent; with working trial according to the FCI text' },
        { label: 'General appearance', value: 'Medium to large, robust, sturdy, elegant, lean and powerful muscles' },
        { label: 'Important proportions', value: 'Rectangular outline; slightly longer than tall; head length reaches about 36% of the height at the withers' },
        { label: 'Behaviour / temperament', value: 'Guardian of property, family, and livestock; agile and responsive' },
        { label: 'Coat', value: 'Short, shiny, very dense, with a slight undercoat' },
        { label: 'FCI colors', value: 'Black, grey variations, fawn, stag red, dark wheat, black brindle, grey brindle; limited small white markings accepted by the standard' },
        { label: 'Height', value: 'Males 64–68 cm; females 60–64 cm; with 2 cm tolerance' },
        { label: 'Weight', value: 'Males 45–50 kg; females 40–45 kg; weight according to size' },
      ],
      notes: [
        {
          eyebrow: 'Use carefully',
          title: 'Standard facts must stay separate from USG opinion',
          description: 'The platform can explain the standard, but should not rewrite it. Official facts, USG interpretation, and owner advice must be visibly separate.',
          meta: 'Official vs editorial clarity',
        },
        {
          eyebrow: 'Public trust',
          title: 'Registry is not the same as a certificate',
          description: 'Knowledge should teach users why publication, review, verification, and USG certification are different trust layers.',
          meta: 'Registry • Verify • Certificate',
        },
        {
          eyebrow: 'Breed welfare',
          title: 'Health and welfare remain part of the standard reading',
          description: 'The FCI standard explicitly frames faults according to their effect on health, welfare, and ability to perform traditional work.',
          meta: 'Welfare • function • structure',
        },
      ],
    },
    temperament: {
      eyebrow: 'Temperament & behaviour',
      title: 'A powerful guardian breed needs calm, responsible language',
      description:
        'The knowledge layer should avoid both extremes: it should not advertise aggression, and it should not soften the responsibility required by a strong, assertive, intelligent breed.',
      principles: [
        {
          eyebrow: 'Protector, not decoration',
          title: 'Confidence must be paired with control',
          description: 'Cane Corso temperament should be explained through loyalty, awareness, steadiness, handler connection, and boundaries — not through intimidation.',
          meta: 'Protection • control • steadiness',
        },
        {
          eyebrow: 'Training reality',
          title: 'Early socialization is not optional',
          description: 'Owners need clear guidance around people, dogs, environments, leash manners, recall, household rules, and calm exposure from puppyhood onward.',
          meta: 'Socialization • obedience • exposure',
        },
        {
          eyebrow: 'Family context',
          title: 'Family loyalty needs supervision and structure',
          description: 'The breed can be deeply attached to its family, but responsible ownership means supervision, predictable routines, and respect for its size and strength.',
          meta: 'Family • children • supervision',
        },
        {
          eyebrow: 'Owner fit',
          title: 'Not every household is the right match',
          description: 'The platform should openly say that a Cane Corso is best suited to serious owners willing to train, manage, and lead consistently.',
          meta: 'Suitability • maturity • commitment',
        },
      ],
    },
    health: {
      eyebrow: 'Health awareness',
      title: 'Responsible health information should guide, not diagnose',
      description:
        'The health section should teach owners what responsible breeders commonly screen for and why documentation matters, while always pointing medical concerns to veterinarians.',
      screenings: [
        { label: 'Hip dysplasia', value: 'OFA or PennHIP evaluation', note: 'Commonly tracked in CHIC-style screening protocols.' },
        { label: 'Elbow dysplasia', value: 'OFA evaluation', note: 'Important for a large, athletic molossoid breed.' },
        { label: 'Cardiac', value: 'OFA evaluation', note: 'Supports informed breeding and owner awareness.' },
        { label: 'Patellar luxation', value: 'OFA evaluation', note: 'Part of the CCAA / CHIC screening list.' },
        { label: 'NCL', value: 'DNA-based Neuronal Ceroid Lipofuscinosis test from an approved lab', note: 'Genetic testing should be documented, not verbally assumed.' },
        { label: 'DSR / DSRA', value: 'DNA-based Dental Skeletal Retinal Anomaly screening from an approved lab', note: 'The platform should store source references and review dates for health claims.' },
      ],
      disclaimer:
        'USG health content is educational. It is not a diagnosis, treatment plan, breeding clearance, or veterinary instruction. Owners should use qualified veterinarians, official health databases, and documented test results.',
    },
    ownerGuide: {
      eyebrow: 'Owner guide',
      title: 'The practical topics that make the platform useful every day',
      description:
        'The Cane Corso platform helps users before and after registration through clear articles, onboarding cards, and contextual help links.',
      sections: [
        { eyebrow: 'Daily care', title: 'Feeding, weight, movement, rest, coat, heat, and cold', description: 'Keep the guidance practical, realistic, and age-aware. The goal is owner confidence, not medical overreach.', meta: 'Care • routine • condition' },
        { eyebrow: 'Training', title: 'Leash work, recall, calm exposure, home rules, and professional help', description: 'Training content should be firm but respectful, with clear emphasis on early work and controlled socialization.', meta: 'Training • boundaries • handler' },
        { eyebrow: 'Responsible breeding', title: 'Health tests, temperament, pedigree, partner choice, and puppy placement', description: 'Breeding guidance should protect the breed by prioritizing structure, health, temperament, and verified documentation over fashion.', meta: 'Health • temperament • records' },
        { eyebrow: 'Travel & transport', title: 'Local and international movement for a large guardian breed', description: 'Connect knowledge to ecosystem services: transport, boarding, hotels, walking locations, and country-to-country relocation.', meta: 'Transport • boarding • relocation' },
        { eyebrow: 'Adoption & rescue', title: 'Lost, found, rehoming, and careful placement', description: 'Community flows should guide users toward safety, documentation, admin review, and responsible new-home checks.', meta: 'Rescue • rehoming • safety' },
        { eyebrow: 'Public responsibility', title: 'Power, visibility, and trust require mature ownership', description: 'The platform should consistently discourage status-symbol ownership and promote calm, lawful, controlled public behaviour.', meta: 'Safety • law • maturity' },
      ],
    },
    editorialModel: {
      eyebrow: 'Editorial content model',
      title: 'The Knowledge layer is structured as a reviewed editorial system',
      description:
        'The public Knowledge layer uses reviewed content, clear categories, source references, and publishing status so visitors see complete information instead of placeholders.',
      fields: [
        'Title',
        'Slug',
        'Language: BG / EN / IT',
        'Category: History / Standard / Health / Training / Care / Breeding / Travel / Adoption',
        'Short excerpt',
        'Hero image',
        'Main content sections',
        'Key facts',
        'Warnings / important notes',
        'Source references',
        'Reviewed by admin',
        'Last reviewed date',
        'Public status: Draft / Pending / Published / Archived',
        'Featured flag',
        'Reading level: Basic / Advanced / Expert',
        'Related articles',
      ],
    },
    sources: {
      eyebrow: 'Source discipline',
      title: 'Reference sources used to anchor the first knowledge foundation',
      description:
        'These sources are shown so the platform can clearly separate official reference, owner education, health screening orientation, and USG editorial guidance.',
      items: officialSources,
    },
  },
  bg: {
    hero: {
      eyebrow: 'Cane Corso Knowledge Center',
      title: 'Cane Corso справочник за собственици и гости',
      description:
        'Премиум образователен слой за породата: история, официален стандарт, темперамент, здравна осведоменост, грижа, обучение, отговорно развъждане и безопасно притежание — ясно отделени от Регистъра, Сертификата и Галерията.',
      chips: ['История', 'FCI стандарт', 'Темперамент', 'Здраве', 'Грижа', 'Развъждане'],
      note: 'Само образователна информация. Здравните теми насочват към осведоменост и не заменят ветеринар, квалифициран треньор или официален киноложки стандарт.',
      cards: [
        {
          eyebrow: 'Официална основа',
          title: 'Базирано на проверими източници',
          description: 'Страницата разделя стандартни факти, практически насоки, здравна осведоменост и USG редакционна интерпретация.',
          meta: 'FCI • AKC • CCAA / CHIC',
        },
        {
          eyebrow: 'Първо породата',
          title: 'Cane Corso преди функциите',
          description: 'Потребителят първо разбира породата, а после защо прегледът, проверката и селектираната видимост имат значение.',
          meta: 'Породна идентичност • доверие',
        },
        {
          eyebrow: 'Редакционна система',
          title: 'Готово за многоезична база',
          description: 'Структурата е подготвена за статии, източници, дата на преглед, категории и бъдещо съдържание, управлявано от админ.',
          meta: 'BG • EN • IT',
        },
      ],
    },
    overview: {
      eyebrow: 'Структура на знанието',
      title: 'Породната информация е подредена като дългосрочна основа',
      description:
        'Вместо една претоварена страница, съдържанието е разделено на ясни зони за четене. По-късно всяка зона може да стане отделна статия или редакционен запис.',
      cards: [
        {
          eyebrow: 'История и идентичност',
          title: 'Откъде идва породата',
          description: 'Произходът обхваща Италия, връзката със стария римски молос, Южна Италия / Апулия и пазаческия смисъл зад името.',
          meta: 'Произход • име • идентичност',
        },
        {
          eyebrow: 'Официален стандарт',
          title: 'Структура, размер и тип',
          description: 'Класификация, размер, козина, пропорции, движение, темперамент и недостатъци са представени разбираемо за собственик.',
          meta: 'FCI Standard N°343',
        },
        {
          eyebrow: 'Реално притежание',
          title: 'Живот със силна пазаческа порода',
          description: 'Справочникът обяснява социализация, обучение, граници, здравна осведоменост, пътуване и семейна отговорност спокойно и ясно.',
          meta: 'Грижа • обучение • безопасност',
        },
      ],
    },
    timeline: {
      eyebrow: 'История на породата',
      title: 'Кратка линия на Cane Corso идентичността',
      description:
        'Историческата линия е умишлено кратка и достоверна. Тя дава тежест на платформата, без да се представя като пълно академично изследване.',
      items: [
        {
          period: 'Древни корени',
          title: 'Наследство от стария римски молос',
          description: 'FCI стандартът посочва стария Roman Molossian като директен предшественик и поставя породата в силна историческа пазаческа линия.',
        },
        {
          period: 'Селска Италия',
          title: 'Пазач, ферма и работа с добитък',
          description: 'Породната идентичност е свързана с пазене на дом, семейство и животни, както и с пъргавина, реактивност и традиционна работоспособност.',
        },
        {
          period: 'Южна Италия',
          title: 'Апулия и съседните региони',
          description: 'В по-близкото минало стандартът отбелязва, че породата е била разпространена най-вече в Апулия и близките части на Южна Италия.',
        },
        {
          period: 'Модерно признание',
          title: 'FCI признание и актуален стандарт',
          description: 'FCI страницата записва окончателното признание и данните за текущия стандарт, които трябва да служат като официална опора.',
        },
        {
          period: 'USG слой',
          title: 'Историята води към отговорност',
          description: 'USG използва историята не като украса, а като причина за сериозно притежание, внимателно развъждане и надеждни публични профили.',
        },
      ],
    },
    standard: {
      eyebrow: 'Официален стандарт',
      title: 'FCI факти в ядрото на Knowledge секцията',
      description:
        'Това не замества пълния стандарт. Това е практичен слой, който помага на собствениците да разберат официалната рамка преди профили, регистърни записи и сертификати.',
      facts: [
        { label: 'Официално име', value: 'Cane Corso Italiano / Italian Cane Corso' },
        { label: 'FCI стандарт', value: 'N°343 — английски стандарт от 13.10.2023; официална дата на валидния стандарт 25.09.2023' },
        { label: 'Произход', value: 'Италия' },
        { label: 'Класификация', value: 'Група 2 — пинчери, шнауцери, молосоиди и швейцарски пастирски кучета; секция 2.1 молоси, тип мастиф' },
        { label: 'Предназначение', value: 'Универсално работно куче; с работен изпит според FCI текста' },
        { label: 'Общ вид', value: 'Средно до едро куче; стабилно, елегантно, с чиста и силна мускулатура' },
        { label: 'Пропорции', value: 'Правоъгълен силует; леко по-дълго от високо; дължината на главата е около 36% от височината при холката' },
        { label: 'Темперамент', value: 'Пазач на дом, семейство и добитък; пъргаво и отзивчиво според стандартния текст' },
        { label: 'Козина', value: 'Къса, лъскава, много гъста, с лек подкосъм' },
        { label: 'FCI цветове', value: 'Черно, сиви варианти, светло и тъмно жълтокафяво, еленово червено, тъмно пшенично, черно тигрово и сиво тигрово; допустими са малки бели маркировки според стандарта' },
        { label: 'Височина', value: 'Мъжки 64–68 cm; женски 60–64 cm; с толеранс 2 cm' },
        { label: 'Тегло', value: 'Мъжки 45–50 kg; женски 40–45 kg; тегло според размера' },
      ],
      notes: [
        {
          eyebrow: 'Ясна граница',
          title: 'Стандартните факти са отделени от USG мнение',
          description: 'Платформата може да обяснява стандарта, но не трябва да го пренаписва. Официални факти, USG интерпретация и практически съвети трябва да са ясно отделени.',
          meta: 'Официално • редакционно',
        },
        {
          eyebrow: 'Публично доверие',
          title: 'Регистърът не е сертификат',
          description: 'Knowledge слоят обяснява защо публикация, преглед, проверка и USG сертификат са различни нива на доверие.',
          meta: 'Регистър • Проверка • Сертификат',
        },
        {
          eyebrow: 'Благосъстояние',
          title: 'Здравето е част от стандарта',
          description: 'FCI разглежда недостатъците според влиянието им върху здравето, благосъстоянието и способността за традиционна работа.',
          meta: 'Здраве • функция • структура',
        },
      ],
    },
    temperament: {
      eyebrow: 'Темперамент и поведение',
      title: 'Силната пазаческа порода изисква спокоен език',
      description:
        'Knowledge слоят избягва двете крайности: не рекламира агресия и не омаловажава отговорността, която идва със силна, уверена и интелигентна порода.',
      principles: [
        {
          eyebrow: 'Пазач, не декорация',
          title: 'Увереността върви с контрол',
          description: 'Темпераментът трябва да се обяснява чрез лоялност, будност, стабилност, връзка с водача и ясни граници — не чрез сплашване.',
          meta: 'Защита • контрол • стабилност',
        },
        {
          eyebrow: 'Ранна работа',
          title: 'Социализацията не е по желание',
          description: 'Собствениците имат нужда от ясни насоки за хора, кучета, среда, повод, връщане при повикване, домашни правила и спокойна експозиция от ранна възраст.',
          meta: 'Социализация • послушание • среда',
        },
        {
          eyebrow: 'Семеен контекст',
          title: 'Лоялността изисква структура',
          description: 'Породата може да бъде силно привързана към семейството, но отговорното притежание означава надзор, предвидими правила и уважение към размера и силата.',
          meta: 'Семейство • деца • надзор',
        },
        {
          eyebrow: 'Подходящ стопанин',
          title: 'Не всеки дом е правилен избор',
          description: 'Платформата трябва ясно да казва, че Cane Corso е най-подходящо за сериозни хора, готови да обучават, управляват и водят последователно.',
          meta: 'Зрялост • ангажимент • последователност',
        },
      ],
    },
    health: {
      eyebrow: 'Здравна осведоменост',
      title: 'Здравната информация насочва, не диагностицира',
      description:
        'Секцията учи собствениците какво обичайно проверяват отговорните развъдчици и защо документацията има значение, като медицинските въпроси винаги остават за ветеринар.',
      screenings: [
        { label: 'Тазобедрена дисплазия', value: 'OFA или PennHIP оценка', note: 'Често следено в CHIC тип скрининг протоколи.' },
        { label: 'Лакътна дисплазия', value: 'OFA оценка', note: 'Важно за едра, атлетична молосоидна порода.' },
        { label: 'Сърце', value: 'OFA оценка', note: 'Помага за информирано развъждане и осведоменост на собственика.' },
        { label: 'Капачка на коляното', value: 'OFA оценка', note: 'Част от CCAA / CHIC скрининг списъка.' },
        { label: 'NCL', value: 'ДНК тест за Neuronal Ceroid Lipofuscinosis от одобрена лаборатория', note: 'Генетичните тестове трябва да са документирани, не само казани устно.' },
        { label: 'DSR / DSRA', value: 'ДНК скрининг за Dental Skeletal Retinal Anomaly от одобрена лаборатория', note: 'Платформата пази източници и дати на преглед за здравни твърдения.' },
      ],
      disclaimer:
        'USG здравното съдържание е образователно. То не е диагноза, лечение, разрешение за развъждане или ветеринарна инструкция. Собствениците трябва да използват квалифицирани ветеринари, официални здравни бази и документирани тестове.',
    },
    ownerGuide: {
      eyebrow: 'Практически справочник',
      title: 'Темите, които правят платформата полезна всеки ден',
      description:
        'Cane Corso платформата помага преди и след регистрация чрез ясни статии, въвеждащи карти и контекстна помощ.',
      sections: [
        { eyebrow: 'Ежедневна грижа', title: 'Хранене, тегло, движение, почивка, козина, жега и студ', description: 'Насоките са практични, реалистични и съобразени с възрастта. Целта е увереност на собственика, не медицински контрол.', meta: 'Грижа • рутина • кондиция' },
        { eyebrow: 'Обучение', title: 'Повод, връщане при повикване, спокойна експозиция и домашни правила', description: 'Съдържанието за обучение трябва да е ясно и уважително, с акцент върху ранна работа, граници и контролирана социализация.', meta: 'Обучение • граници • водач' },
        { eyebrow: 'Отговорно развъждане', title: 'Здравни тестове, темперамент, родословие и избор на партньор', description: 'Насоките за развъждане пазят породата чрез структура, здраве, темперамент и проверена документация вместо мода и случайни решения.', meta: 'Здраве • темперамент • документи' },
        { eyebrow: 'Пътуване и транспорт', title: 'Локално и международно движение за едра пазаческа порода', description: 'Свързваме знанията с услугите в екосистемата: транспорт, хотелско настаняване, места за разходка и преместване между държави.', meta: 'Транспорт • настаняване • преместване' },
        { eyebrow: 'Осиновяване и помощ', title: 'Изгубени, намерени и внимателно настаняване', description: 'Общностните процеси трябва да водят към безопасност, документация, админ преглед и отговорна проверка на нов дом.', meta: 'Помощ • настаняване • безопасност' },
        { eyebrow: 'Публична отговорност', title: 'Силата и доверието изискват зрял собственик', description: 'Платформата последователно отказва притежание за статус и насърчава спокойно, законно и контролирано поведение на публични места.', meta: 'Безопасност • закон • зрялост' },
      ],
    },
    editorialModel: {
      eyebrow: 'Редакционен модел на съдържание',
      title: 'Слоят Знания е подреден като прегледана редакционна система',
      description:
        'Публичният слой Знания използва прегледано съдържание, ясни категории, източници и статус на публикация, така че посетителят вижда завършена информация, а не празни полета. Страницата е готова за знание, управлявано от админ.',
      fields: [
        'Заглавие',
        'Slug / адрес',
        'Език: BG / EN / IT',
        'Категория: История / Стандарт / Здраве / Обучение / Грижа / Развъждане / Пътуване / Осиновяване',
        'Кратко описание',
        'Главно изображение',
        'Основни секции',
        'Ключови факти',
        'Предупреждения / важни бележки',
        'Източници',
        'Прегледано от админ',
        'Дата на последен преглед',
        'Публичен статус: Чернова / Чака / Публикуван / Архивиран',
        'Препоръчано съдържание',
        'Ниво на четене: Начинаещ / Напреднал / Експерт',
        'Свързани статии',
      ],
    },
    sources: {
      eyebrow: 'Дисциплина на източниците',
      title: 'Референтни източници за първата Knowledge основа',
      description:
        'Източниците показват кои части са официална референция, кои са образователни насоки за собственици, кои са здравна скрининг ориентация и кои са USG редакционни насоки.',
      items: officialSourcesBg,
    },
  },
  it: {
    hero: {
      eyebrow: 'Cane Corso Knowledge Center',
      title: 'Una guida seria della razza per proprietari, ospiti ed ecosistema USG',
      description:
        'Questo layer trasforma Knowledge in un riferimento premium per il Cane Corso: storia, contesto dello standard ufficiale, temperamento, consapevolezza salute, cura, training, allevamento responsabile e proprietà sicura — separati da Registry, Certificate e Gallery.',
      chips: ['Storia', 'Standard FCI', 'Temperamento', 'Salute', 'Owner guide', 'Allevamento responsabile'],
      note: 'Informazione educativa. I contenuti salute aiutano la consapevolezza e non sostituiscono veterinari, trainer qualificati o standard cinofili ufficiali.',
      cards: [
        { eyebrow: 'Ancora ufficiale', title: 'Basato su fonti, non su testo casuale online', description: 'La pagina separa fatti ufficiali di standard, owner guidance, consapevolezza salute e interpretazione editoriale USG.', meta: 'FCI • AKC • CCAA / CHIC' },
        { eyebrow: 'Prima la razza', title: 'Cane Corso prima delle funzioni prodotto', description: 'L’utente capisce prima la razza, poi perché review, verify e curated visibility contano.', meta: 'Identità di razza • trust path' },
        { eyebrow: 'Sistema editoriale', title: 'Pronto per diventare una base knowledge multilingue', description: 'La struttura è preparata per articoli, source references, reviewed dates, categorie e contenuto futuro gestito da admin.', meta: 'BG • EN • IT ready' },
      ],
    },
    overview: {
      eyebrow: 'Architettura Knowledge',
      title: 'Le informazioni sulla razza sono organizzate come fondazione editoriale a lungo termine',
      description: 'Invece di una pagina sovraccarica, il contenuto è diviso in zone pratiche che potranno diventare articoli separati o record knowledge gestiti da admin.',
      cards: [
        { eyebrow: 'Storia e identità', title: 'Da dove viene la razza e perché il nome conta', description: 'L’origine copre Italia, collegamento con il vecchio Molosso romano, Sud Italia / Puglia e il significato guardian del nome.', meta: 'Origini • nome • identità moderna' },
        { eyebrow: 'Lettura standard ufficiale', title: 'Leggere la struttura senza trasformare la pagina in un manuale da giudice', description: 'Classificazione, taglia, mantello, proporzioni, movimento, temperamento e difetti sono spiegati in modo leggibile per il proprietario.', meta: 'FCI Standard N°343' },
        { eyebrow: 'Ownership reale', title: 'Guida pratica per vivere con una razza guardian potente', description: 'Il guide layer spiega socializzazione, training, confini, salute, viaggio e responsabilità familiare in modo chiaro e calmo.', meta: 'Cura • training • sicurezza' },
      ],
    },
    timeline: {
      eyebrow: 'Storia della razza',
      title: 'Timeline breve per l’identità del Cane Corso',
      description: 'Questa timeline è volutamente breve e credibile. Dà peso storico alla piattaforma senza sostituire ricerca accademica completa.',
      items: [
        { period: 'Radici antiche', title: 'Eredità del vecchio Molosso romano', description: 'Lo standard FCI indica il vecchio Molosso romano come antenato diretto, dando alla razza una forte linea storica guardian.' },
        { period: 'Italia rurale', title: 'Guardiano, fattoria, bestiame e lavoro utility', description: 'L’identità della razza è legata a property, family, livestock, agility, responsiveness, cattle work e hunting big game.' },
        { period: 'Sud Italia', title: 'Puglia e regioni adiacenti', description: 'Nel passato recente lo standard nota che la razza era prevalente soprattutto in Puglia e nelle aree vicine del Sud Italia.' },
        { period: 'Riconoscimento moderno', title: 'Riconoscimento definitivo FCI e standard attuale', description: 'La pagina FCI registra il riconoscimento definitivo e la data dello standard ufficiale che deve ancorare la piattaforma.' },
        { period: 'Layer USG', title: 'Knowledge collega storia e responsabilità', description: 'USG dovrebbe usare la storia non come decorazione, ma come ragione per ownership seria, allevamento attento e profili pubblici trusted.' },
      ],
    },
    standard: {
      eyebrow: 'Lettura dello standard ufficiale',
      title: 'Fatti FCI che appartengono al nucleo knowledge',
      description: 'Non sostituisce lo standard completo. È un layer pratico che aiuta i proprietari a capire il quadro ufficiale prima di leggere profili, registry o certificati.',
      facts: [
        { label: 'Nome ufficiale', value: 'Cane Corso Italiano / Italian Cane Corso' },
        { label: 'Standard FCI', value: 'N°343 — standard inglese datato 13.10.2023; official valid standard date 25.09.2023' },
        { label: 'Origine', value: 'Italia' },
        { label: 'Classificazione', value: 'Group 2 — Pinscher and Schnauzer, Molossoid and Swiss Mountain and Cattledogs; Section 2.1 Molossian, Mastiff type' },
        { label: 'Utilizzo', value: 'Utility dog, polyvalent; with working trial secondo il testo FCI' },
        { label: 'Aspetto generale', value: 'Medio-grande, robusto, sturdy, con eleganza, muscoli lean and powerful' },
        { label: 'Proporzioni', value: 'Profilo rettangolare; leggermente più lungo che alto; lunghezza della testa circa 36% dell’altezza al garrese' },
        { label: 'Comportamento / temperamento', value: 'Guardian of property, family and livestock; agile and responsive' },
        { label: 'Mantello', value: 'Corto, lucido, molto denso, con leggero sottopelo' },
        { label: 'Colori FCI', value: 'Nero, varianti grigie, fawn, stag red, dark wheat, black brindle, grey brindle; piccole marcature bianche limitate secondo lo standard' },
        { label: 'Altezza', value: 'Maschi 64–68 cm; femmine 60–64 cm; tolleranza 2 cm' },
        { label: 'Peso', value: 'Maschi 45–50 kg; femmine 40–45 kg; peso secondo la taglia' },
      ],
      notes: [
        { eyebrow: 'Uso attento', title: 'I fatti standard devono restare separati dall’opinione USG', description: 'La piattaforma può spiegare lo standard, ma non deve riscriverlo. Fatti ufficiali, interpretazione USG e consigli owner devono essere visibilmente separati.', meta: 'Official vs editorial clarity' },
        { eyebrow: 'Public trust', title: 'Registry non è lo stesso di certificate', description: 'Knowledge dovrebbe insegnare perché pubblicazione, review, verification e USG certification sono trust layers differenti.', meta: 'Registry • Verify • Certificate' },
        { eyebrow: 'Breed welfare', title: 'Salute e welfare fanno parte della lettura dello standard', description: 'Lo standard FCI valuta i fault secondo l’effetto su salute, welfare e capacità di svolgere il lavoro tradizionale.', meta: 'Welfare • function • structure' },
      ],
    },
    temperament: {
      eyebrow: 'Temperamento e comportamento',
      title: 'Una razza guardian potente richiede linguaggio calmo e responsabile',
      description: 'Il layer Knowledge deve evitare gli estremi: non pubblicizzare aggressività e non minimizzare la responsabilità richiesta da una razza forte, assertive e intelligente.',
      principles: [
        { eyebrow: 'Protector, non decorazione', title: 'La fiducia deve essere accompagnata dal controllo', description: 'Il temperamento va spiegato con lealtà, awareness, steadiness, legame con handler e confini — non intimidazione.', meta: 'Protection • control • steadiness' },
        { eyebrow: 'Training reality', title: 'La socializzazione precoce non è opzionale', description: 'I proprietari hanno bisogno di guida su persone, cani, ambienti, guinzaglio, recall, regole domestiche ed esposizione calma fin da cucciolo.', meta: 'Socialization • obedience • exposure' },
        { eyebrow: 'Family context', title: 'La lealtà familiare richiede supervisione e struttura', description: 'La razza può essere molto legata alla famiglia, ma ownership responsabile significa supervision, routine prevedibili e rispetto per taglia e forza.', meta: 'Family • children • supervision' },
        { eyebrow: 'Owner fit', title: 'Non ogni casa è il match giusto', description: 'La piattaforma dovrebbe dire apertamente che il Cane Corso è più adatto a proprietari seri, pronti a training, gestione e guida coerente.', meta: 'Suitability • maturity • commitment' },
      ],
    },
    health: {
      eyebrow: 'Consapevolezza salute',
      title: 'Informazioni salute responsabili guidano, non diagnosticano',
      description: 'La sezione salute dovrebbe spiegare quali screening sono comuni nei breeder responsabili e perché la documentazione conta, rimandando sempre i problemi medici al veterinario.',
      screenings: [
        { label: 'Hip dysplasia', value: 'OFA o PennHIP evaluation', note: 'Spesso tracciato nei protocolli CHIC-style.' },
        { label: 'Elbow dysplasia', value: 'OFA evaluation', note: 'Importante per una razza molossoide grande e atletica.' },
        { label: 'Cardiac', value: 'OFA evaluation', note: 'Supporta allevamento informato e owner awareness.' },
        { label: 'Patellar luxation', value: 'OFA evaluation', note: 'Parte della lista CCAA / CHIC screening.' },
        { label: 'NCL', value: 'DNA-based Neuronal Ceroid Lipofuscinosis test da approved lab', note: 'I test genetici vanno documentati, non solo dichiarati verbalmente.' },
        { label: 'DSR / DSRA', value: 'DNA-based Dental Skeletal Retinal Anomaly screening da approved lab', note: 'La piattaforma dovrebbe salvare source references e review dates per health claims.' },
      ],
      disclaimer: 'Il contenuto salute USG è educativo. Non è diagnosi, trattamento, breeding clearance o istruzione veterinaria. I proprietari devono usare veterinari qualificati, database salute ufficiali e test documentati.',
    },
    ownerGuide: {
      eyebrow: 'Owner guide',
      title: 'I temi pratici che rendono la piattaforma utile ogni giorno',
      description: 'Una piattaforma Cane Corso completa deve aiutare prima e dopo la registrazione. Questi temi possono diventare article categories, onboarding cards e contextual help links.',
      sections: [
        { eyebrow: 'Cura quotidiana', title: 'Alimentazione, peso, movimento, riposo, mantello, caldo e freddo', description: 'La guida deve essere pratica, realistica e legata all’età. L’obiettivo è fiducia del proprietario, non medical overreach.', meta: 'Care • routine • condition' },
        { eyebrow: 'Training', title: 'Guinzaglio, recall, esposizione calma, regole domestiche e aiuto professionale', description: 'Il contenuto training deve essere chiaro e rispettoso, con enfasi su lavoro precoce e socializzazione controllata.', meta: 'Training • boundaries • handler' },
        { eyebrow: 'Allevamento responsabile', title: 'Test salute, temperamento, pedigree, scelta partner e puppy placement', description: 'Breeding guidance dovrebbe proteggere la razza con struttura, salute, temperament e verified documentation invece di fashion.', meta: 'Health • temperament • records' },
        { eyebrow: 'Viaggio e trasporto', title: 'Movimento locale e internazionale per una grande razza guardian', description: 'Collega knowledge ai servizi ecosystem: trasporto, boarding, hotel, walking locations e country-to-country relocation.', meta: 'Transport • boarding • relocation' },
        { eyebrow: 'Adoption & rescue', title: 'Lost, found, rehoming e collocazione attenta', description: 'I community flows dovrebbero guidare verso sicurezza, documentazione, admin review e responsible new-home checks.', meta: 'Rescue • rehoming • safety' },
        { eyebrow: 'Public responsibility', title: 'Forza, visibilità e fiducia richiedono ownership matura', description: 'La piattaforma dovrebbe scoraggiare sempre status-symbol ownership e promuovere comportamento pubblico calm, lawful, controlled.', meta: 'Safety • law • maturity' },
      ],
    },
    editorialModel: {
      eyebrow: 'Editorial content model',
      title: 'La pagina statica è pronta per diventare un sistema knowledge gestito da admin',
      description: 'Il layer pubblico Knowledge usa contenuti revisionati, categorie chiare, fonti e stato di pubblicazione, così il visitatore vede informazioni complete e non placeholder.',
      fields: [
        'Title',
        'Slug',
        'Language: BG / EN / IT',
        'Category: History / Standard / Health / Training / Care / Breeding / Travel / Adoption',
        'Short excerpt',
        'Hero image',
        'Main content sections',
        'Key facts',
        'Warnings / important notes',
        'Source references',
        'Reviewed by admin',
        'Last reviewed date',
        'Public status: Draft / Pending / Published / Archived',
        'Featured flag',
        'Reading level: Basic / Advanced / Expert',
        'Related articles',
      ],
    },
    sources: {
      eyebrow: 'Source discipline',
      title: 'Fonti di riferimento usate per la prima foundation Knowledge',
      description: 'Le fonti sono mostrate per separare chiaramente official reference, owner education, health screening orientation e USG editorial guidance.',
      items: officialSources,
    },
  },
};

export function getKnowledgeCenterContent(locale: Locale): KnowledgeCenterCopy {
  return knowledgeCenterContent[locale] ?? knowledgeCenterContent.en;
}
