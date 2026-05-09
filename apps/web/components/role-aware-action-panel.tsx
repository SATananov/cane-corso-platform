import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

export type RoleAwareActionSurface =
  | 'platform'
  | 'member'
  | 'myDogs'
  | 'profile'
  | 'community'
  | 'partners'
  | 'partnerApply'
  | 'knowledge'
  | 'registry'
  | 'gallery'
  | 'faq'
  | 'admin'
  | 'review'
  | 'adminEcosystem';

type PanelAction = { href: string; label: string; meta?: string };
type SurfaceCopy = { eyebrow: string; title: string; description: string; status: string; primary: PanelAction; secondary: readonly PanelAction[] };

type SurfaceMap = Record<RoleAwareActionSurface, SurfaceCopy>;

const bg: SurfaceMap = {
  platform: {
    eyebrow: 'Твоят Cane Corso център',
    title: 'Какво искаш да направиш сега?',
    description: 'Избери действие: добави Cane Corso, продължи профил, провери статус или отвори знанието, което ти трябва.',
    status: 'Не се ориентираш по секции — избираш път според намерението си.',
    primary: { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Профили и статус' },
    secondary: [
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/profile', label: 'Профил', meta: 'Собственик' },
      { href: '/knowledge', label: 'Информация за породата', meta: 'История, стандарт, грижа' },
      { href: '/faq', label: 'Помощ', meta: 'Кратки отговори' },
    ],
  },
  member: {
    eyebrow: 'Личен работен център',
    title: 'Продължи оттам, докъдето стигна',
    description: 'Тук са личните ти действия: Cane Corso профили, собственик профил, заявки и следваща стъпка.',
    status: 'Първо действие и статус. Обясненията са в Знания и Помощ.',
    primary: { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Основен път' },
    secondary: [
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Първи или нов профил' },
      { href: '/profile', label: 'Профил', meta: 'Данни за собственик' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Общност' },
      { href: '/knowledge', label: 'Какво да прочета?', meta: 'Насоки' },
    ],
  },
  myDogs: {
    eyebrow: 'Моите Cane Corso',
    title: 'Добави, довърши или провери статус',
    description: 'Работи по Cane Corso профилите: данни, снимки, родословна информация, преглед и публикация. Пълните данни са за теб и админ.',
    status: 'Публично излиза само одобреното ядро; пълният профил остава личен до админ преглед.',
    primary: { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Създай профил' },
    secondary: [
      { href: '/my-dogs', label: 'Всички профили', meta: 'Преглед' },
      { href: '/profile', label: 'Профил', meta: 'Собственик' },
      { href: '/registry', label: 'Публичен регистър', meta: 'Публикувани' },
      { href: '/knowledge', label: 'Подготовка за преглед', meta: 'Какво е важно' },
    ],
  },
  profile: {
    eyebrow: 'Профил на собственика',
    title: 'Провери данните за собственика',
    description: 'Това е профилът на човека, не на Cane Corso. Пълните данни се виждат от теб и админ; публично се използва само безопасно публично име.',
    status: 'Ти можеш да обновяваш данните си; другите не виждат имейл, телефон или лични контакти.',
    primary: { href: '/profile', label: 'Редактирай профил', meta: 'Собственик' },
    secondary: [
      { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Профили' },
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Общност' },
      { href: '/faq', label: 'Помощ за профила', meta: 'Помощ' },
    ],
  },
  community: {
    eyebrow: 'Cane Corso търси',
    title: 'Какво търсиш днес?',
    description: 'Избери намерение: разплоден партньор, нов дом, изгубен/намерен Cane Corso, място, услуга или помощ.',
    status: 'Моите заявки показват какво чака преглед, корекция или публикация.',
    primary: { href: '/ecosystem', label: 'Моите заявки', meta: 'Статус и редакция' },
    secondary: [
      { href: '/community#cane-corso-intent-listings', label: 'Избери тип заявка', meta: 'Дом, свързване, изгубен/намерен' },
      { href: '/ecosystem', label: 'Създай заявка', meta: 'Лична зона' },
      { href: '/partners', label: 'Намери услуга', meta: 'Партньори' },
      { href: '/faq', label: 'Правила и безопасност', meta: 'Помощ' },
    ],
  },
  partners: {
    eyebrow: 'Партньори и услуги',
    title: 'Търсиш услуга или искаш да кандидатстваш?',
    description: 'Намери одобрени услуги или подай партньорска кандидатура с ясен статус до преглед.',
    status: 'Публична видимост има само след одобрение.',
    primary: { href: '/partners/apply', label: 'Кандидатствай като партньор', meta: 'Заявка' },
    secondary: [
      { href: '/partners', label: 'Виж партньори', meta: 'Каталог' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Статус' },
      { href: '/community', label: 'Места и помощ', meta: 'Общност' },
      { href: '/faq', label: 'Партньорски въпроси', meta: 'Помощ' },
    ],
  },
  partnerApply: {
    eyebrow: 'Партньорска кандидатура',
    title: 'Попълни, провери и изпрати',
    description: 'Фокусът е кандидатурата: категория, локация, контакти, описание и статус до одобрение.',
    status: 'Кандидатурата остава скрита, докато не бъде одобрена.',
    primary: { href: '/partners/apply', label: 'Продължи кандидатурата', meta: 'Партньор' },
    secondary: [
      { href: '/partners', label: 'Виж каталога', meta: 'Одобрени' },
      { href: '/profile', label: 'Профил', meta: 'Данни' },
      { href: '/faq', label: 'Правила', meta: 'Помощ' },
    ],
  },
  knowledge: {
    eyebrow: 'Cane Corso знания',
    title: 'Какво искаш да научиш?',
    description: 'Избери тема според нуждата: история, стандарт, грижа, здраве, развъждане, USG сертификат или Bulgarico наблюдения.',
    status: 'Знания е компасът, когато не знаеш коя е правилната следваща стъпка.',
    primary: { href: '/knowledge', label: 'Отвори знанията', meta: 'Статии' },
    secondary: [
      { href: '/knowledge/usg-identity-and-platform-trust', label: 'Какво е USG?', meta: 'Идентичност' },
      { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG сертификат', meta: 'Граници' },
      { href: '/knowledge/usg-bulgarico-observational-framework', label: 'Bulgarico', meta: 'Наблюдения' },
      { href: '/faq', label: 'Бърз отговор', meta: 'Помощ' },
    ],
  },
  registry: {
    eyebrow: 'Публичен Регистър',
    title: 'Търсиш профил или статус?',
    description: 'Разгледай публикуваните Cane Corso или отвори личната зона, за да видиш дали твоят профил е чернова, в преглед или публикуван.',
    status: 'Регистърът показва само одобрени и публикувани профили.',
    primary: { href: '/my-dogs', label: 'Виж статус', meta: 'Моите Cane Corso' },
    secondary: [
      { href: '/registry', label: 'Публичен регистър', meta: 'Одобрени профили' },
      { href: '/verify', label: 'Провери сертификат', meta: 'Проверка' },
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/knowledge', label: 'Как се подготвя профил?', meta: 'Знания' },
    ],
  },
  gallery: {
    eyebrow: 'USG Галерия',
    title: 'Искаш твоят Cane Corso да изглежда силно публично?',
    description: 'Провери снимките, статуса и качеството на профила. Галерията е витрина за подбрани профили, не списък с всички.',
    status: 'Първо профил и публикация, после евентуална витрина.',
    primary: { href: '/my-dogs', label: 'Провери моите снимки', meta: 'Моите Cane Corso' },
    secondary: [
      { href: '/gallery', label: 'Виж галерията', meta: 'Витрина' },
      { href: '/registry', label: 'Регистър', meta: 'Публични профили' },
      { href: '/verify', label: 'Проверка', meta: 'Сертификат' },
      { href: '/knowledge', label: 'Снимки и представяне', meta: 'Насоки' },
    ],
  },
  faq: {
    eyebrow: 'Помощ според намерение',
    title: 'За какво ти трябва отговор?',
    description: 'Намери кратък път към профил, Регистър, сертификат, общност, партньори или знание за породата.',
    status: 'FAQ помага, когато знаеш какво искаш, но не знаеш откъде да започнеш.',
    primary: { href: '/faq', label: 'Отвори Помощ', meta: 'Отговори' },
    secondary: [
      { href: '/my-dogs', label: 'Моите Cane Corso', meta: 'Статус' },
      { href: '/knowledge', label: 'Информация за породата', meta: 'Знания' },
      { href: '/community', label: 'Общност', meta: 'Заявки' },
      { href: '/partners', label: 'Партньори', meta: 'Услуги' },
    ],
  },
  admin: {
    eyebrow: 'Админ задачи',
    title: 'Какво чака решение?',
    description: 'Отвори опашката за преглед, контрол на Регистъра, партньори или екосистемна модерация.',
    status: 'Първо чакащи задачи, после детайл и решение.',
    primary: { href: '/review', label: 'Към Преглед', meta: 'Чакащи профили' },
    secondary: [
      { href: '/admin/registry', label: 'контрол на Регистъра', meta: 'Публикувани' },
      { href: '/admin/ecosystem', label: 'Екосистема', meta: 'Модерация' },
      { href: '/admin/partners', label: 'Партньори', meta: 'Кандидатури' },
      { href: '/admin/members', label: 'Потребители', meta: 'Данни' },
    ],
  },
  review: {
    eyebrow: 'Преглед и решение',
    title: 'Кои профили чакат USG преценка?',
    description: 'Одобри, върни за корекции, публикувай или вземи отделно решение за сертификат.',
    status: 'Регистър и сертификат остават отделни решения.',
    primary: { href: '/review', label: 'Прегледай чакащите', meta: 'Опашка' },
    secondary: [
      { href: '/admin/registry', label: 'контрол на Регистъра', meta: 'След публикация' },
      { href: '/admin/members', label: 'Потребители', meta: 'Проверка' },
      { href: '/admin/ecosystem', label: 'Екосистема', meta: 'Модерация' },
    ],
  },
  adminEcosystem: {
    eyebrow: 'Екосистемна модерация',
    title: 'Кои записи могат да станат публични?',
    description: 'Прегледай официални записи, общностни заявки, корекции, архив и чувствителни контакти.',
    status: 'Публичността се дава след преглед, не автоматично.',
    primary: { href: '/admin/ecosystem', label: 'Модерирай записите', meta: 'Екосистема' },
    secondary: [
      { href: '/review', label: 'Cane Corso преглед', meta: 'Регистър' },
      { href: '/admin/partners', label: 'Партньори', meta: 'Услуги' },
      { href: '/community', label: 'Публична общност', meta: 'Преглед' },
    ],
  },
};

const en: SurfaceMap = {
  platform: {
    eyebrow: 'Your Cane Corso center',
    title: 'What do you want to do now?',
    description: 'Choose an action: add a Cane Corso, continue a profile, check status, or open the knowledge you need.',
    status: 'You do not browse sections blindly — you choose a path by intent.',
    primary: { href: '/my-dogs', label: 'My Cane Corso', meta: 'Profiles and status' },
    secondary: [
      { href: '/my-dogs/new', label: 'Add Cane Corso', meta: 'New profile' },
      { href: '/profile', label: 'Profile', meta: 'Owner' },
      { href: '/knowledge', label: 'Breed information', meta: 'History, standard, care' },
      { href: '/faq', label: 'Help', meta: 'Short answers' },
    ],
  },
  member: {
    eyebrow: 'Private work center',
    title: 'Continue from where you stopped',
    description: 'Your personal actions live here: Cane Corso profiles, owner profile, requests, and the next step.',
    status: 'First action and status. Explanations live in Knowledge and FAQ.',
    primary: { href: '/my-dogs', label: 'My Cane Corso', meta: 'Main path' },
    secondary: [
      { href: '/my-dogs/new', label: 'Add Cane Corso', meta: 'First or new profile' },
      { href: '/profile', label: 'Profile', meta: 'Owner data' },
      { href: '/ecosystem', label: 'My requests', meta: 'Community' },
      { href: '/knowledge', label: 'What should I read?', meta: 'Guidance' },
    ],
  },
  myDogs: {
    eyebrow: 'My Cane Corso',
    title: 'Add, complete, or check status',
    description: 'Work on Cane Corso profiles: data, images, pedigree information, review, and publication. Full data stays owner/admin-only.',
    status: 'Only the approved public core goes public; the full profile stays private until admin review.',
    primary: { href: '/my-dogs/new', label: 'Add Cane Corso', meta: 'Create profile' },
    secondary: [
      { href: '/my-dogs', label: 'All profiles', meta: 'Overview' },
      { href: '/profile', label: 'Profile', meta: 'Owner' },
      { href: '/registry', label: 'Public Registry', meta: 'Published' },
      { href: '/knowledge', label: 'Prepare for review', meta: 'What matters' },
    ],
  },
  profile: {
    eyebrow: 'Owner profile',
    title: 'Check the owner data',
    description: 'This is the human owner profile, not the Cane Corso profile. Full data is visible to you and admin; public Registry uses only a safe public owner name.',
    status: 'You can update your data; other people do not see email, phone, or private contact details.',
    primary: { href: '/profile', label: 'Edit profile', meta: 'Owner' },
    secondary: [
      { href: '/my-dogs', label: 'My Cane Corso', meta: 'Profiles' },
      { href: '/my-dogs/new', label: 'Add Cane Corso', meta: 'New profile' },
      { href: '/ecosystem', label: 'My requests', meta: 'Community' },
      { href: '/faq', label: 'Profile help', meta: 'Помощ' },
    ],
  },
  community: {
    eyebrow: 'Cane Corso needs',
    title: 'What are you looking for today?',
    description: 'Choose intent: breeding match, new home, lost/found Cane Corso, place, service, or help.',
    status: 'My requests shows what is waiting for review, correction, or publication.',
    primary: { href: '/ecosystem', label: 'My requests', meta: 'Status and edits' },
    secondary: [
      { href: '/community#cane-corso-intent-listings', label: 'Choose request type', meta: 'Home, match, lost/found' },
      { href: '/ecosystem', label: 'Create request', meta: 'Private area' },
      { href: '/partners', label: 'Find a service', meta: 'Partners' },
      { href: '/faq', label: 'Rules and safety', meta: 'Помощ' },
    ],
  },
  partners: {
    eyebrow: 'Partners and services',
    title: 'Looking for a service or applying as a partner?',
    description: 'Find approved services or submit a partner application with a clear review status.',
    status: 'Public visibility exists only after approval.',
    primary: { href: '/partners/apply', label: 'Apply as partner', meta: 'Application' },
    secondary: [
      { href: '/partners', label: 'View partners', meta: 'Directory' },
      { href: '/ecosystem', label: 'My requests', meta: 'Status' },
      { href: '/community', label: 'Places and help', meta: 'Community' },
      { href: '/faq', label: 'Partner questions', meta: 'Помощ' },
    ],
  },
  partnerApply: {
    eyebrow: 'Partner application',
    title: 'Fill in, check, and submit',
    description: 'The focus is the application: category, location, contacts, description, and status before approval.',
    status: 'The application stays hidden until approved.',
    primary: { href: '/partners/apply', label: 'Continue application', meta: 'Partner' },
    secondary: [
      { href: '/partners', label: 'View directory', meta: 'Approved' },
      { href: '/profile', label: 'Profile', meta: 'Data' },
      { href: '/faq', label: 'Rules', meta: 'Помощ' },
    ],
  },
  knowledge: {
    eyebrow: 'Cane Corso knowledge',
    title: 'What do you want to learn?',
    description: 'Choose a topic by need: history, standard, care, health, breeding, USG certificate, or Bulgarico observations.',
    status: 'Knowledge is the compass when you do not know the right next step.',
    primary: { href: '/knowledge', label: 'Open Knowledge', meta: 'Articles' },
    secondary: [
      { href: '/knowledge/usg-identity-and-platform-trust', label: 'What is USG?', meta: 'Identity' },
      { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG certificate', meta: 'Boundaries' },
      { href: '/knowledge/usg-bulgarico-observational-framework', label: 'Bulgarico', meta: 'Observations' },
      { href: '/faq', label: 'Quick answer', meta: 'FAQ' },
    ],
  },
  registry: {
    eyebrow: 'Public Registry',
    title: 'Looking for a profile or status?',
    description: 'Browse published Cane Corso profiles or open your private area to see whether your profile is draft, in review, or published.',
    status: 'The Registry shows only approved and published profiles.',
    primary: { href: '/my-dogs', label: 'Check status', meta: 'My Cane Corso' },
    secondary: [
      { href: '/registry', label: 'Public Registry', meta: 'Approved profiles' },
      { href: '/verify', label: 'Verify certificate', meta: 'Verify' },
      { href: '/my-dogs/new', label: 'Add Cane Corso', meta: 'New profile' },
      { href: '/knowledge', label: 'How to prepare a profile?', meta: 'Knowledge' },
    ],
  },
  gallery: {
    eyebrow: 'USG Gallery',
    title: 'Want your Cane Corso to look strong publicly?',
    description: 'Check images, status, and profile quality. The Gallery is a curated showcase, not the full list of all profiles.',
    status: 'First profile and publication, then possible showcase selection.',
    primary: { href: '/my-dogs', label: 'Check my images', meta: 'My Cane Corso' },
    secondary: [
      { href: '/gallery', label: 'View Gallery', meta: 'Showcase' },
      { href: '/registry', label: 'Регистър', meta: 'Public profiles' },
      { href: '/verify', label: 'Проверка', meta: 'Certificate' },
      { href: '/knowledge', label: 'Photos and presentation', meta: 'Guidance' },
    ],
  },
  faq: {
    eyebrow: 'Help by intent',
    title: 'What do you need an answer for?',
    description: 'Find a short path to profile, Registry, certificate, Community, Partners, or breed education.',
    status: 'FAQ helps when you know what you want but not where to start.',
    primary: { href: '/faq', label: 'Open FAQ', meta: 'Answers' },
    secondary: [
      { href: '/my-dogs', label: 'My Cane Corso', meta: 'Status' },
      { href: '/knowledge', label: 'Breed information', meta: 'Знания' },
      { href: '/community', label: 'Community', meta: 'Requests' },
      { href: '/partners', label: 'Partners', meta: 'Services' },
    ],
  },
  admin: {
    eyebrow: 'Admin tasks',
    title: 'What is waiting for a decision?',
    description: 'Open the review queue, Registry control, Partners, or ecosystem moderation.',
    status: 'Pending tasks first, then detail and decision.',
    primary: { href: '/review', label: 'Go to Review', meta: 'Pending profiles' },
    secondary: [
      { href: '/admin/registry', label: 'Registry control', meta: 'Published' },
      { href: '/admin/ecosystem', label: 'Ecosystem', meta: 'Moderation' },
      { href: '/admin/partners', label: 'Partners', meta: 'Applications' },
      { href: '/admin/members', label: 'Members', meta: 'Data' },
    ],
  },
  review: {
    eyebrow: 'Review and decision',
    title: 'Which profiles need USG judgment?',
    description: 'Approve, request changes, publish, or make a separate certificate decision.',
    status: 'Registry and certificate remain separate decisions.',
    primary: { href: '/review', label: 'Review pending profiles', meta: 'Queue' },
    secondary: [
      { href: '/admin/registry', label: 'Registry control', meta: 'After publication' },
      { href: '/admin/members', label: 'Members', meta: 'Check' },
      { href: '/admin/ecosystem', label: 'Ecosystem', meta: 'Moderation' },
    ],
  },
  adminEcosystem: {
    eyebrow: 'Ecosystem moderation',
    title: 'Which records can become public?',
    description: 'Review official listings, community requests, corrections, archived items, and sensitive contacts.',
    status: 'Public visibility is granted after review, not automatically.',
    primary: { href: '/admin/ecosystem', label: 'Moderate records', meta: 'Ecosystem' },
    secondary: [
      { href: '/review', label: 'Cane Corso review', meta: 'Registry' },
      { href: '/admin/partners', label: 'Partners', meta: 'Services' },
      { href: '/community', label: 'Public Community', meta: 'Preview' },
    ],
  },
};

const it: SurfaceMap = {
  platform: {
    eyebrow: 'Il tuo centro Cane Corso',
    title: 'Cosa vuoi fare adesso?',
    description: 'Scegli un’azione: aggiungi un Cane Corso, continua un profilo, controlla lo stato o apri le informazioni che ti servono.',
    status: 'Non navighi tra sezioni a caso: scegli il percorso in base all’intenzione.',
    primary: { href: '/my-dogs', label: 'I miei Cane Corso', meta: 'Profili e stato' },
    secondary: [
      { href: '/my-dogs/new', label: 'Aggiungi Cane Corso', meta: 'Nuovo profilo' },
      { href: '/profile', label: 'Profilo', meta: 'Proprietario' },
      { href: '/knowledge', label: 'Informazioni sulla razza', meta: 'Storia, standard, cura' },
      { href: '/faq', label: 'Aiuto', meta: 'Risposte brevi' },
    ],
  },
  member: {
    eyebrow: 'Centro di lavoro privato',
    title: 'Continua da dove eri arrivato',
    description: 'Qui vivono le azioni personali: profili Cane Corso, profilo proprietario, richieste e prossimo passo.',
    status: 'Prima azione e stato. Le spiegazioni sono in Conoscenze e FAQ.',
    primary: { href: '/my-dogs', label: 'I miei Cane Corso', meta: 'Percorso principale' },
    secondary: [
      { href: '/my-dogs/new', label: 'Aggiungi Cane Corso', meta: 'Primo o nuovo profilo' },
      { href: '/profile', label: 'Profilo', meta: 'Dati proprietario' },
      { href: '/ecosystem', label: 'Le mie richieste', meta: 'Comunità' },
      { href: '/knowledge', label: 'Cosa devo leggere?', meta: 'Guida' },
    ],
  },
  myDogs: {
    eyebrow: 'I miei Cane Corso',
    title: 'Aggiungi, completa o controlla lo stato',
    description: 'Lavora sui profili Cane Corso: dati, immagini, genealogia, revisione e pubblicazione. I dati completi restano proprietario/admin.',
    status: 'Solo il nucleo pubblico approvato diventa pubblico; il profilo completo resta privato fino alla revisione admin.',
    primary: { href: '/my-dogs/new', label: 'Aggiungi Cane Corso', meta: 'Crea profilo' },
    secondary: [
      { href: '/my-dogs', label: 'Tutti i profili', meta: 'Panoramica' },
      { href: '/profile', label: 'Profilo', meta: 'Proprietario' },
      { href: '/registry', label: 'Registro pubblico', meta: 'Pubblicati' },
      { href: '/knowledge', label: 'Preparazione alla revisione', meta: 'Cosa conta' },
    ],
  },
  profile: {
    eyebrow: 'Profilo proprietario',
    title: 'Controlla i dati del proprietario',
    description: 'Questo è il profilo della persona proprietaria, non il profilo Cane Corso. I dati completi sono visibili a te e all’admin; il Registry pubblico usa solo un nome pubblico sicuro.',
    status: 'Puoi aggiornare i tuoi dati; le altre persone non vedono email, telefono o contatti privati.',
    primary: { href: '/profile', label: 'Modifica profilo', meta: 'Proprietario' },
    secondary: [
      { href: '/my-dogs', label: 'I miei Cane Corso', meta: 'Profili' },
      { href: '/my-dogs/new', label: 'Aggiungi Cane Corso', meta: 'Nuovo profilo' },
      { href: '/ecosystem', label: 'Le mie richieste', meta: 'Comunità' },
      { href: '/faq', label: 'Aiuto per il profilo', meta: 'Помощ' },
    ],
  },
  community: {
    eyebrow: 'Cane Corso cerca',
    title: 'Cosa stai cercando oggi?',
    description: 'Scegli l’intenzione: abbinamento riproduttivo, nuova casa, Cane Corso smarrito/trovato, luogo, servizio o aiuto.',
    status: 'Le mie richieste mostra cosa attende revisione, correzione o pubblicazione.',
    primary: { href: '/ecosystem', label: 'Le mie richieste', meta: 'Stato e modifica' },
    secondary: [
      { href: '/community#cane-corso-intent-listings', label: 'Scegli tipo richiesta', meta: 'Casa, match, smarrito/trovato' },
      { href: '/ecosystem', label: 'Crea richiesta', meta: 'Area privata' },
      { href: '/partners', label: 'Trova un servizio', meta: 'Partner' },
      { href: '/faq', label: 'Regole e sicurezza', meta: 'Помощ' },
    ],
  },
  partners: {
    eyebrow: 'Partner e servizi',
    title: 'Cerchi un servizio o vuoi candidarti come partner?',
    description: 'Trova servizi approvati o invia una candidatura partner con stato di revisione chiaro.',
    status: 'La visibilità pubblica esiste solo dopo approvazione.',
    primary: { href: '/partners/apply', label: 'Candidati come partner', meta: 'Candidatura' },
    secondary: [
      { href: '/partners', label: 'Vedi partner', meta: 'Catalogo' },
      { href: '/ecosystem', label: 'Le mie richieste', meta: 'Stato' },
      { href: '/community', label: 'Luoghi e aiuto', meta: 'Comunità' },
      { href: '/faq', label: 'Domande sui partner', meta: 'Помощ' },
    ],
  },
  partnerApply: {
    eyebrow: 'Candidatura partner',
    title: 'Compila, controlla e invia',
    description: 'Il focus è la candidatura: categoria, località, contatti, descrizione e stato prima dell’approvazione.',
    status: 'La candidatura resta nascosta finché non viene approvata.',
    primary: { href: '/partners/apply', label: 'Continua candidatura', meta: 'Partner' },
    secondary: [
      { href: '/partners', label: 'Vedi catalogo', meta: 'Approvati' },
      { href: '/profile', label: 'Profilo', meta: 'Dati' },
      { href: '/faq', label: 'Regole', meta: 'Помощ' },
    ],
  },
  knowledge: {
    eyebrow: 'Conoscenze Cane Corso',
    title: 'Cosa vuoi imparare?',
    description: 'Scegli il tema secondo il bisogno: storia, standard, cura, salute, allevamento, certificato USG o osservazioni Bulgarico.',
    status: 'Conoscenze è la bussola quando non sai quale sia il prossimo passo giusto.',
    primary: { href: '/knowledge', label: 'Apri Conoscenze', meta: 'Articoli' },
    secondary: [
      { href: '/knowledge/usg-identity-and-platform-trust', label: 'Cos’è USG?', meta: 'Identità' },
      { href: '/knowledge/usg-certificate-evidence-levels', label: 'Certificato USG', meta: 'Confini' },
      { href: '/knowledge/usg-bulgarico-observational-framework', label: 'Bulgarico', meta: 'Osservazioni' },
      { href: '/faq', label: 'Risposta rapida', meta: 'Помощ' },
    ],
  },
  registry: {
    eyebrow: 'Registro pubblico',
    title: 'Cerchi un profilo o uno stato?',
    description: 'Esplora i profili Cane Corso pubblicati o apri l’area privata per vedere se il tuo profilo è bozza, in revisione o pubblicato.',
    status: 'Il Registro mostra solo profili approvati e pubblicati.',
    primary: { href: '/my-dogs', label: 'Controlla stato', meta: 'I miei Cane Corso' },
    secondary: [
      { href: '/registry', label: 'Registro pubblico', meta: 'Profili approvati' },
      { href: '/verify', label: 'Verifica certificato', meta: 'Verifica' },
      { href: '/my-dogs/new', label: 'Aggiungi Cane Corso', meta: 'Nuovo profilo' },
      { href: '/knowledge', label: 'Come preparare un profilo?', meta: 'Conoscenze' },
    ],
  },
  gallery: {
    eyebrow: 'Galleria USG',
    title: 'Vuoi che il tuo Cane Corso abbia una presenza pubblica forte?',
    description: 'Controlla immagini, stato e qualità del profilo. La Galleria è una vetrina curata, non la lista completa dei profili.',
    status: 'Prima profilo e pubblicazione, poi possibile selezione in vetrina.',
    primary: { href: '/my-dogs', label: 'Controlla le mie immagini', meta: 'I miei Cane Corso' },
    secondary: [
      { href: '/gallery', label: 'Vedi Galleria', meta: 'Vetrina' },
      { href: '/registry', label: 'Registro', meta: 'Profili pubblici' },
      { href: '/verify', label: 'Verifica', meta: 'Certificato' },
      { href: '/knowledge', label: 'Foto e presentazione', meta: 'Guida' },
    ],
  },
  faq: {
    eyebrow: 'Aiuto per intenzione',
    title: 'Per cosa ti serve una risposta?',
    description: 'Trova un percorso breve verso profilo, Registro, certificato, Comunità, Partner o informazioni sulla razza.',
    status: 'Le FAQ aiutano quando sai cosa vuoi, ma non sai da dove iniziare.',
    primary: { href: '/faq', label: 'Apri FAQ', meta: 'Risposte' },
    secondary: [
      { href: '/my-dogs', label: 'I miei Cane Corso', meta: 'Stato' },
      { href: '/knowledge', label: 'Informazioni sulla razza', meta: 'Conoscenze' },
      { href: '/community', label: 'Comunità', meta: 'Richieste' },
      { href: '/partners', label: 'Partner', meta: 'Servizi' },
    ],
  },
  admin: {
    eyebrow: 'Compiti admin',
    title: 'Cosa attende una decisione?',
    description: 'Apri la coda di revisione, il controllo del Registro, i Partner o la moderazione dell’ecosistema.',
    status: 'Prima i compiti in attesa, poi dettaglio e decisione.',
    primary: { href: '/review', label: 'Vai a Revisione', meta: 'Profili in attesa' },
    secondary: [
      { href: '/admin/registry', label: 'Controllo Registro', meta: 'Pubblicati' },
      { href: '/admin/ecosystem', label: 'Ecosistema', meta: 'Moderazione' },
      { href: '/admin/partners', label: 'Partner', meta: 'Candidature' },
      { href: '/admin/members', label: 'Utenti', meta: 'Dati' },
    ],
  },
  review: {
    eyebrow: 'Revisione e decisione',
    title: 'Quali profili attendono valutazione USG?',
    description: 'Approva, richiedi correzioni, pubblica o prendi una decisione separata sul certificato.',
    status: 'Registro e certificato restano decisioni separate.',
    primary: { href: '/review', label: 'Revisiona i profili in attesa', meta: 'Coda' },
    secondary: [
      { href: '/admin/registry', label: 'Controllo Registro', meta: 'Dopo pubblicazione' },
      { href: '/admin/members', label: 'Utenti', meta: 'Controllo' },
      { href: '/admin/ecosystem', label: 'Ecosistema', meta: 'Moderazione' },
    ],
  },
  adminEcosystem: {
    eyebrow: 'Moderazione ecosistema',
    title: 'Quali record possono diventare pubblici?',
    description: 'Revisiona schede ufficiali, richieste della comunità, correzioni, archivio e contatti sensibili.',
    status: 'La visibilità pubblica viene concessa dopo revisione, non automaticamente.',
    primary: { href: '/admin/ecosystem', label: 'Modera i record', meta: 'Ecosistema' },
    secondary: [
      { href: '/review', label: 'Revisione Cane Corso', meta: 'Registro' },
      { href: '/admin/partners', label: 'Partner', meta: 'Servizi' },
      { href: '/community', label: 'Comunità pubblica', meta: 'Anteprima' },
    ],
  },
};

const copyByLocale: Record<Locale, SurfaceMap> = { bg, en, it };

const guestCopyByLocale: Record<Locale, SurfaceCopy> = {
  bg: {
    eyebrow: 'Публичен вход',
    title: 'Разгледай спокойно, после избери действие',
    description: 'Като гост можеш да разглеждаш публичните слоеве. За личен профил, заявка или партньорство — влез или се регистрирай.',
    status: 'Гостите виждат ориентация; логнатите потребители виждат действия и статус.',
    primary: { href: '/access?intent=member', label: 'Вход / регистрация', meta: 'Лична зона' },
    secondary: [
      { href: '/registry', label: 'Регистър', meta: 'Публично' },
      { href: '/knowledge', label: 'Знания', meta: 'Статии' },
      { href: '/community', label: 'Общност', meta: 'Намерения' },
      { href: '/faq', label: 'Помощ', meta: 'Отговори' },
    ],
  },
  en: {
    eyebrow: 'Public entry',
    title: 'Explore first, then choose an action',
    description: 'Guests can browse public layers. Sign in or register for a private profile, request, or partner application.',
    status: 'Guests see orientation; signed-in users see actions and status.',
    primary: { href: '/access?intent=member', label: 'Sign in / register', meta: 'Private area' },
    secondary: [
      { href: '/registry', label: 'Регистър', meta: 'Public' },
      { href: '/knowledge', label: 'Knowledge', meta: 'Education' },
      { href: '/community', label: 'Community', meta: 'Intent' },
      { href: '/faq', label: 'FAQ', meta: 'Answers' },
    ],
  },
  it: {
    eyebrow: 'Ingresso pubblico',
    title: 'Esplora prima, poi scegli un’azione',
    description: 'Gli ospiti possono navigare i livelli pubblici. Accedi o registrati per profilo privato, richiesta o candidatura partner.',
    status: 'Gli ospiti vedono orientamento; gli utenti loggati vedono azioni e stato.',
    primary: { href: '/access?intent=member', label: 'Accedi / registrati', meta: 'Area privata' },
    secondary: [
      { href: '/registry', label: 'Registro', meta: 'Pubblico' },
      { href: '/knowledge', label: 'Conoscenze', meta: 'Educazione' },
      { href: '/community', label: 'Comunità', meta: 'Intento' },
      { href: '/faq', label: 'FAQ', meta: 'Risposte' },
    ],
  },
};

interface RoleAwareActionPanelProps {
  locale: Locale;
  surface: RoleAwareActionSurface;
  role?: string | null;
  className?: string;
}

function getRoleLabel(locale: Locale, role?: string | null) {
  if (!role) return locale === 'bg' ? 'Гост' : locale === 'it' ? 'Ospite' : 'Guest';
  if (role === 'admin') return locale === 'bg' ? 'Админ' : 'Admin';
  if (role === 'partner') return 'Partner';
  return locale === 'bg' ? 'Член' : locale === 'it' ? 'Membro' : 'Member';
}

function getPriorityLabels(locale: Locale) {
  if (locale === 'bg') {
    return {
      active: 'Активна секция',
      primary: 'Основно действие',
      supporting: 'Още действия',
      info: 'Информация и помощ',
    } as const;
  }

  if (locale === 'it') {
    return {
      active: 'Sezione attiva',
      primary: 'Azione principale',
      supporting: 'Altre azioni',
      info: 'Informazioni e aiuto',
    } as const;
  }

  return {
    active: 'Active section',
    primary: 'Primary action',
    supporting: 'More actions',
    info: 'Information and help',
  } as const;
}

function getInfoAction(surface: RoleAwareActionSurface, locale: Locale): PanelAction {
  const label = locale === 'bg' ? 'Къде да разбера повече' : locale === 'it' ? 'Dove capire di più' : 'Where to learn more';
  const faqMeta = locale === 'bg' ? 'FAQ и ясни правила' : locale === 'it' ? 'FAQ e regole chiare' : 'FAQ and clear rules';
  const knowledgeMeta = locale === 'bg' ? 'Знания за Cane Corso' : locale === 'it' ? 'Conoscenze Cane Corso' : 'Cane Corso knowledge';

  if (surface === 'knowledge') {
    return { href: '/faq', label, meta: faqMeta };
  }

  if (surface === 'member' || surface === 'myDogs' || surface === 'profile') {
    return { href: '/knowledge', label, meta: knowledgeMeta };
  }

  if (surface === 'review' || surface === 'admin' || surface === 'adminEcosystem') {
    return { href: '/faq', label, meta: locale === 'bg' ? 'Граници и доверие' : locale === 'it' ? 'Confini e fiducia' : 'Boundaries and trust' };
  }

  return { href: '/faq', label, meta: faqMeta };
}

export function RoleAwareActionPanel({ locale, surface, role, className }: RoleAwareActionPanelProps) {
  const isGuest = !role;
  const copy = isGuest ? guestCopyByLocale[locale] ?? guestCopyByLocale.en : (copyByLocale[locale] ?? copyByLocale.en)[surface];
  const priorityLabels = getPriorityLabels(locale);
  const infoAction = getInfoAction(surface, locale);

  return (
    <section className={`role-aware-action-panel${isGuest ? ' role-aware-action-panel--guest' : ''}${className ? ` ${className}` : ''}`} aria-label={copy.title}>
      <div className="role-aware-action-panel__intro">
        <div className="role-aware-action-panel__location" aria-label={priorityLabels.active}>
          <span>{priorityLabels.active}</span>
          <strong>{copy.eyebrow}</strong>
        </div>
        <span className="role-aware-action-panel__eyebrow">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <div className="role-aware-action-panel__status">
        <span>{getRoleLabel(locale, role)}</span>
        <strong>{copy.status}</strong>
      </div>
      <div className="role-aware-action-panel__actions">
        <Link className="role-aware-action-panel__primary" href={copy.primary.href}>
          <small className="role-aware-action-panel__action-label">{priorityLabels.primary}</small>
          <span>{copy.primary.label}</span>
          {copy.primary.meta ? <small>{copy.primary.meta}</small> : null}
        </Link>
        <span className="role-aware-action-panel__secondary-label">{priorityLabels.supporting}</span>
        <div className="role-aware-action-panel__secondary-grid">
          {copy.secondary.map((action) => (
            <Link href={action.href} className="role-aware-action-panel__secondary" key={`${surface}-${action.href}-${action.label}`}>
              <span>{action.label}</span>
              {action.meta ? <small>{action.meta}</small> : null}
            </Link>
          ))}
        </div>
        <Link href={infoAction.href} className="role-aware-action-panel__info-link">
          <span>{priorityLabels.info}</span>
          <strong>{infoAction.label}</strong>
          {infoAction.meta ? <small>{infoAction.meta}</small> : null}
        </Link>
      </div>
    </section>
  );
}
