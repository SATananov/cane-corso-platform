import { PageShell } from '@/components/page-shell';
import type { PageShellCard } from '@/components/page-shell';
import { getCurrentLocale } from '@/lib/locale.server';

type FaqItem = { question: string; answer: string; href?: string; hrefLabel?: string };
type FaqSection = { id: string; eyebrow: string; title: string; description: string; items: readonly FaqItem[] };
type ReferenceLink = { title: string; description: string; href: string; note: string };
type FaqCopy = {
  eyebrow: string;
  title: string;
  description: string;
  cards: readonly PageShellCard[];
  chips: readonly string[];
  priorityTitle: string;
  priorityDescription: string;
  priorityItems: readonly FaqItem[];
  navTitle: string;
  sections: readonly FaqSection[];
  referencesTitle: string;
  referencesDescription: string;
  referencesNote: string;
  references: readonly ReferenceLink[];
  expertsTitle: string;
  expertsDescription: string;
  experts: readonly string[];
  boundaryTitle: string;
  boundaryItems: readonly string[];
};

const links = {
  fciBreed: 'https://www.fci.be/en/nomenclature/ITALIAN-CANE-CORSO-343.html',
  fciStandard: 'https://www.fci.be/nomenclature/standards/343g02-en.pdf',
  enciStandard: 'https://www.enci.it/media/2603/343.pdf',
  akcStandard: 'https://images.akc.org/pdf/breeds/standards/CaneCorso.pdf',
  akcHistory: 'https://www.akc.org/expert-advice/dog-breeds/cane-corso-history/',
  ukcStandard: 'https://www.ukcdogs.com/cane-corso-italiano',
  ccaaManual: 'https://www.canecorso.org/uploads/1/1/8/2/118210967/2022_ccaa_judges_manual.pdf',
  iccgbHistory: 'https://www.iccgb.co.uk/about-the-breed/history-of-the-cane-corso/',
} as const;

const sharedReferences: readonly ReferenceLink[] = [
  { title: 'FCI breed nomenclature — Cane Corso Italiano (343)', description: 'Official FCI breed page with recognition status, country of origin, classification, and current standard data.', href: links.fciBreed, note: 'Official breed authority' },
  { title: 'FCI Standard N°343 — Cane Corso Italiano', description: 'Official standard PDF with origin, utilization, proportions, appearance, colors, and faults.', href: links.fciStandard, note: 'Official standard PDF' },
  { title: 'ENCI Italian standard PDF', description: 'Italian kennel-club standard reference for reading Cane Corso in its Italian context.', href: links.enciStandard, note: 'Italian standard reference' },
  { title: 'AKC Official Standard of the Cane Corso', description: 'American Kennel Club standard PDF for comparison with official U.S. wording.', href: links.akcStandard, note: 'Official AKC standard' },
  { title: 'AKC Cane Corso history article', description: 'Accessible history reading on ancient Italy, decline, revival, and names connected to modern recovery.', href: links.akcHistory, note: 'History and revival' },
  { title: 'UKC Cane Corso Italiano Breed Standard', description: 'United Kennel Club breed standard for comparison with FCI and AKC language.', href: links.ukcStandard, note: 'UKC standard' },
  { title: "CCAA Judge's Manual 2022", description: 'Judge-education reference from the Cane Corso Association of America for structure and evaluation language.', href: links.ccaaManual, note: 'Judge education' },
  { title: 'Italian Cane Corso Club of Great Britain — breed history', description: 'Breed-history reading with context on SACC and the formal recovery / standardization period.', href: links.iccgbHistory, note: 'History reference' },
];

