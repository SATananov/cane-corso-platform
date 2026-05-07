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
    status: 'Първо действие и статус. Обясненията са в Knowledge и FAQ.',
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
    description: 'Работи по реалните профили: данни, снимки, родословна информация, преглед и публикация.',
    status: 'Нямаш профил? Започни първия. Имаш чернова? Довърши я.',
    primary: { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Създай профил' },
    secondary: [
      { href: '/my-dogs', label: 'Всички профили', meta: 'Преглед' },
      { href: '/profile', label: 'Профил', meta: 'Собственик' },
      { href: '/registry', label: 'Публичен Registry', meta: 'Публикувани' },
      { href: '/knowledge', label: 'Подготовка за преглед', meta: 'Какво е важно' },
    ],
  },
  profile: {
    eyebrow: 'Профил на собственика',
    title: 'Провери кой стои зад профилите',
    description: 'Попълни данните, които помагат при доверие, връзка с USG и ясно представяне на собственика.',
    status: 'Снимка, име и контакт са важни преди сериозни заявки.',
    primary: { href: '/profile', label: 'Редактирай профил', meta: 'Собственик' },
    secondary: [
      { href: '/my-dogs', label: 'Към моите Cane Corso', meta: 'Профили' },
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/ecosystem', label: 'Моите заявки', meta: 'Общност' },
      { href: '/faq', label: 'Помощ за профила', meta: 'FAQ' },
    ],
  },
  community: {
    eyebrow: 'Cane Corso търси',
    title: 'Какво търсиш днес?',
    description: 'Избери намерение: разплоден партньор, нов дом, изгубен/намерен Cane Corso, място, услуга или помощ.',
    status: 'Моите заявки показват какво чака преглед, корекция или публикация.',
    primary: { href: '/ecosystem', label: 'Моите заявки', meta: 'Статус и редакция' },
    secondary: [
      { href: '/community#cane-corso-intent-listings', label: 'Избери тип заявка', meta: 'Дом, match, изгубен/намерен' },
      { href: '/ecosystem', label: 'Създай заявка', meta: 'Лична зона' },
      { href: '/partners', label: 'Намери услуга', meta: 'Партньори' },
      { href: '/faq', label: 'Правила и безопасност', meta: 'FAQ' },
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
      { href: '/faq', label: 'Партньорски въпроси', meta: 'FAQ' },
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
      { href: '/faq', label: 'Правила', meta: 'FAQ' },
    ],
  },
  knowledge: {
    eyebrow: 'Cane Corso знания',
    title: 'Какво искаш да научиш?',
    description: 'Избери тема според нуждата: история, стандарт, грижа, здраве, развъждане, USG сертификат или Bulgarico наблюдения.',
    status: 'Knowledge е компасът, когато не знаеш коя е правилната следваща стъпка.',
    primary: { href: '/knowledge', label: 'Отвори знанията', meta: 'Статии' },
    secondary: [
      { href: '/knowledge/usg-identity-and-platform-trust', label: 'Какво е USG?', meta: 'Идентичност' },
      { href: '/knowledge/usg-certificate-evidence-levels', label: 'USG сертификат', meta: 'Граници' },
      { href: '/knowledge/usg-bulgarico-observational-framework', label: 'Bulgarico', meta: 'Наблюдения' },
      { href: '/faq', label: 'Бърз отговор', meta: 'FAQ' },
    ],
  },
  registry: {
    eyebrow: 'Публичен Registry',
    title: 'Търсиш профил или статус?',
    description: 'Разгледай публикуваните Cane Corso или отвори личната зона, за да видиш дали твоят профил е чернова, в преглед или публикуван.',
    status: 'Регистърът показва само одобрени и публикувани профили.',
    primary: { href: '/my-dogs', label: 'Виж статус', meta: 'Моите Cane Corso' },
    secondary: [
      { href: '/registry', label: 'Публичен Registry', meta: 'Одобрени профили' },
      { href: '/verify', label: 'Провери сертификат', meta: 'Verify' },
      { href: '/my-dogs/new', label: 'Добави Cane Corso', meta: 'Нов профил' },
      { href: '/knowledge', label: 'Как се подготвя профил?', meta: 'Knowledge' },
    ],
  },
  gallery: {
    eyebrow: 'USG Галерия',
    title: 'Искаш твоят Cane Corso да изглежда силно публично?',
    description: 'Провери снимките, статуса и качеството на профила. Галерията е витрина за подбрани профили, не списък с всички.',
    status: 'Първо профил и публикация, после евентуална витрина.',
    primary: { href: '/my-dogs', label: 'Провери моите снимки', meta: 'Моите Cane Corso' },
    secondary: [
      { href: '/gallery', label: 'Виж Галерия', meta: 'Витрина' },
      { href: '/registry', label: 'Registry', meta: 'Публични профили' },
      { href: '/verify', label: 'Verify', meta: 'Сертификат' },
      { href: '/knowledge', label: 'Снимки и представяне', meta: 'Насоки' },
    ],
  },
  faq: {
    eyebrow: 'Помощ според намерение',
    title: 'За какво ти трябва отговор?',
    description: 'Намери кратък път към профил, Registry, сертификат, общност, партньори или знание за породата.',
    status: 'FAQ помага, когато знаеш какво искаш, но не знаеш откъде да започнеш.',
    primary: { href: '/faq', label: 'Отвори FAQ', meta: 'Отговори' },
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
    description: 'Отвори опашката за преглед, Registry контрол, партньори или екосистемна модерация.',
    status: 'Първо чакащи задачи, после детайл и решение.',
    primary: { href: '/review', label: 'Към Преглед', meta: 'Чакащи профили' },
    secondary: [
      { href: '/admin/registry', label: 'Registry контрол', meta: 'Публикувани' },
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
      { href: '/admin/registry', label: 'Registry контрол', meta: 'След публикация' },
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
      eyebrow: surface === 'platform' ? 'Your Cane Corso center' : item.eyebrow,
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
      eyebrow: surface === 'platform' ? 'Il tuo centro Cane Corso' : item.eyebrow,
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
