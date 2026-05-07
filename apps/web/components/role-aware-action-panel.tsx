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
    eyebrow: 'Личен вход след логин',
    title: 'Добре дошъл обратно — продължи с реална задача',
    description: 'Тук вече не трябва да избираш вход. Започни от личната зона, провери статус или добави Cane Corso профил.',
    status: 'След логин фокусът е действие, статус и следваща стъпка.',
    primary: { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Лична зона' },
    secondary: [
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/profile', label: 'Профил', meta: 'Собственик' },
      { href: '/registry', label: 'Registry', meta: 'Публична проверка' },
      { href: '/knowledge', label: 'Knowledge', meta: 'Подготовка' },
    ],
  },
  member: {
    eyebrow: 'Твоят Cane Corso център',
    title: 'Какво изисква внимание сега?',
    description: 'Виж следващата задача преди обясненията: профили, липсващи данни, преглед, публикация или екосистемен запис.',
    status: 'Първо действие, после информация.',
    primary: { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Основен работен път' },
    secondary: [
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Първи или нов профил' },
      { href: '/profile', label: 'Профил', meta: 'Идентичност' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Общност' },
      { href: '/registry', label: 'Виж статус', meta: 'Публичен слой' },
    ],
  },
  myDogs: {
    eyebrow: 'Моите Cane Corso',
    title: 'Профили, статус и следващ ход',
    description: 'Тук работиш по реалните профили: снимки, данни, родословна информация, изпращане за преглед и публичен статус.',
    status: 'Няма профил? Започни първия. Има чернова? Довърши я.',
    primary: { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Създай профил' },
    secondary: [
      { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Всички профили' },
      { href: '/profile', label: 'Профил', meta: 'Собственик' },
      { href: '/registry', label: 'Registry', meta: 'Публикувани' },
      { href: '/knowledge', label: 'Подготовка', meta: 'Преди преглед' },
    ],
  },
  profile: {
    eyebrow: 'Профил на собственика',
    title: 'Завърши доверието около теб като собственик',
    description: 'Профилът помага при преглед, връзка с USG и яснота кой стои зад Cane Corso профилите.',
    status: 'Провери снимка, име, контакт и лична информация.',
    primary: { href: '/profile', label: 'Профил', meta: 'Редактирай' },
    secondary: [
      { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Профили' },
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Екосистема' },
      { href: '/knowledge', label: 'Knowledge', meta: 'Насоки' },
    ],
  },
  community: {
    eyebrow: 'Общност според намерение',
    title: 'Какво търсиш или какво искаш да подадеш?',
    description: 'След логин общността води към реално действие: изгубен/намерен Cane Corso, нов дом, разплоден match, място, услуга или помощ.',
    status: 'Публичното става видимо след преглед; личните заявки остават под контрол.',
    primary: { href: '/ecosystem', label: 'Създай заявка', meta: 'Моите общностни записи' },
    secondary: [
      { href: '/community#cane-corso-intent-listings', label: 'Какво търся?', meta: 'Тип заявка' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Статус' },
      { href: '/partners', label: 'Партньори', meta: 'Услуги' },
      { href: '/faq', label: 'Правила и безопасност', meta: 'FAQ' },
    ],
  },
  partners: {
    eyebrow: 'Партньори и услуги',
    title: 'Намери услуга или управлявай кандидатура',
    description: 'За посетителите това е каталог. За логнат потребител това е път към кандидатура, статус и доверени услуги.',
    status: 'Партньорската видимост не става публична автоматично.',
    primary: { href: '/partners/apply', label: 'Кандидатствай като партньор', meta: 'Заявка' },
    secondary: [
      { href: '/partners', label: 'Виж партньори', meta: 'Каталог' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Статус' },
      { href: '/community', label: 'Общност', meta: 'Места' },
      { href: '/faq', label: 'Партньорски FAQ', meta: 'Правила' },
    ],
  },
  partnerApply: {
    eyebrow: 'Партньорска кандидатура',
    title: 'Попълни, провери и изпрати за преглед',
    description: 'Фокусът е реалната кандидатура: данни, категория, локация, контакти и статус до одобрение.',
    status: 'Кандидатурата остава скрита, докато не бъде одобрена.',
    primary: { href: '/partners/apply', label: 'Продължи кандидатурата', meta: 'Партньор' },
    secondary: [
      { href: '/partners', label: 'Публичен каталог', meta: 'Одобрени' },
      { href: '/profile', label: 'Профил', meta: 'Данни' },
      { href: '/faq', label: 'FAQ', meta: 'Правила' },
    ],
  },
  knowledge: {
    eyebrow: 'Знание според действие',
    title: 'Прочети това, което помага на следващата ти стъпка',
    description: 'Knowledge не е просто библиотека. Използвай го преди профил, преглед, разплоден match или общностна заявка.',
    status: 'Препоръчано: история, стандарт, снимки, USG Certificate и безопасна общност.',
    primary: { href: '/knowledge', label: 'Knowledge', meta: 'Статии' },
    secondary: [
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'След прочит' },
      { href: '/faq', label: 'FAQ', meta: 'Бързи отговори' },
      { href: '/platform', label: 'USG идея', meta: 'Идентичност' },
      { href: '/community', label: 'Общност', meta: 'Намерения' },
    ],
  },
  registry: {
    eyebrow: 'Registry действие',
    title: 'Провери публичното доверие и статуса на твоите профили',
    description: 'Ако си логнат, най-смисленото действие е да видиш дали твоят Cane Corso е подготвен, изпратен, публикуван или има нужда от корекции.',
    status: 'Публикуване има само след преглед и решение.',
    primary: { href: '/my-dogs', label: 'Виж статус', meta: 'Моите Cane Corso' },
    secondary: [
      { href: '/registry', label: 'Публичен Registry', meta: 'Профили' },
      { href: '/verify', label: 'Провери сертификат', meta: 'Verify' },
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/knowledge', label: 'Как се подготвя профил?', meta: 'Knowledge' },
    ],
  },
  gallery: {
    eyebrow: 'Галерия действие',
    title: 'Подготви Cane Corso за силно публично представяне',
    description: 'Галерията е витрина, не списък с всички профили. Провери снимки, статус и качество на профила.',
    status: 'Първо профил, после публикация, после евентуална витрина.',
    primary: { href: '/my-dogs', label: 'Провери моите снимки', meta: 'Моите Cane Corso' },
    secondary: [
      { href: '/gallery', label: 'Виж Галерия', meta: 'Витрина' },
      { href: '/registry', label: 'Registry', meta: 'Публични профили' },
      { href: '/verify', label: 'Verify', meta: 'Сертификат' },
      { href: '/knowledge', label: 'Снимки и представяне', meta: 'Насоки' },
    ],
  },
  faq: {
    eyebrow: 'FAQ според ситуацията',
    title: 'Намери отговор за това, което правиш сега',
    description: 'FAQ остава обяснителен, но за логнат потребител трябва да помага на действие: профил, преглед, сертификат, общност, партньорство.',
    status: 'Избери тема според задачата, не според структурата на сайта.',
    primary: { href: '/faq', label: 'FAQ', meta: 'Отговори' },
    secondary: [
      { href: '/my-dogs', label: 'Моите Cane Corso', meta: 'Статус' },
      { href: '/platform', label: 'USG и доверие', meta: 'Идея' },
      { href: '/community', label: 'Общност', meta: 'Безопасност' },
      { href: '/partners', label: 'Партньори', meta: 'Кандидатура' },
    ],
  },
  admin: {
    eyebrow: 'Админ работен ред',
    title: 'Започни от чакащите задачи, не от обясненията',
    description: 'Админ зоната показва какво чака решение: преглед, корекции, публикация, сертификат, партньори и екосистемни записи.',
    status: 'Първо опашка, после детайл, после решение.',
    primary: { href: '/review', label: 'Към Преглед', meta: 'Чакащи заявки' },
    secondary: [
      { href: '/admin/registry', label: 'Registry контрол', meta: 'Публикувани' },
      { href: '/admin/ecosystem', label: 'Екосистема', meta: 'Модерация' },
      { href: '/admin/partners', label: 'Партньори', meta: 'Кандидатури' },
      { href: '/admin/members', label: 'Потребители', meta: 'Данни' },
    ],
  },
  review: {
    eyebrow: 'Преглед и решение',
    title: 'Виж какво чака USG преценка',
    description: 'Това е работна опашка: одобри, върни за корекции, публикувай или вземи отделно решение за сертификат.',
    status: 'Регистър и сертификат остават отделни решения.',
    primary: { href: '/review', label: 'Прегледай чакащите', meta: 'Опашка' },
    secondary: [
      { href: '/admin/registry', label: 'Registry контрол', meta: 'След публикация' },
      { href: '/admin/members', label: 'Потребители', meta: 'Проверка' },
      { href: '/admin/ecosystem', label: 'Екосистема', meta: 'Модерация' },
    ],
  },
  adminEcosystem: {
    eyebrow: 'Екосистемна модерация',
    title: 'Прецени какво може да стане публично',
    description: 'Тук задачата е ясна: официален запис, общностен запис, корекции, архив или скрито вътрешно предложение.',
    status: 'Чувствителните контакти и публичната видимост минават през преглед.',
    primary: { href: '/admin/ecosystem', label: 'Модерирай записите', meta: 'Екосистема' },
    secondary: [
      { href: '/review', label: 'Cane Corso преглед', meta: 'Registry' },
      { href: '/admin/partners', label: 'Партньори', meta: 'Услуги' },
      { href: '/community', label: 'Публична общност', meta: 'Преглед' },
    ],
  },
};

const en: SurfaceMap = Object.fromEntries(
  Object.entries(bg).map(([surface, item]) => [
    surface,
    {
      eyebrow: item.eyebrow === 'Личен вход след логин' ? 'Signed-in entry' : item.eyebrow,
      title: surface === 'platform' ? 'Welcome back — continue with a real task' : item.title,
      description: surface === 'platform' ? 'You do not need to choose an entry path again. Open your workspace, check status, or add a Cane Corso profile.' : item.description,
      status: surface === 'platform' ? 'After sign-in the focus is action, status, and next step.' : item.status,
      primary: { ...item.primary, label: item.primary.label === 'Към моите Cane Corso' ? 'My Cane Corso' : item.primary.label },
      secondary: item.secondary,
    },
  ]),
) as SurfaceMap;

const it: SurfaceMap = Object.fromEntries(
  Object.entries(bg).map(([surface, item]) => [
    surface,
    {
      ...item,
      eyebrow: item.eyebrow === 'Личен вход след логин' ? 'Ingresso dopo login' : item.eyebrow,
      title: surface === 'platform' ? 'Bentornato — continua con un’azione reale' : item.title,
      description: surface === 'platform' ? 'Non devi scegliere di nuovo un percorso. Apri il workspace, controlla lo stato o aggiungi un Cane Corso.' : item.description,
      status: surface === 'platform' ? 'Dopo il login il focus è azione, stato e prossimo passo.' : item.status,
      primary: { ...item.primary, label: item.primary.label === 'Към моите Cane Corso' ? 'I miei Cane Corso' : item.primary.label },
    },
  ]),
) as SurfaceMap;

const copyByLocale: Record<Locale, SurfaceMap> = { bg, en, it };

const guestCopyByLocale: Record<Locale, SurfaceCopy> = {
  bg: {
    eyebrow: 'Публичен вход',
    title: 'Разгледай спокойно, после избери действие',
    description: 'Като гост можеш да разглеждаш публичните слоеве. За личен профил, заявка или партньорство — влез или се регистрирай.',
    status: 'Гостите виждат ориентация; логнатите потребители виждат действия и статус.',
    primary: { href: '/access?intent=member', label: 'Вход / регистрация', meta: 'Лична зона' },
    secondary: [
      { href: '/registry', label: 'Registry', meta: 'Публично' },
      { href: '/knowledge', label: 'Knowledge', meta: 'Знания' },
      { href: '/community', label: 'Общност', meta: 'Намерения' },
      { href: '/faq', label: 'FAQ', meta: 'Отговори' },
    ],
  },
  en: {
    eyebrow: 'Public entry',
    title: 'Explore first, then choose an action',
    description: 'Guests can browse public layers. Sign in or register for a private profile, request, or partner application.',
    status: 'Guests see orientation; signed-in users see actions and status.',
    primary: { href: '/access?intent=member', label: 'Sign in / register', meta: 'Private area' },
    secondary: [
      { href: '/registry', label: 'Registry', meta: 'Public' },
      { href: '/knowledge', label: 'Knowledge', meta: 'Education' },
      { href: '/community', label: 'Community', meta: 'Intent' },
      { href: '/faq', label: 'FAQ', meta: 'Answers' },
    ],
  },
  it: {
    eyebrow: 'Ingresso pubblico',
    title: 'Esplora prima, poi scegli un’azione',
    description: 'Gli ospiti possono navigare i layer pubblici. Accedi o registrati per profilo privato, richiesta o candidatura partner.',
    status: 'Gli ospiti vedono orientamento; gli utenti loggati vedono azioni e stato.',
    primary: { href: '/access?intent=member', label: 'Accedi / registrati', meta: 'Area privata' },
    secondary: [
      { href: '/registry', label: 'Registro', meta: 'Pubblico' },
      { href: '/knowledge', label: 'Knowledge', meta: 'Educazione' },
      { href: '/community', label: 'Community', meta: 'Intento' },
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

export function RoleAwareActionPanel({ locale, surface, role, className }: RoleAwareActionPanelProps) {
  const isGuest = !role;
  const copy = isGuest ? guestCopyByLocale[locale] ?? guestCopyByLocale.en : (copyByLocale[locale] ?? copyByLocale.en)[surface];

  return (
    <section className={`role-aware-action-panel${isGuest ? ' role-aware-action-panel--guest' : ''}${className ? ` ${className}` : ''}`} aria-label={copy.title}>
      <div className="role-aware-action-panel__intro">
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
          <span>{copy.primary.label}</span>
          {copy.primary.meta ? <small>{copy.primary.meta}</small> : null}
        </Link>
        <div className="role-aware-action-panel__secondary-grid">
          {copy.secondary.map((action) => (
            <Link href={action.href} className="role-aware-action-panel__secondary" key={`${surface}-${action.href}-${action.label}`}>
              <span>{action.label}</span>
              {action.meta ? <small>{action.meta}</small> : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