const copyByLocale: Record<'en' | 'bg' | 'it', FaqCopy> = {
  en: {
    eyebrow: 'FAQ / Clarity center',
    title: 'One calm place to understand the whole USG Cane Corso ecosystem',
    description: 'A platform-wide FAQ for Registry, Certificate, Verify, Gallery, Community, Partners, Knowledge, USG Bulgarico, privacy, and source-backed Cane Corso education.',
    cards: [
      { eyebrow: 'Platform map', title: 'Every public surface has a separate role', description: 'Registry, Certificate, Verify, Gallery, Community, Partners, and Knowledge are connected, but they do not mean the same thing.', href: '#platform-map', meta: 'USG • Registry • Knowledge', icon: 'platform' },
      { eyebrow: 'Trust boundary', title: 'USG Certificate is not a pedigree', description: 'The certificate is a platform trust document with evidence levels. It never replaces FCI, clubs, judges, or official pedigrees.', href: '#certificate-verify', meta: 'Certificate • Verify • evidence', icon: 'verify' },
      { eyebrow: 'Breed education', title: 'Official sources and revival history stay visible', description: 'Serious standards, history, and judge-education sources are linked directly for responsible reading.', href: '#official-references', meta: 'FCI • ENCI • AKC • CCAA', icon: 'knowledge' },
    ],
    chips: ['Whole platform FAQ', 'Official boundaries', 'Trusted source links'],
    priorityTitle: 'The questions most people ask first',
    priorityDescription: 'Short answers before a visitor registers, submits a profile, reads Knowledge, or uses Community.',
    priorityItems: [
      { question: 'Is USG an official kennel organization?', answer: 'No. USG is a premium platform ecosystem for presentation, review, education, and community trust. It respects FCI, official clubs, judges, pedigrees, and kennel organizations, but does not replace them.', href: '/platform#usg-identity', hrefLabel: 'Open USG identity' },
      { question: 'Can a Cane Corso without full pedigree documents still be presented?', answer: 'Yes, if the profile is honest about the evidence available. Lack of documents is not automatic proof that the dog is not Cane Corso, but it limits what can be officially proven. USG uses evidence levels to keep that distinction clear.', href: '/knowledge/usg-certificate-evidence-levels', hrefLabel: 'Read evidence levels' },
      { question: 'Is USG Bulgarico an official standard or a new breed?', answer: 'No. USG Bulgarico is an observational framework for possible local phenotype directions in Bulgaria. It is not a new breed, not a national variant, and not a replacement for the official Cane Corso Italiano standard.', href: '/knowledge/usg-bulgarico-observational-framework', hrefLabel: 'Read Bulgarico framework' },
      { question: 'Why are there external Cane Corso source links?', answer: 'Because Knowledge should not be closed inside USG. Official standards, history, judge education, and expert references help owners compare platform explanations with serious outside material.', href: '#official-references', hrefLabel: 'See source links' },
    ],
    navTitle: 'Jump to a platform area',
    sections: [
      { id: 'platform-map', eyebrow: '01 / Platform', title: 'What is Cane Corso Platform by USG?', description: 'The platform is an ecosystem, not a single listing page.', items: [
        { question: 'What does Unico Suo Genere mean?', answer: 'Unico Suo Genere means one of a kind. In the platform it means a premium way to organize Cane Corso identity, owner history, review, trust, education, and community support without pretending to be official kennel authority.', href: '/platform', hrefLabel: 'Open Platform' },
        { question: 'Is the platform only for Bulgaria?', answer: 'No. USG starts from a Bulgarian creator and Bulgarian observations, but the platform idea is international and can help responsible Cane Corso owners, breeders, partners, and communities elsewhere.' },
        { question: 'What does each surface do?', answer: 'Registry publishes reviewed public profiles. Certificate records a separate USG trust decision. Verify checks an issued USG code. Gallery is curated visual presentation. Community helps with moderated requests. Partners lists approved services. Knowledge educates and explains boundaries.' },
      ] },
      { id: 'registry-profiles', eyebrow: '02 / Registry', title: 'Registry, profiles, and evidence levels', description: 'Registry is visibility, not an automatic pedigree claim.', items: [
        { question: 'What is the USG Registry?', answer: 'The Registry is the official public profile layer inside USG. A published profile means the platform reviewed and made the profile visible. It does not automatically mean official pedigree or USG Certificate.', href: '/registry', hrefLabel: 'Open Registry' },
        { question: 'Can I add a Cane Corso without FCI paperwork?', answer: 'Yes, but the profile must be transparent. USG can present photos, owner history, known parents, family-line notes, and admin observations while clearly showing that official proof is incomplete when documents are missing.' },
        { question: 'Does lack of documents mean the dog is fake?', answer: 'No. Lack of documents means lack of official documentary proof. It does not erase owner history, family line, phenotype, character, or the possibility that the dog comes from Cane Corso lines.' },
      ] },
      { id: 'certificate-verify', eyebrow: '03 / Certificate + Verify', title: 'What USG Certificate and Verify really mean', description: 'The certificate should feel premium, but the wording must stay exact.', items: [
        { question: 'Is USG Certificate a pedigree?', answer: 'No. USG Certificate is a platform trust document. It can show reviewed identity, evidence level, owner history, available documents, photos, Registry connection, and a Verify code. It is not an FCI pedigree, club registration, judge report, veterinary certificate, or official kennel document.', href: '/knowledge/usg-certificate-evidence-levels', hrefLabel: 'Open certificate explanation' },
        { question: 'What are evidence levels?', answer: 'Evidence levels explain what is available: officially documented profile, documented family line, observed Cane Corso profile, or pending / unconfirmed profile. They are not value levels and do not measure the love, importance, or character of the dog.' },
        { question: 'What does Verify check?', answer: 'Verify checks a USG-issued certificate code and the matching platform record. It does not check FCI databases or replace official kennel registries.', href: '/verify', hrefLabel: 'Open Verify' },
      ] },
      { id: 'gallery-community-partners', eyebrow: '04 / Gallery + Community + Partners', title: 'Public presence, help requests, and services', description: 'The platform separates beauty, usefulness, and sensitive contact.', items: [
        { question: 'Is Gallery a ranking?', answer: 'No. Gallery is a curated visual surface. It can highlight strong public presentation, but it is not a ranking of dog value and does not replace Registry, Certificate, or official documents.', href: '/gallery', hrefLabel: 'Open Gallery' },
        { question: 'Why does Community use admin-mediated contact?', answer: 'Sensitive requests such as breeding, puppies, adoption / new home, services, transport, and lost / found help should not become uncontrolled direct contact. Admin mediation protects privacy, safety, trust, and quality.', href: '/community', hrefLabel: 'Open Community' },
        { question: 'What are Partners and Services?', answer: 'Partner and service listings can include trainers, boarding, transport, pet-friendly places, shops, and other Cane Corso-relevant services. Approval and categorization keep the ecosystem useful and trusted.', href: '/partners', hrefLabel: 'Open Partners' },
      ] },
      { id: 'knowledge-bulgarico', eyebrow: '05 / Knowledge + Bulgarico', title: 'Breed education, official sources, and USG observations', description: 'Knowledge teaches; it does not replace official standards or professional advice.', items: [
        { question: 'What is Knowledge?', answer: 'Knowledge is the educational layer for Cane Corso history, standard reading, ownership, health awareness, training, travel, adoption, USG trust language, and platform boundaries. It cites serious sources and separates official facts from USG observations.', href: '/knowledge', hrefLabel: 'Open Knowledge' },
        { question: 'What is USG Bulgarico?', answer: 'USG Bulgarico is a Bulgarian observational reading of Cane Corso phenotype directions. It may discuss possible local tendencies using photos, lineage notes, structure, movement, origin, and owner observation, but it remains a research and education layer, not an official standard.', href: '/knowledge/usg-bulgarico-observational-framework', hrefLabel: 'Open Bulgarico article' },
        { question: 'Does color prove type, quality, origin, or health?', answer: 'No. Color can be observed together with line, origin, selection, structure, and movement, but color alone does not prove type, quality, origin, health, or value.' },
      ] },
      { id: 'privacy-safety', eyebrow: '06 / Privacy + safety', title: 'Public visibility and moderation', description: 'Trust needs boundaries, not only design.', items: [
        { question: 'Who decides what becomes public?', answer: 'Public visibility is controlled by the platform workflow and admin review. Owner submissions, community listings, partner applications, and trust states should not become public authority automatically.' },
        { question: 'Why hide or limit some contact details?', answer: 'Direct contact can be risky in breeding, puppies, adoption, transport, services, and lost / found cases. The platform protects users through contact preferences and admin-mediated connection before exposing sensitive details.' },
        { question: 'Can an admin reject or ask for changes?', answer: 'Yes. Admin review can approve, reject, request changes, publish, archive, or connect parties depending on the surface. This protects the platform from confusion, low-quality listings, and unsafe public claims.' },
      ] },
    ],
    referencesTitle: 'Important Cane Corso source links', referencesDescription: 'These links are reference doors for owners. They are not owned by USG and should be read directly when official or specialist wording matters.', referencesNote: 'External sources open in a new tab. USG links to them for education, not to claim ownership of their material.', references: sharedReferences,
    expertsTitle: 'Names to research when reading about the revival', expertsDescription: 'USG presents historical names carefully: as people, dogs, and organizations frequently connected to recovery, documentation, judging, or breed education sources — not as platform endorsements or private claims.',
    experts: ['Dr. Paolo Breber — widely connected with the recovery and documentation of surviving Cane Corso-type dogs.', 'Società Amatori Cane Corso (SACC) — breed society linked to the formal recovery and early standardization period.', 'Giovanni Bonnetti, Vito Indiveri, Stefano Gandolfi, and the Malavasi brothers — names appearing in modern recovery history summaries.', 'Antonio Morsiani and Stefano Gandolfi — names connected to specialist breed literature and judge-education references.', 'Basir and Babak — dogs frequently referenced as important early modern-standard examples.'],
    boundaryTitle: 'USG trust promises on this FAQ', boundaryItems: ['We do not claim that USG replaces FCI, ENCI, AKC, UKC, clubs, judges, veterinary documents, or pedigrees.', 'We do not claim that USG Bulgarico is a new breed, official standard, or national variant.', 'We do not use color alone as proof of type, origin, quality, health, or value.', 'We do not insult breeders, owners, lines, dogs, countries, or official organizations.'],
  },
  bg: {
    eyebrow: 'FAQ / Център за яснота',
    title: 'Едно спокойно място, което обяснява цялата USG Cane Corso екосистема',
    description: 'FAQ за цялата платформа: Registry, Certificate, Verify, Gallery, Community, Partners, Knowledge, USG Bulgarico, поверителност и знание за Cane Corso с проверени източници.',
    cards: [
      { eyebrow: 'Карта на платформата', title: 'Всяка публична част има отделна роля', description: 'Registry, Certificate, Verify, Gallery, Community, Partners и Knowledge са свързани, но не означават едно и също нещо.', href: '#platform-map', meta: 'USG • Registry • Knowledge', icon: 'platform' },
      { eyebrow: 'Граница на доверие', title: 'USG Certificate не е родословие', description: 'Сертификатът е платформен документ за доверие с нива на доказуемост. Той не заменя FCI, клубове, съдии или официални родословия.', href: '#certificate-verify', meta: 'Сертификат • проверка • доказуемост', icon: 'verify' },
      { eyebrow: 'Знание за породата', title: 'Официалните източници и историята на възраждането остават видими', description: 'Сериозни стандарти, история и judge-education източници са свързани директно за отговорно четене.', href: '#official-references', meta: 'FCI • ENCI • AKC • CCAA', icon: 'knowledge' },
    ],
    chips: ['FAQ за цялата платформа', 'Официални граници', 'Проверени източници'],
    priorityTitle: 'Въпросите, които хората задават първо',
    priorityDescription: 'Кратки отговори преди посетителят да се регистрира, да подаде профил, да чете Knowledge или да използва Community.',
    priorityItems: [
      { question: 'USG официална киноложка организация ли е?', answer: 'Не. USG е премиум платформена екосистема за представяне, преглед, знание и доверие в общността. Тя уважава FCI, официалните клубове, съдии, родословия и киноложки организации, но не ги заменя.', href: '/platform#usg-identity', hrefLabel: 'Отвори USG идентичност' },
      { question: 'Може ли Cane Corso без пълно родословие да бъде представено?', answer: 'Да, ако профилът е честен за наличните доказателства. Липсата на документи не доказва автоматично, че кучето не е Cane Corso, но ограничава това, което може да бъде официално доказано. USG използва нива на доказуемост, за да пази тази разлика ясна.', href: '/knowledge/usg-certificate-evidence-levels', hrefLabel: 'Прочети нивата на доказуемост' },
      { question: 'USG Bulgarico официален стандарт или нова порода ли е?', answer: 'Не. USG Bulgarico е наблюдателна рамка за възможни локални фенотипни посоки в България. Тя не е нова порода, не е национален вариант и не заменя официалния стандарт Cane Corso Italiano.', href: '/knowledge/usg-bulgarico-observational-framework', hrefLabel: 'Прочети Bulgarico рамката' },
      { question: 'Защо има линкове към външни Cane Corso източници?', answer: 'Защото Knowledge не трябва да бъде затворен само вътре в USG. Официални стандарти, история, judge education и експертни материали помагат на собствениците да сравняват платформените обяснения със сериозни външни източници.', href: '#official-references', hrefLabel: 'Виж източниците' },
    ],
    navTitle: 'Премини към част от платформата',
    sections: [
      { id: 'platform-map', eyebrow: '01 / Платформа', title: 'Какво е Cane Corso Platform by USG?', description: 'Платформата е екосистема, не една страница със списък.', items: [
        { question: 'Какво означава Unico Suo Genere?', answer: 'Unico Suo Genere означава единствен по рода си. В платформата това е премиум начин да се подредят Cane Corso идентичност, история на собственика, преглед, доверие, образование и общностна помощ, без USG да се представя като официална киноложка власт.', href: '/platform', hrefLabel: 'Отвори Platform' },
        { question: 'Платформата само за България ли е?', answer: 'Не. USG започва от български създател и български наблюдения, но идеята е международна и може да помага на отговорни Cane Corso собственици, развъдчици, партньори и общности и в други държави.' },
        { question: 'Какво прави всяка основна част?', answer: 'Registry публикува прегледани публични профили. Certificate записва отделно USG решение за доверие. Verify проверява издаден USG код. Gallery е подбрано визуално представяне. Community помага с модерирани заявки. Partners показва одобрени услуги. Knowledge образова и обяснява границите.' },
      ] },
      { id: 'registry-profiles', eyebrow: '02 / Registry', title: 'Registry, профили и нива на доказуемост', description: 'Registry е публична видимост, не автоматична претенция за родословие.', items: [
        { question: 'Какво е USG Registry?', answer: 'Registry е официалният публичен профилен слой вътре в USG. Публикуван профил означава, че платформата е прегледала и показала профила. Това не означава автоматично официално родословие или USG Certificate.', href: '/registry', hrefLabel: 'Отвори Registry' },
        { question: 'Мога ли да добавя Cane Corso без FCI документи?', answer: 'Да, но профилът трябва да бъде прозрачен. USG може да представи снимки, история от собственика, известни родители, бележки за семейна линия и админ наблюдения, като ясно показва, че официалното доказване е непълно, когато документите липсват.' },
        { question: 'Липсата на документи означава ли, че кучето е фалшиво?', answer: 'Не. Липсата на документи означава липса на официално документално доказване. Тя не изтрива автоматично историята на собственика, семейната линия, фенотипа, характера или възможността кучето да идва от Cane Corso линии.' },
      ] },
      { id: 'certificate-verify', eyebrow: '03 / Certificate + Verify', title: 'Какво наистина означават USG Certificate и Verify', description: 'Сертификатът трябва да изглежда премиум, но езикът му трябва да остане точен.', items: [
        { question: 'USG Certificate родословие ли е?', answer: 'Не. USG Certificate е платформен trust документ. Той може да покаже прегледана идентичност, ниво на доказуемост, история на собственика, налични документи, снимки, връзка с Registry и Verify код. Той не е FCI родословие, клубна регистрация, съдебен доклад, ветеринарен сертификат или официален киноложки документ.', href: '/knowledge/usg-certificate-evidence-levels', hrefLabel: 'Отвори обяснението за сертификата' },
        { question: 'Какво са нива на доказуемост?', answer: 'Нивата на доказуемост обясняват какво е налично: официално документиран профил, документирана семейна линия, наблюдателен Cane Corso профил или чакащ / непотвърден профил. Това не са нива на стойност и не измерват любовта, значението или характера на кучето.' },
        { question: 'Какво проверява Verify?', answer: 'Verify проверява издаден от USG сертификатен код и съответния платформен запис. Той не проверява FCI бази данни и не заменя официални киноложки регистри.', href: '/verify', hrefLabel: 'Отвори Verify' },
      ] },
      { id: 'gallery-community-partners', eyebrow: '04 / Gallery + Community + Partners', title: 'Публично присъствие, заявки за помощ и услуги', description: 'Платформата разделя красота, полезност и чувствителен контакт.', items: [
        { question: 'Gallery класация ли е?', answer: 'Не. Gallery е подбрана визуална повърхност. Тя може да показва силно публично представяне, но не е класация за стойността на кучето и не заменя Registry, Certificate или официални документи.', href: '/gallery', hrefLabel: 'Отвори Gallery' },
        { question: 'Защо Community използва админ-посредничество?', answer: 'Чувствителни заявки като разплод, малки, осиновяване / нов дом, услуги, транспорт и изгубено / намерено не трябва да стават неконтролиран директен контакт. Админ-посредничеството пази поверителност, безопасност, доверие и качество.', href: '/community', hrefLabel: 'Отвори Community' },
        { question: 'Какво са Partners и Services?', answer: 'Партньорски и service listings могат да включват треньори, хотели, транспорт, pet-friendly места, магазини и други услуги, свързани с Cane Corso. Одобрението и категоризацията пазят екосистемата полезна и доверена.', href: '/partners', hrefLabel: 'Отвори Partners' },
      ] },
      { id: 'knowledge-bulgarico', eyebrow: '05 / Knowledge + Bulgarico', title: 'Знание за породата, официални източници и USG наблюдения', description: 'Knowledge образова; то не заменя официални стандарти или професионална преценка.', items: [
        { question: 'Какво е Knowledge?', answer: 'Knowledge е образователният слой за история на Cane Corso, четене на стандарта, собственичество, здравна осведоменост, обучение, пътуване, осиновяване, USG trust език и платформени граници. То цитира сериозни източници и разделя официални факти от USG наблюдения.', href: '/knowledge', hrefLabel: 'Отвори Knowledge' },
        { question: 'Какво е USG Bulgarico?', answer: 'USG Bulgarico е български наблюдателен прочит на фенотипни посоки при Cane Corso. Той може да разглежда възможни локални тенденции чрез снимки, бележки за линия, структура, движение, произход и наблюдения на собственици, но остава изследователски и образователен слой, не официален стандарт.', href: '/knowledge/usg-bulgarico-observational-framework', hrefLabel: 'Отвори Bulgarico статията' },
        { question: 'Цветът доказва ли тип, качество, произход или здраве?', answer: 'Не. Цветът може да се наблюдава заедно с линия, произход, селекция, структура и движение, но цветът сам по себе си не доказва тип, качество, произход, здраве или стойност.' },
      ] },
      { id: 'privacy-safety', eyebrow: '06 / Поверителност + безопасност', title: 'Публична видимост и модерация', description: 'Доверието има нужда от граници, не само от дизайн.', items: [
        { question: 'Кой решава какво става публично?', answer: 'Публичната видимост се контролира от платформения workflow и админ преглед. Собственически submissions, community listings, partner applications и trust states не трябва автоматично да се превръщат в публична власт.' },
        { question: 'Защо някои контакти се скриват или ограничават?', answer: 'Директният контакт може да бъде рисков при разплод, малки, осиновяване, транспорт, услуги и изгубено / намерено. Платформата пази потребителите чрез contact preferences и админ-посредничество преди да показва чувствителни данни.' },
        { question: 'Може ли админ да откаже или да поиска промени?', answer: 'Да. Админ прегледът може да одобри, откаже, поиска промени, публикува, архивира или свърже страни според конкретната част на платформата. Това пази платформата от объркване, нискокачествени listings и небезопасни публични твърдения.' },
      ] },
    ],
    referencesTitle: 'Важни Cane Corso източници', referencesDescription: 'Тези линкове са вход към сериозни източници за собственици. Те не са собственост на USG и трябва да се четат директно, когато официалната или специализираната формулировка е важна.', referencesNote: 'Външните източници се отварят в нов таб. USG ги свързва за образование, не за да претендира собственост върху тяхното съдържание.', references: sharedReferences,
    expertsTitle: 'Имена за проучване при историята на възраждането', expertsDescription: 'USG представя историческите имена внимателно: като хора, кучета и организации, които често се свързват с възстановяване, документиране, judging или breed education източници — не като платформени endorsement-и или частни твърдения.',
    experts: ['Dr. Paolo Breber — широко свързван с възстановяването и документирането на оцелели Cane Corso-type кучета.', 'Società Amatori Cane Corso (SACC) — породното общество, свързано с формалното възстановяване и ранния период на стандартизиране.', 'Giovanni Bonnetti, Vito Indiveri, Stefano Gandolfi и братята Malavasi — имена, които се срещат в modern recovery history summaries.', 'Antonio Morsiani и Stefano Gandolfi — имена, свързани със specialist breed literature и judge-education references.', 'Basir и Babak — кучета, често споменавани като важни ранни примери за модерния стандарт.'],
    boundaryTitle: 'USG обещания за доверие в този FAQ', boundaryItems: ['Не твърдим, че USG заменя FCI, ENCI, AKC, UKC, клубове, съдии, ветеринарни документи или родословия.', 'Не твърдим, че USG Bulgarico е нова порода, официален стандарт или национален вариант.', 'Не използваме цвят сам по себе си като доказателство за тип, произход, качество, здраве или стойност.', 'Не обиждаме развъдчици, собственици, линии, кучета, държави или официални организации.'],
  },
  it: {
    eyebrow: 'FAQ / Centro chiarezza',
    title: 'Un luogo calmo per capire tutto l’ecosistema USG Cane Corso',
    description: 'FAQ per tutta la piattaforma: Registry, Certificate, Verify, Gallery, Community, Partners, Knowledge, USG Bulgarico, privacy ed educazione Cane Corso con fonti affidabili.',
    cards: [
      { eyebrow: 'Mappa piattaforma', title: 'Ogni superficie pubblica ha un ruolo separato', description: 'Registry, Certificate, Verify, Gallery, Community, Partners e Knowledge sono collegati, ma non significano la stessa cosa.', href: '#platform-map', meta: 'USG • Registry • Knowledge', icon: 'platform' },
      { eyebrow: 'Confine di fiducia', title: 'USG Certificate non è un pedigree', description: 'Il certificato è un documento di fiducia della piattaforma con livelli di evidenza. Non sostituisce FCI, club, giudici o pedigree ufficiali.', href: '#certificate-verify', meta: 'Certificato • verifica • evidenza', icon: 'verify' },
      { eyebrow: 'Educazione razza', title: 'Fonti ufficiali e storia della rinascita restano visibili', description: 'Standard, storia e riferimenti judge-education seri sono collegati direttamente per una lettura responsabile.', href: '#official-references', meta: 'FCI • ENCI • AKC • CCAA', icon: 'knowledge' },
    ],
    chips: ['FAQ per tutta la piattaforma', 'Confini ufficiali', 'Link a fonti affidabili'],
    priorityTitle: 'Le domande che arrivano per prime', priorityDescription: 'Risposte brevi prima di registrarsi, inviare un profilo, leggere Knowledge o usare Community.',
    priorityItems: [
      { question: 'USG è un’organizzazione cinofila ufficiale?', answer: 'No. USG è un ecosistema premium per presentazione, revisione, conoscenza e fiducia nella community. Rispetta FCI, club ufficiali, giudici, pedigree e organizzazioni cinofile, ma non li sostituisce.', href: '/platform#usg-identity', hrefLabel: 'Apri identità USG' },
      { question: 'Un Cane Corso senza pedigree completo può essere presentato?', answer: 'Sì, se il profilo è onesto sulle evidenze disponibili. La mancanza di documenti non prova automaticamente che il cane non sia Cane Corso, ma limita ciò che può essere provato ufficialmente. USG usa livelli di evidenza per mantenere chiara questa distinzione.', href: '/knowledge/usg-certificate-evidence-levels', hrefLabel: 'Leggi livelli di evidenza' },
      { question: 'USG Bulgarico è uno standard ufficiale o una nuova razza?', answer: 'No. USG Bulgarico è un framework osservativo per possibili direzioni fenotipiche locali in Bulgaria. Non è una nuova razza, non è una variante nazionale e non sostituisce lo standard ufficiale Cane Corso Italiano.', href: '/knowledge/usg-bulgarico-observational-framework', hrefLabel: 'Leggi Bulgarico' },
      { question: 'Perché ci sono link a fonti esterne?', answer: 'Perché Knowledge non dovrebbe restare chiuso dentro USG. Standard ufficiali, storia, judge education e materiali specialistici aiutano a confrontare le spiegazioni della piattaforma con fonti serie.', href: '#official-references', hrefLabel: 'Vedi fonti' },
    ],
    navTitle: 'Vai a un’area della piattaforma',
    sections: [
      { id: 'platform-map', eyebrow: '01 / Piattaforma', title: 'Che cos’è Cane Corso Platform by USG?', description: 'La piattaforma è un ecosistema, non una semplice lista.', items: [
        { question: 'Che cosa significa Unico Suo Genere?', answer: 'Unico Suo Genere significa one of a kind. Nella piattaforma è un modo premium per organizzare identità Cane Corso, storia del proprietario, revisione, fiducia, educazione e supporto community, senza presentare USG come autorità cinofila ufficiale.', href: '/platform', hrefLabel: 'Apri Platform' },
        { question: 'La piattaforma è solo per la Bulgaria?', answer: 'No. USG nasce da un creatore bulgaro e da osservazioni bulgare, ma l’idea è internazionale e può aiutare proprietari, allevatori, partner e community Cane Corso responsabili anche in altri paesi.' },
        { question: 'Che cosa fa ogni superficie principale?', answer: 'Registry pubblica profili pubblici revisionati. Certificate registra una decisione USG separata di fiducia. Verify controlla un codice USG emesso. Gallery è presentazione visuale curata. Community aiuta con richieste moderate. Partners mostra servizi approvati. Knowledge educa e spiega confini.' },
      ] },
      { id: 'registry-profiles', eyebrow: '02 / Registry', title: 'Registry, profili e livelli di evidenza', description: 'Registry è visibilità pubblica, non una pretesa automatica di pedigree.', items: [
        { question: 'Che cos’è USG Registry?', answer: 'Registry è il layer ufficiale dei profili pubblici dentro USG. Un profilo pubblicato significa che la piattaforma lo ha revisionato e reso visibile. Non significa automaticamente pedigree ufficiale o USG Certificate.', href: '/registry', hrefLabel: 'Apri Registry' },
        { question: 'Posso aggiungere un Cane Corso senza documenti FCI?', answer: 'Sì, ma il profilo deve essere trasparente. USG può presentare foto, storia del proprietario, genitori conosciuti, note di linea familiare e osservazioni admin, mostrando chiaramente quando la prova ufficiale è incompleta.' },
        { question: 'La mancanza di documenti significa che il cane è falso?', answer: 'No. Mancanza di documenti significa mancanza di prova documentale ufficiale. Non cancella storia del proprietario, linea familiare, fenotipo, carattere o possibilità che il cane provenga da linee Cane Corso.' },
      ] },
      { id: 'certificate-verify', eyebrow: '03 / Certificate + Verify', title: 'Che cosa significano davvero USG Certificate e Verify', description: 'Il certificato deve sembrare premium, ma il linguaggio deve restare esatto.', items: [
        { question: 'USG Certificate è un pedigree?', answer: 'No. USG Certificate è un documento di fiducia della piattaforma. Può mostrare identità revisionata, livello di evidenza, storia del proprietario, documenti disponibili, foto, collegamento Registry e codice Verify. Non è pedigree FCI, registrazione di club, relazione di giudice, certificato veterinario o documento cinofilo ufficiale.', href: '/knowledge/usg-certificate-evidence-levels', hrefLabel: 'Apri certificato' },
        { question: 'Che cosa sono i livelli di evidenza?', answer: 'I livelli di evidenza spiegano cosa è disponibile: profilo documentato ufficialmente, linea familiare documentata, profilo Cane Corso osservato o profilo in attesa / non confermato. Non sono livelli di valore e non misurano amore, importanza o carattere del cane.' },
        { question: 'Che cosa controlla Verify?', answer: 'Verify controlla un codice certificato emesso da USG e il record corrispondente della piattaforma. Non controlla database FCI e non sostituisce registri cinofili ufficiali.', href: '/verify', hrefLabel: 'Apri Verify' },
      ] },
      { id: 'gallery-community-partners', eyebrow: '04 / Gallery + Community + Partners', title: 'Presenza pubblica, richieste di aiuto e servizi', description: 'La piattaforma separa bellezza, utilità e contatto sensibile.', items: [
        { question: 'Gallery è una classifica?', answer: 'No. Gallery è una superficie visuale curata. Può evidenziare una forte presentazione pubblica, ma non è una classifica del valore del cane e non sostituisce Registry, Certificate o documenti ufficiali.', href: '/gallery', hrefLabel: 'Apri Gallery' },
        { question: 'Perché Community usa contatto mediato da admin?', answer: 'Richieste sensibili come riproduzione, cuccioli, adozione / nuova casa, servizi, trasporto e smarrito / trovato non dovrebbero diventare contatto diretto non controllato. La mediazione admin protegge privacy, sicurezza, fiducia e qualità.', href: '/community', hrefLabel: 'Apri Community' },
        { question: 'Che cosa sono Partners e Services?', answer: 'Partner e service listings possono includere trainer, boarding, trasporto, luoghi pet-friendly, negozi e altri servizi rilevanti per Cane Corso. Approvazione e categorizzazione mantengono l’ecosistema utile e affidabile.', href: '/partners', hrefLabel: 'Apri Partners' },
      ] },
      { id: 'knowledge-bulgarico', eyebrow: '05 / Knowledge + Bulgarico', title: 'Educazione razza, fonti ufficiali e osservazioni USG', description: 'Knowledge educa; non sostituisce standard ufficiali o valutazioni professionali.', items: [
        { question: 'Che cos’è Knowledge?', answer: 'Knowledge è il layer educativo per storia Cane Corso, lettura dello standard, ownership, salute, training, viaggio, adozione, linguaggio di fiducia USG e confini della piattaforma. Cita fonti serie e separa fatti ufficiali da osservazioni USG.', href: '/knowledge', hrefLabel: 'Apri Knowledge' },
        { question: 'Che cos’è USG Bulgarico?', answer: 'USG Bulgarico è una lettura osservativa bulgara delle direzioni fenotipiche Cane Corso. Può discutere possibili tendenze locali tramite foto, note di linea, struttura, movimento, origine e osservazione dei proprietari, ma resta ricerca ed educazione, non standard ufficiale.', href: '/knowledge/usg-bulgarico-observational-framework', hrefLabel: 'Apri Bulgarico' },
        { question: 'Il colore prova tipo, qualità, origine o salute?', answer: 'No. Il colore può essere osservato insieme a linea, origine, selezione, struttura e movimento, ma il colore da solo non prova tipo, qualità, origine, salute o valore.' },
      ] },
      { id: 'privacy-safety', eyebrow: '06 / Privacy + sicurezza', title: 'Visibilità pubblica e moderazione', description: 'La fiducia ha bisogno di confini, non solo design.', items: [
        { question: 'Chi decide cosa diventa pubblico?', answer: 'La visibilità pubblica è controllata dal workflow della piattaforma e dalla revisione admin. Owner submissions, community listings, partner applications e trust states non dovrebbero diventare automaticamente autorità pubblica.' },
        { question: 'Perché alcuni contatti sono nascosti o limitati?', answer: 'Il contatto diretto può essere rischioso in riproduzione, cuccioli, adozione, trasporto, servizi e smarrito / trovato. La piattaforma protegge gli utenti tramite preferenze di contatto e mediazione admin prima di mostrare dati sensibili.' },
        { question: 'Un admin può rifiutare o chiedere modifiche?', answer: 'Sì. La revisione admin può approvare, rifiutare, chiedere modifiche, pubblicare, archiviare o collegare le parti secondo la superficie specifica. Questo protegge da confusione, listings di bassa qualità e affermazioni pubbliche non sicure.' },
      ] },
    ],
    referencesTitle: 'Link importanti sul Cane Corso', referencesDescription: 'Questi link sono riferimenti per proprietari. Non appartengono a USG e dovrebbero essere letti direttamente quando la formulazione ufficiale o specialistica conta.', referencesNote: 'Le fonti esterne si aprono in una nuova scheda. USG le collega per educazione, non per rivendicare proprietà del loro materiale.', references: sharedReferences,
    expertsTitle: 'Nomi da ricercare nella storia della rinascita', expertsDescription: 'USG presenta i nomi storici con attenzione: come persone, cani e organizzazioni spesso collegate a recupero, documentazione, judging o fonti di breed education — non come endorsement della piattaforma.',
    experts: ['Dr. Paolo Breber — ampiamente collegato al recupero e alla documentazione di cani Cane Corso-type sopravvissuti.', 'Società Amatori Cane Corso (SACC) — società di razza collegata al recupero formale e al primo periodo di standardizzazione.', 'Giovanni Bonnetti, Vito Indiveri, Stefano Gandolfi e i fratelli Malavasi — nomi presenti in modern recovery history summaries.', 'Antonio Morsiani e Stefano Gandolfi — nomi collegati a specialist breed literature e judge-education references.', 'Basir e Babak — cani spesso menzionati come esempi iniziali importanti per lo standard moderno.'],
    boundaryTitle: 'Promesse di fiducia USG in questa FAQ', boundaryItems: ['Non affermiamo che USG sostituisca FCI, ENCI, AKC, UKC, club, giudici, documenti veterinari o pedigree.', 'Non affermiamo che USG Bulgarico sia una nuova razza, uno standard ufficiale o una variante nazionale.', 'Non usiamo il colore da solo come prova di tipo, origine, qualità, salute o valore.', 'Non offendiamo allevatori, proprietari, linee, cani, paesi o organizzazioni ufficiali.'],
  },
};

