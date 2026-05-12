import type { Locale } from '@/lib/i18n';

export type AskMarkIVariant = 'public' | 'member' | 'myDogs' | 'knowledge' | 'review';

export type AskMarkIQuestion = {
  id: string;
  question: string;
  answer: string;
  href: string;
  actionLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type AskMarkICopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  promptLabel: string;
  answerLabel: string;
  safetyNote: string;
  authorityNote: string;
  visualLabel: string;
  questions: AskMarkIQuestion[];
};

const copyByLocale: Record<Locale, Record<AskMarkIVariant, AskMarkICopy>> = {
  en: {
    public: {
      eyebrow: 'Ask MARK I',
      title: 'Your USG Cane Corso guide',
      subtitle: 'Orientation before you choose a path',
      intro:
        'MARK I helps guests understand USG, Registry, Verify, Knowledge, Community, and the first safe step into a private profile.',
      promptLabel: 'Choose what you want to understand first',
      answerLabel: 'MARK I guidance',
      safetyNote:
        'MARK I gives orientation and platform guidance. Official Registry and Certificate decisions remain human USG review decisions.',
      authorityNote: 'Official trust stays separate from community content.',
      visualLabel: 'Heritage guide',
      questions: [
        {
          id: 'start',
          question: 'Where should I start?',
          answer:
            'Start with Verify if you already have a code, Registry if you want to see published profiles, or Knowledge if you want to understand Cane Corso care and USG standards before creating an account.',
          href: '/platform',
          actionLabel: 'Open platform path',
          secondaryHref: '/guide?topic=overview#overview',
          secondaryLabel: 'Read the guide',
        },
        {
          id: 'usg',
          question: 'What is USG?',
          answer:
            'USG is a curated Cane Corso platform: official trust surfaces for Registry and verification, plus knowledge, owner tools, partners, and moderated community usefulness.',
          href: '/manifesto',
          actionLabel: 'Read USG manifesto',
          secondaryHref: '/heritage',
          secondaryLabel: 'Heritage story',
        },
        {
          id: 'verify',
          question: 'How do I check a profile or certificate?',
          answer:
            'Use Verify when you have a code or public reference. Verification shows official status only when the profile or certificate exists in the USG trust layer.',
          href: '/verify',
          actionLabel: 'Open Verify',
          secondaryHref: '/registry',
          secondaryLabel: 'Browse Registry',
        },
        {
          id: 'join',
          question: 'What unlocks after registration?',
          answer:
            'A member can create a private Cane Corso profile, add photos, keep owner details ready, follow health and growth, and submit the profile for human review when it is prepared.',
          href: '/access?intent=member',
          actionLabel: 'Create member profile',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Learn first',
        },
      ],
    },
    member: {
      eyebrow: 'Ask MARK I',
      title: 'Owner guidance after login',
      subtitle: 'One clear next action at a time',
      intro:
        'MARK I helps members move from private profile to photos, readiness, health context, and community tools without confusing private work with public approval.',
      promptLabel: 'What do you want to do next?',
      answerLabel: 'Owner guidance',
      safetyNote:
        'Health and growth notes are for owner orientation. They do not replace veterinary advice when symptoms, pain, emergency signs, or treatment decisions are involved.',
      authorityNote: 'Saving a profile does not publish it. Review and publication stay separate.',
      visualLabel: 'Owner guide',
      questions: [
        {
          id: 'add-dog',
          question: 'How do I add my Cane Corso?',
          answer:
            'Create one private profile first. Add the essential identity fields, then continue with photos, origin notes, and review readiness only when the profile has enough context.',
          href: '/my-dogs/new',
          actionLabel: 'Add Cane Corso',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'My Cane Corso',
        },
        {
          id: 'photos',
          question: 'What photos should I prepare?',
          answer:
            'Prepare clear natural photos: front, side, head, and standing body view. Photos support review, but photos alone do not prove pedigree or official status.',
          href: '/guide?topic=member-workspace#member-workspace',
          actionLabel: 'Open photo guide',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Open workspace',
        },
        {
          id: 'review-ready',
          question: 'When is the profile ready for review?',
          answer:
            'A profile is ready when basic identity, photos, owner context, and any known origin details are filled honestly. USG review can still request changes before publication.',
          href: '/my-dogs',
          actionLabel: 'Check profiles',
          secondaryHref: '/faq',
          secondaryLabel: 'Review FAQ',
        },
        {
          id: 'health',
          question: 'What should I track as an owner?',
          answer:
            'Track weight, growth notes, vaccines, deworming dates, vet visits, and practical observations. Use the record as owner history, not as a medical decision system.',
          href: '/knowledge',
          actionLabel: 'Open owner knowledge',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Open health tools',
        },
      ],
    },
    myDogs: {
      eyebrow: 'Ask MARK I',
      title: 'Build the profile without getting lost',
      subtitle: 'Identity, photos, origin, review, public profile',
      intro:
        'MARK I keeps My Cane Corso practical: start with the profile, improve the evidence, and submit only when the information is ready for human review.',
      promptLabel: 'Choose the profile question',
      answerLabel: 'Profile guidance',
      safetyNote:
        'MARK I helps with preparation. It does not approve Registry, issue certificates, or replace professional veterinary care.',
      authorityNote: 'The public profile appears only after administrator publication.',
      visualLabel: 'Profile guide',
      questions: [
        {
          id: 'basic-info',
          question: 'What basic information matters most?',
          answer:
            'Start with name, birth date, sex, color, location, short description, and owner identity. This creates the private foundation before photos and origin details.',
          href: '/my-dogs/new',
          actionLabel: 'Start profile',
          secondaryHref: '/profile',
          secondaryLabel: 'Owner profile',
        },
        {
          id: 'origin',
          question: 'What if I do not know the full origin?',
          answer:
            'Fill what you know and explain missing details honestly. Known parents, pedigree numbers, grandparents, and photos help, but missing information should never be invented.',
          href: '/my-dogs/new',
          actionLabel: 'Add details',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Learn about profiles',
        },
        {
          id: 'publication',
          question: 'What happens after review?',
          answer:
            'The profile can be approved, returned for changes, published in Registry, or considered separately for USG certificate readiness. These are not automatic steps.',
          href: '/faq',
          actionLabel: 'Read review FAQ',
          secondaryHref: '/registry',
          secondaryLabel: 'View Registry',
        },
        {
          id: 'certificate',
          question: 'Is a certificate the same as Registry?',
          answer:
            'No. Registry publication and USG Certificate are connected trust surfaces, but certificate issuance is a separate official decision after review.',
          href: '/verify',
          actionLabel: 'Open Verify',
          secondaryHref: '/certified',
          secondaryLabel: 'Certified archive',
        },
      ],
    },
    knowledge: {
      eyebrow: 'Ask MARK I',
      title: 'Learn Cane Corso with clear boundaries',
      subtitle: 'History, standard, care, growth, and owner responsibility',
      intro:
        'MARK I points you to educational content and keeps USG observations, official standards, owner care, and veterinary boundaries clearly separated.',
      promptLabel: 'What do you want to learn?',
      answerLabel: 'Knowledge guidance',
      safetyNote:
        'Educational content supports better care, but symptoms, treatment, emergencies, pregnancy complications, and pain require a veterinarian.',
      authorityNote: 'USG learning content is not a shortcut to official approval.',
      visualLabel: 'Knowledge guide',
      questions: [
        {
          id: 'history',
          question: 'Where can I learn the breed history?',
          answer:
            'Start with the history and identity article. It separates origin, cultural context, and USG interpretation so the reader does not confuse story with official proof.',
          href: '/knowledge/cane-corso-history-and-identity',
          actionLabel: 'Open history',
          secondaryHref: '/heritage',
          secondaryLabel: 'USG heritage',
        },
        {
          id: 'standard',
          question: 'How should I read the standard?',
          answer:
            'Use the standard article as owner orientation: proportions, structure, head, movement, and presentation. Final review stays human and contextual.',
          href: '/knowledge/official-standard-owner-reading',
          actionLabel: 'Open standard guide',
          secondaryHref: '/guide?topic=photo-readiness#photo-readiness',
          secondaryLabel: 'Photo readiness',
        },
        {
          id: 'growth',
          question: 'What should I know about growth?',
          answer:
            'Growth should be followed calmly through weight, age, body condition, food, movement, and vet notes. The goal is owner awareness, not a single perfect number.',
          href: '/knowledge/health-screening-and-responsible-care',
          actionLabel: 'Open health article',
          secondaryHref: '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar',
          secondaryLabel: 'Puppy calendar',
        },
        {
          id: 'safety',
          question: 'What matters for training and safety?',
          answer:
            'Cane Corso needs calm leadership, socialization, control, and responsible public behavior. Training and safety content should be read before community activity.',
          href: '/knowledge/training-socialization-and-public-safety',
          actionLabel: 'Open safety article',
          secondaryHref: '/community',
          secondaryLabel: 'Community layer',
        },
      ],
    },
    review: {
      eyebrow: 'MARK I Review Guidance',
      title: 'Human review stays in control',
      subtitle: 'Profile, photos, readiness, decision, publication',
      intro:
        'MARK I supports the admin review rhythm with reminders, but it never replaces the human decision for Registry, Certificate, publication, or return for changes.',
      promptLabel: 'Choose the review reminder',
      answerLabel: 'Admin guidance',
      safetyNote:
        'Assistant guidance is not an automatic decision. Any risk, uncertainty, certificate action, or publication action remains administrator responsibility.',
      authorityNote: 'Registry and Certificate authority stay USG-controlled.',
      visualLabel: 'Review guide',
      questions: [
        {
          id: 'profile-check',
          question: 'What should I check first?',
          answer:
            'Start with owner identity, dog identity, status, notes, and completeness. A clear profile reduces unnecessary back-and-forth before photo and certificate review.',
          href: '#review-queue',
          actionLabel: 'Go to queue',
          secondaryHref: '#admin-certificate-flow',
          secondaryLabel: 'Review flow',
        },
        {
          id: 'photo-check',
          question: 'How should photos be reviewed?',
          answer:
            'Review photos as evidence quality and presentation support. Do not treat a photo as pedigree proof or automatic breed confirmation.',
          href: '#admin-photo-assistant',
          actionLabel: 'Photo guidance',
          secondaryHref: '#review-queue',
          secondaryLabel: 'Queue',
        },
        {
          id: 'decision',
          question: 'When should I request changes?',
          answer:
            'Request changes when the profile lacks clear identity, usable photos, honest origin context, or enough information for a responsible public decision.',
          href: '#review-queue',
          actionLabel: 'Review entries',
          secondaryHref: '#admin-certificate-flow',
          secondaryLabel: 'Decision flow',
        },
        {
          id: 'certificate',
          question: 'What is the certificate boundary?',
          answer:
            'Certificate issuance is separate from Registry publication. A profile may be public without a certificate, and a certificate action must remain a deliberate USG admin decision.',
          href: '#admin-certificate-flow',
          actionLabel: 'Certificate flow',
          secondaryHref: '/verify',
          secondaryLabel: 'Verify public side',
        },
      ],
    },
  },
  bg: {
    public: {
      eyebrow: 'Попитай MARK I',
      title: 'Твоят USG водач за Cane Corso',
      subtitle: 'Ориентация преди да избереш път',
      intro:
        'MARK I помага на госта да разбере USG, Регистър, Проверка, Знания, Общност и първата безопасна стъпка към личен профил.',
      promptLabel: 'Избери какво искаш да разбереш първо',
      answerLabel: 'Насока от MARK I',
      safetyNote:
        'MARK I дава ориентация и насоки за платформата. Официалните решения за Регистър и Сертификат остават човешки USG review решения.',
      authorityNote: 'Официалното доверие остава отделно от общностното съдържание.',
      visualLabel: 'Heritage водач',
      questions: [
        {
          id: 'start',
          question: 'Откъде да започна?',
          answer:
            'Започни с Проверка, ако имаш код; с Регистъра, ако искаш да видиш публикувани профили; или със Знания, ако първо искаш да разбереш грижата за Cane Corso и USG стандарта.',
          href: '/platform',
          actionLabel: 'Отвори пътя в платформата',
          secondaryHref: '/guide?topic=overview#overview',
          secondaryLabel: 'Прочети наръчника',
        },
        {
          id: 'usg',
          question: 'Какво е USG?',
          answer:
            'USG е подбрана Cane Corso платформа: официални trust секции за Регистър и проверка, плюс знания, owner инструменти, партньори и модерирана общностна полезност.',
          href: '/manifesto',
          actionLabel: 'Прочети USG manifesto',
          secondaryHref: '/heritage',
          secondaryLabel: 'Heritage история',
        },
        {
          id: 'verify',
          question: 'Как да проверя профил или сертификат?',
          answer:
            'Използвай Проверка, когато имаш код или публична референция. Тя показва официален статус само когато профилът или сертификатът съществува в USG trust слоя.',
          href: '/verify',
          actionLabel: 'Отвори Проверка',
          secondaryHref: '/registry',
          secondaryLabel: 'Разгледай Регистъра',
        },
        {
          id: 'join',
          question: 'Какво се отключва след регистрация?',
          answer:
            'Членът може да създаде личен Cane Corso профил, да добави снимки, да поддържа owner данни, да следи здраве и растеж и да изпрати профила за човешки преглед, когато е готов.',
          href: '/access?intent=member',
          actionLabel: 'Създай членски профил',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Научи първо',
        },
      ],
    },
    member: {
      eyebrow: 'Попитай MARK I',
      title: 'Owner насоки след вход',
      subtitle: 'Едно ясно следващо действие наведнъж',
      intro:
        'MARK I помага на членовете да минат от личен профил към снимки, готовност, здравен контекст и общностни инструменти, без личната работа да се смесва с публичното одобрение.',
      promptLabel: 'Какво искаш да направиш сега?',
      answerLabel: 'Owner насока',
      safetyNote:
        'Здравните и растежните бележки са за ориентация на собственика. Те не заменят ветеринар при симптоми, болка, спешни признаци или решения за лечение.',
      authorityNote: 'Запазването на профил не го публикува. Review и публикацията остават отделни.',
      visualLabel: 'Owner водач',
      questions: [
        {
          id: 'add-dog',
          question: 'Как да добавя своя Cane Corso?',
          answer:
            'Първо създай един личен профил. Попълни основните данни, после продължи със снимки, произход и готовност за review, когато профилът има достатъчно контекст.',
          href: '/my-dogs/new',
          actionLabel: 'Добави Cane Corso',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Моите Cane Corso',
        },
        {
          id: 'photos',
          question: 'Какви снимки да подготвя?',
          answer:
            'Подготви ясни естествени снимки: отпред, отстрани, глава и стоеж на тялото. Снимките помагат за review, но сами по себе си не доказват родословие или официален статус.',
          href: '/guide?topic=member-workspace#member-workspace',
          actionLabel: 'Отвори photo guide',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Отвори workspace',
        },
        {
          id: 'review-ready',
          question: 'Кога профилът е готов за review?',
          answer:
            'Профилът е готов, когато основна идентичност, снимки, owner контекст и известни данни за произход са попълнени честно. USG review пак може да поиска корекции преди публикация.',
          href: '/my-dogs',
          actionLabel: 'Провери профилите',
          secondaryHref: '/faq',
          secondaryLabel: 'Review FAQ',
        },
        {
          id: 'health',
          question: 'Какво да следя като собственик?',
          answer:
            'Следи тегло, растежни бележки, ваксини, обезпаразитяване, ветеринарни прегледи и практически наблюдения. Използвай архива като owner история, не като медицинска система за решения.',
          href: '/knowledge',
          actionLabel: 'Отвори owner знания',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Отвори health tools',
        },
      ],
    },
    myDogs: {
      eyebrow: 'Попитай MARK I',
      title: 'Изгради профила без да се луташ',
      subtitle: 'Идентичност, снимки, произход, review, публичен профил',
      intro:
        'MARK I държи „Моите Cane Corso“ практично: започни с профила, подобри доказателствения материал и изпрати само когато информацията е готова за човешки review.',
      promptLabel: 'Избери въпрос за профила',
      answerLabel: 'Насока за профила',
      safetyNote:
        'MARK I помага с подготовката. Той не одобрява Регистър, не издава сертификати и не заменя професионална ветеринарна грижа.',
      authorityNote: 'Публичният профил се появява само след публикация от администратор.',
      visualLabel: 'Профилен водач',
      questions: [
        {
          id: 'basic-info',
          question: 'Кои основни данни са най-важни?',
          answer:
            'Започни с име, дата на раждане, пол, цвят, локация, кратко описание и owner идентичност. Това създава личната основа преди снимки и произход.',
          href: '/my-dogs/new',
          actionLabel: 'Започни профил',
          secondaryHref: '/profile',
          secondaryLabel: 'Owner профил',
        },
        {
          id: 'origin',
          question: 'Ако не знам целия произход?',
          answer:
            'Попълни това, което знаеш, и обясни липсващото честно. Известни родители, родословни номера, прародители и снимки помагат, но липсващи данни не трябва да се измислят.',
          href: '/my-dogs/new',
          actionLabel: 'Добави данни',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Научи за профилите',
        },
        {
          id: 'publication',
          question: 'Какво става след review?',
          answer:
            'Профилът може да бъде одобрен, върнат за корекции, публикуван в Регистъра или разгледан отделно за USG certificate readiness. Това не са автоматични стъпки.',
          href: '/faq',
          actionLabel: 'Прочети review FAQ',
          secondaryHref: '/registry',
          secondaryLabel: 'Виж Регистъра',
        },
        {
          id: 'certificate',
          question: 'Сертификатът същото ли е като Регистър?',
          answer:
            'Не. Публикацията в Регистъра и USG Сертификатът са свързани trust секции, но издаването на сертификат е отделно официално решение след review.',
          href: '/verify',
          actionLabel: 'Отвори Проверка',
          secondaryHref: '/certified',
          secondaryLabel: 'Certified archive',
        },
      ],
    },
    knowledge: {
      eyebrow: 'Попитай MARK I',
      title: 'Учи за Cane Corso с ясни граници',
      subtitle: 'История, стандарт, грижа, растеж и отговорност',
      intro:
        'MARK I те насочва към образователното съдържание и държи ясно разделени USG наблюдения, официални стандарти, owner грижа и ветеринарни граници.',
      promptLabel: 'Какво искаш да научиш?',
      answerLabel: 'Knowledge насока',
      safetyNote:
        'Образователното съдържание помага за по-добра грижа, но симптоми, лечение, спешни случаи, усложнения при бременност и болка изискват ветеринар.',
      authorityNote: 'USG knowledge съдържанието не е пряк път към официално одобрение.',
      visualLabel: 'Knowledge водач',
      questions: [
        {
          id: 'history',
          question: 'Къде да науча историята на породата?',
          answer:
            'Започни със статията за история и идентичност. Тя разделя произход, културен контекст и USG интерпретация, за да не се смесва история с официално доказателство.',
          href: '/knowledge/cane-corso-history-and-identity',
          actionLabel: 'Отвори историята',
          secondaryHref: '/heritage',
          secondaryLabel: 'USG heritage',
        },
        {
          id: 'standard',
          question: 'Как да чета стандарта?',
          answer:
            'Използвай standard статията като owner ориентация: пропорции, структура, глава, движение и представяне. Финалният review остава човешки и контекстен.',
          href: '/knowledge/official-standard-owner-reading',
          actionLabel: 'Отвори standard guide',
          secondaryHref: '/guide?topic=photo-readiness#photo-readiness',
          secondaryLabel: 'Photo readiness',
        },
        {
          id: 'growth',
          question: 'Какво да знам за растежа?',
          answer:
            'Растежът се следи спокойно чрез тегло, възраст, телесна кондиция, храна, движение и ветеринарни бележки. Целта е owner осъзнатост, не едно перфектно число.',
          href: '/knowledge/health-screening-and-responsible-care',
          actionLabel: 'Отвори health статия',
          secondaryHref: '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar',
          secondaryLabel: 'Puppy calendar',
        },
        {
          id: 'safety',
          question: 'Какво е важно за обучение и безопасност?',
          answer:
            'Cane Corso има нужда от спокойна водеща роля, социализация, контрол и отговорно поведение навън. Training и safety съдържанието е важно преди общностна активност.',
          href: '/knowledge/training-socialization-and-public-safety',
          actionLabel: 'Отвори safety статия',
          secondaryHref: '/community',
          secondaryLabel: 'Community слой',
        },
      ],
    },
    review: {
      eyebrow: 'MARK I Review Guidance',
      title: 'Човешкият review остава водещ',
      subtitle: 'Профил, снимки, готовност, решение, публикация',
      intro:
        'MARK I подкрепя admin review ритъма с напомняния, но никога не заменя човешкото решение за Регистър, Сертификат, публикация или връщане за корекции.',
      promptLabel: 'Избери review напомняне',
      answerLabel: 'Admin насока',
      safetyNote:
        'Assistant guidance не е автоматично решение. Всеки риск, неяснота, certificate action или publication action остава отговорност на администратора.',
      authorityNote: 'Registry и Certificate authority остават под USG контрол.',
      visualLabel: 'Review водач',
      questions: [
        {
          id: 'profile-check',
          question: 'Какво да проверя първо?',
          answer:
            'Започни със owner идентичност, dog identity, статус, бележки и завършеност. Ясен профил намалява излишното връщане преди photo и certificate review.',
          href: '#review-queue',
          actionLabel: 'Към queue',
          secondaryHref: '#admin-certificate-flow',
          secondaryLabel: 'Review flow',
        },
        {
          id: 'photo-check',
          question: 'Как да преглеждам снимките?',
          answer:
            'Преглеждай снимките като качество на evidence и presentation support. Не третирай снимка като pedigree proof или automatic breed confirmation.',
          href: '#admin-photo-assistant',
          actionLabel: 'Photo guidance',
          secondaryHref: '#review-queue',
          secondaryLabel: 'Queue',
        },
        {
          id: 'decision',
          question: 'Кога да поискам корекции?',
          answer:
            'Поискай корекции, когато профилът няма ясна идентичност, използваеми снимки, честен origin context или достатъчно информация за отговорно публично решение.',
          href: '#review-queue',
          actionLabel: 'Review entries',
          secondaryHref: '#admin-certificate-flow',
          secondaryLabel: 'Decision flow',
        },
        {
          id: 'certificate',
          question: 'Каква е certificate границата?',
          answer:
            'Издаването на сертификат е отделно от Registry publication. Профил може да е публичен без сертификат, а certificate action трябва да остане съзнателно USG admin решение.',
          href: '#admin-certificate-flow',
          actionLabel: 'Certificate flow',
          secondaryHref: '/verify',
          secondaryLabel: 'Публична проверка',
        },
      ],
    },
  },
  it: {
    public: {
      eyebrow: 'Chiedi a MARK I',
      title: 'La tua guida USG per Cane Corso',
      subtitle: 'Orientamento prima di scegliere un percorso',
      intro:
        'MARK I aiuta gli ospiti a capire USG, Registro, Verifica, Conoscenza, Community e il primo passo sicuro verso un profilo privato.',
      promptLabel: 'Scegli cosa vuoi capire per primo',
      answerLabel: 'Guida MARK I',
      safetyNote:
        'MARK I offre orientamento e guida nella piattaforma. Le decisioni ufficiali di Registro e Certificato restano decisioni umane di revisione USG.',
      authorityNote: 'La fiducia ufficiale resta separata dai contenuti community.',
      visualLabel: 'Guida heritage',
      questions: [
        {
          id: 'start',
          question: 'Da dove inizio?',
          answer:
            'Inizia da Verifica se hai già un codice, dal Registro se vuoi vedere profili pubblicati, o da Conoscenza se vuoi capire cura Cane Corso e standard USG prima di creare un account.',
          href: '/platform',
          actionLabel: 'Apri percorso piattaforma',
          secondaryHref: '/guide?topic=overview#overview',
          secondaryLabel: 'Leggi la guida',
        },
        {
          id: 'usg',
          question: 'Che cos’è USG?',
          answer:
            'USG è una piattaforma Cane Corso curata: superfici ufficiali per Registro e verifica, più conoscenza, strumenti proprietario, partner e utilità community moderata.',
          href: '/manifesto',
          actionLabel: 'Leggi il manifesto',
          secondaryHref: '/heritage',
          secondaryLabel: 'Storia heritage',
        },
        {
          id: 'verify',
          question: 'Come controllo un profilo o certificato?',
          answer:
            'Usa Verifica quando hai un codice o riferimento pubblico. Mostra stato ufficiale solo quando profilo o certificato esistono nel livello trust USG.',
          href: '/verify',
          actionLabel: 'Apri Verifica',
          secondaryHref: '/registry',
          secondaryLabel: 'Sfoglia Registro',
        },
        {
          id: 'join',
          question: 'Cosa si sblocca dopo la registrazione?',
          answer:
            'Un membro può creare un profilo Cane Corso privato, aggiungere foto, tenere pronti i dati proprietario, seguire salute e crescita e inviare il profilo alla revisione umana quando è pronto.',
          href: '/access?intent=member',
          actionLabel: 'Crea profilo membro',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Impara prima',
        },
      ],
    },
    member: {
      eyebrow: 'Chiedi a MARK I',
      title: 'Guida proprietario dopo login',
      subtitle: 'Un’azione chiara alla volta',
      intro:
        'MARK I aiuta i membri a passare da profilo privato a foto, readiness, contesto salute e strumenti community senza confondere lavoro privato e approvazione pubblica.',
      promptLabel: 'Cosa vuoi fare adesso?',
      answerLabel: 'Guida proprietario',
      safetyNote:
        'Note salute e crescita sono orientamento per il proprietario. Non sostituiscono il veterinario in caso di sintomi, dolore, urgenze o decisioni di trattamento.',
      authorityNote: 'Salvare un profilo non lo pubblica. Revisione e pubblicazione restano separate.',
      visualLabel: 'Guida proprietario',
      questions: [
        {
          id: 'add-dog',
          question: 'Come aggiungo il mio Cane Corso?',
          answer:
            'Crea prima un profilo privato. Aggiungi i dati essenziali, poi continua con foto, origine e readiness quando il profilo ha contesto sufficiente.',
          href: '/my-dogs/new',
          actionLabel: 'Aggiungi Cane Corso',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'I miei Cane Corso',
        },
        {
          id: 'photos',
          question: 'Quali foto devo preparare?',
          answer:
            'Prepara foto naturali chiare: frontale, laterale, testa e posizione del corpo. Le foto supportano la revisione, ma da sole non provano pedigree o stato ufficiale.',
          href: '/guide?topic=member-workspace#member-workspace',
          actionLabel: 'Apri guida foto',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Apri workspace',
        },
        {
          id: 'review-ready',
          question: 'Quando il profilo è pronto per la revisione?',
          answer:
            'È pronto quando identità, foto, contesto proprietario e dettagli origine noti sono compilati onestamente. La revisione USG può comunque chiedere modifiche prima della pubblicazione.',
          href: '/my-dogs',
          actionLabel: 'Controlla profili',
          secondaryHref: '/faq',
          secondaryLabel: 'FAQ revisione',
        },
        {
          id: 'health',
          question: 'Cosa devo seguire come proprietario?',
          answer:
            'Segui peso, crescita, vaccini, sverminazione, visite veterinarie e osservazioni pratiche. Usa l’archivio come storia proprietario, non come sistema medico decisionale.',
          href: '/knowledge',
          actionLabel: 'Apri conoscenza',
          secondaryHref: '/my-dogs',
          secondaryLabel: 'Apri salute',
        },
      ],
    },
    myDogs: {
      eyebrow: 'Chiedi a MARK I',
      title: 'Costruisci il profilo senza perderti',
      subtitle: 'Identità, foto, origine, revisione, profilo pubblico',
      intro:
        'MARK I mantiene pratico I miei Cane Corso: inizia dal profilo, migliora le evidenze e invia solo quando le informazioni sono pronte per la revisione umana.',
      promptLabel: 'Scegli la domanda profilo',
      answerLabel: 'Guida profilo',
      safetyNote:
        'MARK I aiuta nella preparazione. Non approva Registro, non emette certificati e non sostituisce cure veterinarie professionali.',
      authorityNote: 'Il profilo pubblico appare solo dopo pubblicazione amministratore.',
      visualLabel: 'Guida profilo',
      questions: [
        {
          id: 'basic-info',
          question: 'Quali dati base contano di più?',
          answer:
            'Inizia da nome, data di nascita, sesso, colore, luogo, breve descrizione e identità proprietario. Questa è la base privata prima di foto e origine.',
          href: '/my-dogs/new',
          actionLabel: 'Inizia profilo',
          secondaryHref: '/profile',
          secondaryLabel: 'Profilo proprietario',
        },
        {
          id: 'origin',
          question: 'E se non conosco tutta l’origine?',
          answer:
            'Compila ciò che sai e spiega onestamente ciò che manca. Genitori, numeri pedigree, nonni e foto aiutano, ma i dati mancanti non vanno inventati.',
          href: '/my-dogs/new',
          actionLabel: 'Aggiungi dettagli',
          secondaryHref: '/knowledge',
          secondaryLabel: 'Scopri i profili',
        },
        {
          id: 'publication',
          question: 'Cosa succede dopo la revisione?',
          answer:
            'Il profilo può essere approvato, rimandato per modifiche, pubblicato nel Registro o valutato separatamente per readiness certificato USG. Non sono passaggi automatici.',
          href: '/faq',
          actionLabel: 'Leggi FAQ revisione',
          secondaryHref: '/registry',
          secondaryLabel: 'Vedi Registro',
        },
        {
          id: 'certificate',
          question: 'Certificato e Registro sono uguali?',
          answer:
            'No. Pubblicazione nel Registro e Certificato USG sono superfici trust collegate, ma l’emissione del certificato è una decisione ufficiale separata dopo revisione.',
          href: '/verify',
          actionLabel: 'Apri Verifica',
          secondaryHref: '/certified',
          secondaryLabel: 'Archivio certificati',
        },
      ],
    },
    knowledge: {
      eyebrow: 'Chiedi a MARK I',
      title: 'Studia Cane Corso con confini chiari',
      subtitle: 'Storia, standard, cura, crescita e responsabilità',
      intro:
        'MARK I ti indirizza ai contenuti educativi e mantiene separati osservazioni USG, standard ufficiali, cura proprietario e confini veterinari.',
      promptLabel: 'Cosa vuoi imparare?',
      answerLabel: 'Guida conoscenza',
      safetyNote:
        'Il contenuto educativo aiuta la cura, ma sintomi, trattamenti, urgenze, complicazioni gravidanza e dolore richiedono un veterinario.',
      authorityNote: 'La conoscenza USG non è scorciatoia verso approvazione ufficiale.',
      visualLabel: 'Guida conoscenza',
      questions: [
        {
          id: 'history',
          question: 'Dove studio la storia della razza?',
          answer:
            'Inizia dall’articolo storia e identità. Separa origine, contesto culturale e interpretazione USG per non confondere storia con prova ufficiale.',
          href: '/knowledge/cane-corso-history-and-identity',
          actionLabel: 'Apri storia',
          secondaryHref: '/heritage',
          secondaryLabel: 'Heritage USG',
        },
        {
          id: 'standard',
          question: 'Come leggere lo standard?',
          answer:
            'Usa l’articolo standard come orientamento proprietario: proporzioni, struttura, testa, movimento e presentazione. La revisione finale resta umana e contestuale.',
          href: '/knowledge/official-standard-owner-reading',
          actionLabel: 'Apri standard',
          secondaryHref: '/guide?topic=photo-readiness#photo-readiness',
          secondaryLabel: 'Readiness foto',
        },
        {
          id: 'growth',
          question: 'Cosa sapere sulla crescita?',
          answer:
            'La crescita si segue con calma tramite peso, età, condizione corporea, alimentazione, movimento e note veterinarie. Lo scopo è consapevolezza, non un numero perfetto.',
          href: '/knowledge/health-screening-and-responsible-care',
          actionLabel: 'Apri salute',
          secondaryHref: '/knowledge/cane-corso-pregnancy-birth-puppy-growth-calendar',
          secondaryLabel: 'Calendario cuccioli',
        },
        {
          id: 'safety',
          question: 'Cosa conta per training e sicurezza?',
          answer:
            'Cane Corso richiede guida calma, socializzazione, controllo e comportamento responsabile in pubblico. I contenuti training e sicurezza vanno letti prima dell’attività community.',
          href: '/knowledge/training-socialization-and-public-safety',
          actionLabel: 'Apri sicurezza',
          secondaryHref: '/community',
          secondaryLabel: 'Livello community',
        },
      ],
    },
    review: {
      eyebrow: 'MARK I Review Guidance',
      title: 'La revisione umana resta centrale',
      subtitle: 'Profilo, foto, readiness, decisione, pubblicazione',
      intro:
        'MARK I sostiene il ritmo di revisione admin con promemoria, ma non sostituisce mai la decisione umana per Registro, Certificato, pubblicazione o richiesta modifiche.',
      promptLabel: 'Scegli promemoria revisione',
      answerLabel: 'Guida admin',
      safetyNote:
        'Assistant guidance non è una decisione automatica. Ogni rischio, incertezza, azione certificato o pubblicazione resta responsabilità amministratore.',
      authorityNote: 'L’autorità Registro e Certificato resta sotto controllo USG.',
      visualLabel: 'Guida revisione',
      questions: [
        {
          id: 'profile-check',
          question: 'Cosa controllo per primo?',
          answer:
            'Inizia da identità proprietario, identità Cane Corso, stato, note e completezza. Un profilo chiaro riduce passaggi inutili prima di foto e certificato.',
          href: '#review-queue',
          actionLabel: 'Vai alla coda',
          secondaryHref: '#admin-certificate-flow',
          secondaryLabel: 'Flusso revisione',
        },
        {
          id: 'photo-check',
          question: 'Come revisiono le foto?',
          answer:
            'Revisiona le foto come qualità evidenza e supporto presentazione. Non trattare una foto come prova pedigree o conferma automatica di razza.',
          href: '#admin-photo-assistant',
          actionLabel: 'Guida foto',
          secondaryHref: '#review-queue',
          secondaryLabel: 'Coda',
        },
        {
          id: 'decision',
          question: 'Quando chiedo modifiche?',
          answer:
            'Chiedi modifiche quando il profilo manca di identità chiara, foto usabili, contesto origine onesto o informazioni sufficienti per una decisione pubblica responsabile.',
          href: '#review-queue',
          actionLabel: 'Revisiona record',
          secondaryHref: '#admin-certificate-flow',
          secondaryLabel: 'Flusso decisione',
        },
        {
          id: 'certificate',
          question: 'Qual è il confine del certificato?',
          answer:
            'L’emissione del certificato è separata dalla pubblicazione Registry. Un profilo può essere pubblico senza certificato, e l’azione certificato resta una decisione admin USG deliberata.',
          href: '#admin-certificate-flow',
          actionLabel: 'Flusso certificato',
          secondaryHref: '/verify',
          secondaryLabel: 'Verifica pubblica',
        },
      ],
    },
  },
};

export function getAskMarkICopy(locale: Locale, variant: AskMarkIVariant): AskMarkICopy {
  return copyByLocale[locale]?.[variant] ?? copyByLocale.en[variant];
}