export default async function FaqPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const actionLabel = locale === 'bg' ? 'Отвори' : locale === 'it' ? 'Apri' : 'Open';
  const helpLabel = locale === 'bg' ? 'Наръчник' : locale === 'it' ? 'Guida' : 'Guide';

  return (
    <PageShell eyebrow={copy.eyebrow} title={copy.title} description={copy.description} cards={copy.cards} actionLabel={actionLabel} accentLabel={copy.eyebrow} helpHref="/guide?topic=overview#overview" helpLabel={helpLabel} visualSrc="/brand/icons/brand-icon.png" visualAlt="USG FAQ clarity symbol" visualFit="contain" heroChips={copy.chips} variant="knowledge">
      <section className="content-card platform-faq-priority" aria-labelledby="faq-priority-title">
        <div className="platform-faq-heading"><span className="eyebrow-label">{copy.eyebrow}</span><h2 id="faq-priority-title">{copy.priorityTitle}</h2><p>{copy.priorityDescription}</p></div>
        <div className="platform-faq-priority-grid">{copy.priorityItems.map((item) => <article className="platform-faq-priority-card" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p>{item.href ? <a href={item.href}>{item.hrefLabel ?? actionLabel}</a> : null}</article>)}</div>
      </section>
      <nav className="content-card platform-faq-nav" aria-label={copy.navTitle}>
        <span className="eyebrow-label">FAQ map</span><h2>{copy.navTitle}</h2>
        <div className="platform-faq-nav-grid">{copy.sections.map((section) => <a key={section.id} href={`#${section.id}`}><span>{section.eyebrow}</span>{section.title}</a>)}<a href="#official-references"><span>Sources</span>{copy.referencesTitle}</a></div>
      </nav>
      <div className="platform-faq-section-stack">{copy.sections.map((section) => <section className="content-card platform-faq-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}><div className="platform-faq-section__intro"><span className="eyebrow-label">{section.eyebrow}</span><h2 id={`${section.id}-title`}>{section.title}</h2><p>{section.description}</p></div><div className="platform-faq-accordion">{section.items.map((item) => <details className="platform-faq-item" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p>{item.href ? <a href={item.href}>{item.hrefLabel ?? actionLabel}</a> : null}</details>)}</div></section>)}</div>
      <section className="content-card platform-faq-references" id="official-references" aria-labelledby="official-references-title">
        <div className="platform-faq-heading platform-faq-heading--split"><div><span className="eyebrow-label">Official and specialist sources</span><h2 id="official-references-title">{copy.referencesTitle}</h2><p>{copy.referencesDescription}</p></div><p className="platform-faq-source-note">{copy.referencesNote}</p></div>
        <div className="platform-faq-reference-grid">{copy.references.map((reference) => <a className="platform-faq-reference-card" href={reference.href} target="_blank" rel="noreferrer" key={reference.href}><span>{reference.note}</span><strong>{reference.title}</strong><em>{reference.description}</em></a>)}</div>
      </section>
      <section className="content-card platform-faq-experts" aria-labelledby="faq-experts-title"><div className="platform-faq-heading"><span className="eyebrow-label">Breed history reading path</span><h2 id="faq-experts-title">{copy.expertsTitle}</h2><p>{copy.expertsDescription}</p></div><ul className="platform-faq-expert-list">{copy.experts.map((expert) => <li key={expert}>{expert}</li>)}</ul></section>
      <section className="content-card platform-faq-boundary" aria-labelledby="faq-boundary-title"><div className="platform-faq-heading"><span className="eyebrow-label">USG trust boundary</span><h2 id="faq-boundary-title">{copy.boundaryTitle}</h2></div><ul className="platform-faq-boundary-list">{copy.boundaryItems.map((item) => <li key={item}>{item}</li>)}</ul></section>
    </PageShell>
  );
}
