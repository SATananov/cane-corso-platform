import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

export type SectionContentSurface =
  | 'platform'
  | 'registry'
  | 'gallery'
  | 'certified'
  | 'verify'
  | 'knowledge'
  | 'faq'
  | 'community'
  | 'partners'
  | 'member'
  | 'myDogs'
  | 'profile'
  | 'ecosystemWorkspace'
  | 'partnerApply'
  | 'adminDashboard'
  | 'review'
  | 'adminRegistry'
  | 'adminPartners'
  | 'adminEcosystem'
  | 'adminKnowledge'
  | 'adminMembers';

type ContentCard = {
  label: string;
  title: string;
  body: string;
};

type ContentSurfaceCopy = {
  eyebrow: string;
  title: string;
  description: string;
  cards: readonly ContentCard[];
  nextLabel: string;
  nextHref: string;
  nextText: string;
};

type ContentMap = Record<SectionContentSurface, ContentSurfaceCopy>;

const bg: ContentMap = {
  platform: {
    eyebrow: 'Пълнота на секцията',
    title: 'Платформата е вход към цялата USG система, не просто начална страница',
    description:
      'Тук посетителят разбира как са разделени официалните повърхности, общността, знанията и личната зона. След вход фокусът се сменя към реални действия и статус.',
    cards: [
      { label: 'Какво е това', title: 'Ориентационен център', body: 'Показва къде са Регистърът, проверката, Галерията, знанията, общността и партньорите.' },
      { label: 'За кого е', title: 'Гост, член, партньор и админ', body: 'Всеки тип потребител получава различен път: разглеждане, подаване, кандидатстване или модерация.' },
      { label: 'Какво следва', title: 'Избери намерение', body: 'Разглеждай публично, добави Cane Corso, кандидатствай като партньор или отвори Knowledge/FAQ за помощ.' },
    ],
    nextLabel: 'Започни от Knowledge',
    nextHref: '/knowledge',
    nextText: 'Когато не си сигурен коя секция ти трябва, започни от знанията и после продължи към действие.',
  },
  registry: {
    eyebrow: 'Как да четеш Регистъра',
    title: 'Регистърът показва одобрени публични Cane Corso профили',
    description:
      'Това е официалната публична видимост на профила. Публикацията в Регистъра не е автоматичен сертификат и не замества родословие.',
    cards: [
      { label: 'Публично', title: 'Виждат се само публикувани профили', body: 'Чернови, чакащи профили и върнати за корекция записи остават в личната зона на собственика.' },
      { label: 'Доверие', title: 'Сертификатът е отделно решение', body: 'USG сертификат се появява само след отделна админ преценка и може да се провери през Verify.' },
      { label: 'Собственик', title: 'Статусът е в Моите Cane Corso', body: 'Ако твоят профил не се вижда публично, провери дали е чернова, изпратен, върнат или публикуван.' },
    ],
    nextLabel: 'Виж статуса на моите Cane Corso',
    nextHref: '/my-dogs',
    nextText: 'Личният статус е по-важен от публичното търсене, когато работиш по собствен профил.',
  },
  gallery: {
    eyebrow: 'Как да четеш Галерията',
    title: 'Галерията е подбрана витрина, не втори Регистър',
    description:
      'Тук се показват само избрани профили и снимки със силно публично представяне и активен USG сертификат.',
    cards: [
      { label: 'Разлика', title: 'Регистър ≠ Галерия', body: 'Профил може да е в Регистъра и пак да не е в Галерията. Галерията е по-селективна сцена.' },
      { label: 'Снимки', title: 'Качеството на кадрите има значение', body: 'Ясни снимки, правилно представяне и завършен профил помагат за по-силна публична визия.' },
      { label: 'Контрол', title: 'Финалната селекция е админ решение', body: 'Общностната подкрепа помага, но Галерията остава свързана с официалния USG слой на доверие.' },
    ],
    nextLabel: 'Подготви профила и снимките',
    nextHref: '/my-dogs',
    nextText: 'Започни от личния профил на кучето: снимки, данни, родословие и готовност за преглед.',
  },
  certified: {
    eyebrow: 'Какво значи Certified',
    title: 'Certified архивът показва активни USG сертификатни записи',
    description:
      'Тази секция е за проверима публична увереност: сертификат, код, профил и връзка към официалната проверка.',
    cards: [
      { label: 'Проверимо', title: 'Всеки сертификат има код', body: 'Кодът води към публична проверка, за да може човек да потвърди статуса без догадки.' },
      { label: 'Отделно', title: 'Не всеки Регистър профил е сертифициран', body: 'Публикуван профил и сертифициран профил са две различни нива.' },
      { label: 'Прозрачно', title: 'Сертификатът не е родословие', body: 'USG не заменя клубни документи. Той е платформен слой за преглед, идентичност и доверие.' },
    ],
    nextLabel: 'Провери сертификат',
    nextHref: '/verify',
    nextText: 'Когато имаш код, използвай Verify за потвърждение на активния запис.',
  },
  verify: {
    eyebrow: 'Как работи проверката',
    title: 'Verify потвърждава активен сертификатен запис',
    description:
      'Проверката отговаря на един конкретен въпрос: съществува ли активен USG сертификат за този код и към кой публикуван профил води.',
    cards: [
      { label: 'Код', title: 'Търси се конкретен сертификат', body: 'Без валиден код няма как да се потвърди сертификатен запис.' },
      { label: 'Граница', title: 'Verify не оценява всички Cane Corso', body: 'Ако кучето няма сертификат, това не значи автоматично, че не е истинско Cane Corso.' },
      { label: 'Път', title: 'Собственикът работи първо в личната зона', body: 'Профилът се подготвя, изпраща и преглежда преди да има публична проверка.' },
    ],
    nextLabel: 'Отвори проверката',
    nextHref: '/verify',
    nextText: 'Въведи код само когато имаш издаден USG сертификат или публичен сертификатен номер.',
  },
  knowledge: {
    eyebrow: 'Какво има в Knowledge',
    title: 'Knowledge е образователният център за Cane Corso и USG идеята',
    description:
      'Тук са събрани история, стандарт, здраве, поведение, снимки за преглед, USG сертификат и наблюдателната Bulgarico рамка.',
    cards: [
      { label: 'Порода', title: 'История, стандарт и структура', body: 'Помага на собственика да разбере какво гледа и какво е важно при Cane Corso.' },
      { label: 'Практика', title: 'Подготовка на профил', body: 'Обяснява какви данни, снимки и родословна информация са полезни преди преглед.' },
      { label: 'USG', title: 'Идея, сертификат и граници', body: 'Разделя USG наблюденията от официалните стандарти и не представя хипотези като факт.' },
    ],
    nextLabel: 'Отвори статиите',
    nextHref: '/knowledge',
    nextText: 'Тази секция е най-доброто място, когато търсиш информация преди действие.',
  },
  faq: {
    eyebrow: 'Как да ползваш FAQ',
    title: 'FAQ дава кратки отговори за основните решения в платформата',
    description:
      'Тук са обяснени разликите между Регистър, сертификат, Галерия, общност, партньори и лични заявки.',
    cards: [
      { label: 'Бързо', title: 'Кратък отговор преди дълга статия', body: 'FAQ е за моментите, когато искаш ясна насока без да четеш цяла статия.' },
      { label: 'Граници', title: 'Какво става публично', body: 'Обяснява защо профили, партньори и общностни записи не се публикуват автоматично.' },
      { label: 'Следваща стъпка', title: 'Отговорът води към действие', body: 'След всеки основен въпрос трябва да знаеш дали да отвориш профил, Knowledge, Community или Admin.' },
    ],
    nextLabel: 'Прочети FAQ',
    nextHref: '/faq',
    nextText: 'Използвай FAQ като кратък навигатор, когато нещо в платформата не е ясно.',
  },
  community: {
    eyebrow: 'Как работи Общността',
    title: 'Общността събира реални нужди, но не излага лични контакти без контрол',
    description:
      'Тук има търсене на дом, разплоден партньор, малки, изгубен/намерен Cane Corso, места и услуги. Чувствителните връзки минават през администратор.',
    cards: [
      { label: 'Намерение', title: 'Първо избираш реалната нужда', body: 'Дом, партньор, малки, сигнал, място или услуга са различни пътища с различна отговорност.' },
      { label: 'Защита', title: 'Контактите не са директно публични', body: 'При чувствителни случаи интересът се подава през платформата и администраторът решава дали да свърже страните.' },
      { label: 'Полезност', title: 'Места и услуги помагат на собствениците', body: 'Платформата може да расте като практична карта и директория за Cane Corso живот.' },
    ],
    nextLabel: 'Подай или провери заявка',
    nextHref: '/ecosystem',
    nextText: 'Личните заявки се управляват от member зоната, а публичността идва след преглед.',
  },
  partners: {
    eyebrow: 'Как работят Партньорите',
    title: 'Партньорите са проверена мрежа от услуги около Cane Corso',
    description:
      'Тук са услуги, места и професионалисти, които могат да бъдат полезни за собственици и развъдчици, но публичната видимост минава през одобрение.',
    cards: [
      { label: 'Каталог', title: 'Публично се виждат одобрени записи', body: 'Кандидатурите и непроверените услуги не трябва да изглеждат като официално препоръчани.' },
      { label: 'Категории', title: 'Услугите трябва да са разбираеми', body: 'Хотели, транспорт, обучение, ветеринарна грижа, магазини и места се показват с ясна категория и локация.' },
      { label: 'Отговорност', title: 'Партньор ≠ автоматична гаранция', body: 'USG показва одобрена видимост и структура, но потребителят пак трябва да преценява услугата внимателно.' },
    ],
    nextLabel: 'Кандидатствай като партньор',
    nextHref: '/partners/apply',
    nextText: 'Попълни кандидатура само ако услугата е реална, описана ясно и подходяща за Cane Corso аудитория.',
  },
  member: {
    eyebrow: 'Какво има в личната зона',
    title: 'Member центърът показва действията, които са важни след вход',
    description:
      'След логин човек не трябва да чете публични обяснения отново. Тук трябва да вижда профили, статуси, заявки и най-близка следваща стъпка.',
    cards: [
      { label: 'Първо', title: 'Профил на собственика', body: 'Име, снимка и контактна яснота помагат преди сериозни заявки и профили.' },
      { label: 'Основно', title: 'Моите Cane Corso', body: 'Това е главният работен път за добавяне, редакция, снимки, родословие и изпращане за преглед.' },
      { label: 'Допълнително', title: 'Заявки и партньорства', body: 'Общностни и партньорски заявки имат собствен статус и не стават публични автоматично.' },
    ],
    nextLabel: 'Отвори Моите Cane Corso',
    nextHref: '/my-dogs',
    nextText: 'За повечето собственици това е най-важната първа стъпка.',
  },
  myDogs: {
    eyebrow: 'Какво да попълниш',
    title: 'Моите Cane Corso е работната зона за профили, снимки и преглед',
    description:
      'Всеки профил трябва да води собственика ясно: данни, снимки, родословие, готовност, изпращане, статус и публичност.',
    cards: [
      { label: 'Данни', title: 'Основна идентичност', body: 'Име, пол, цвят, дата на раждане, локация и микрочип/родословие, ако са налични.' },
      { label: 'Снимки', title: '1–3 силни снимки', body: 'Основната снимка трябва да показва кучето ясно. Допълнителните снимки помагат за по-добър преглед.' },
      { label: 'Статус', title: 'Чернова, изпратен, върнат или публикуван', body: 'Потребителят трябва да знае защо профилът още не се вижда публично и какво да направи.' },
    ],
    nextLabel: 'Добави Cane Corso',
    nextHref: '/my-dogs/new',
    nextText: 'Започни с основните данни и после добави снимки и родословна информация.',
  },
  profile: {
    eyebrow: 'Защо профилът на собственика е важен',
    title: 'Собственикът дава контекст и доверие към подадените профили',
    description:
      'Това не е публична социална мрежа. Данните помагат на USG да разбере кой подава профил, как да се свърже и какво може да стане публично.',
    cards: [
      { label: 'Идентичност', title: 'Име и представяне', body: 'Профилът трябва да е ясен, но без да излага излишна лична информация.' },
      { label: 'Контакт', title: 'Връзка при нужда', body: 'Контактът помага при модерация, корекции, партньорства и чувствителни общностни заявки.' },
      { label: 'Поверителност', title: 'Не всичко е публично', body: 'Платформата трябва да пази личните данни и да показва само нужната публична информация.' },
    ],
    nextLabel: 'Редактирай профила',
    nextHref: '/profile',
    nextText: 'Провери профила си преди да изпращаш Cane Corso или общностни заявки.',
  },
  ecosystemWorkspace: {
    eyebrow: 'Какво са моите заявки',
    title: 'Тук управляваш общностни нужди, места и чувствителни връзки',
    description:
      'Member зоната за екосистемата пази статуса на всяка заявка: чернова, изпратена, върната, одобрена, публикувана или архивирана.',
    cards: [
      { label: 'Чувствително', title: 'Дом, малки и разплод минават през админ', body: 'Тези записи не трябва да излагат директно лични контакти и не свързват хората автоматично.' },
      { label: 'Полезно', title: 'Места и услуги могат да станат публични', body: 'Подходящи места и услуги се виждат след преглед, за да помагат на други собственици.' },
      { label: 'Статус', title: 'Следи какво чака решение', body: 'Върнатите заявки трябва да се редактират, а публикуваните вече се виждат публично.' },
    ],
    nextLabel: 'Създай заявка',
    nextHref: '/ecosystem',
    nextText: 'Избери типа според реалната нужда и попълни само информация, която е безопасна за преглед.',
  },
  partnerApply: {
    eyebrow: 'Какво е партньорска кандидатура',
    title: 'Партньорството е публична услуга след проверка, не обикновена реклама',
    description:
      'Кандидатурата трябва да показва каква услуга предлагаш, къде работиш, как се свързват хората и защо това е полезно за Cane Corso аудиторията.',
    cards: [
      { label: 'Яснота', title: 'Категория, локация и описание', body: 'Потребителите трябва веднага да разберат какво предлагаш и за кого е подходящо.' },
      { label: 'Доверие', title: 'Одобрението минава през админ', body: 'Публичната видимост идва само след проверка и не трябва да се смесва с community popularity.' },
      { label: 'Качество', title: 'По-малко, но по-смислени партньори', body: 'Целта е полезна мрежа за Cane Corso, не безконтролен каталог.' },
    ],
    nextLabel: 'Попълни кандидатура',
    nextHref: '/partners/apply',
    nextText: 'Подготви реално описание, категория, локация и контакти преди изпращане.',
  },
  adminDashboard: {
    eyebrow: 'Админ команден център',
    title: 'Админът трябва да вижда какво чака решение, не просто меню',
    description:
      'Тази секция води към профили за преглед, Registry контрол, партньори, екосистемни заявки, Knowledge и потребители.',
    cards: [
      { label: 'Приоритет', title: 'Първо чакащите решения', body: 'Профили, сертификати, партньорства и чувствителни заявки трябва да са ясно разделени.' },
      { label: 'Отговорност', title: 'Всяко действие има публичен ефект', body: 'Публикация, сертификат, отнемане и одобрение трябва да остават проследими.' },
      { label: 'Граница', title: 'Админ ≠ автоматизация', body: 'Системата помага, но финалното решение остава човешка преценка.' },
    ],
    nextLabel: 'Отвори Преглед',
    nextHref: '/review',
    nextText: 'Профилите за преглед са най-честият админ приоритет.',
  },
  review: {
    eyebrow: 'Какво решава Прегледът',
    title: 'Review е мястото за човешка преценка преди публичност',
    description:
      'Тук админът решава дали профилът е готов, има нужда от корекция, може да бъде публикуван или да получи отделен USG сертификат.',
    cards: [
      { label: 'Готовност', title: 'Първо се гледа профилът', body: 'Основни данни, снимки, собственик, родословна информация и съответствие с правилата.' },
      { label: 'Решение', title: 'Публикация и сертификат са отделни', body: 'Профил може да бъде публикуван без да получи сертификат.' },
      { label: 'Комуникация', title: 'Корекциите трябва да са ясни', body: 'Ако профилът се върне, собственикът трябва да разбере какво липсва.' },
    ],
    nextLabel: 'Отвори Registry контрол',
    nextHref: '/admin/registry',
    nextText: 'След публикация контролът продължава в админ Регистъра.',
  },
  adminRegistry: {
    eyebrow: 'Админ контрол на Регистъра',
    title: 'Тук се управляват публикуваните профили и сертификатните действия',
    description:
      'Това е контролен слой след модерация: публични записи, сваляне от Регистъра, издаване или отнемане на сертификат.',
    cards: [
      { label: 'Публично', title: 'Всяка промяна се вижда навън', body: 'Публикуван профил влияе на Registry, Verify, Gallery и доверените повърхности.' },
      { label: 'Сертификат', title: 'Издава се само при ясна причина', body: 'Сертификатът е отделен от публикацията и трябва да остане проследим.' },
      { label: 'Връщане назад', title: 'Отнемането също е сериозно действие', body: 'Сваляне от Registry или отнемане на сертификат трябва да има причина и следа.' },
    ],
    nextLabel: 'Върни се към Преглед',
    nextHref: '/review',
    nextText: 'Новите профили първо трябва да минат през преглед, преди да стигнат до този контрол.',
  },
  adminPartners: {
    eyebrow: 'Админ контрол на партньорите',
    title: 'Партньорските кандидатури се проверяват преди публичен каталог',
    description:
      'Тук се преценява дали услугата е реална, описана ясно, подходяща за Cane Corso аудиторията и безопасна за публична видимост.',
    cards: [
      { label: 'Проверка', title: 'Преди публичност има преглед', body: 'Партньор не трябва да изглежда одобрен, докато кандидатурата не е прегледана.' },
      { label: 'Синхрон', title: 'Одобрените услуги могат да се появят и в екосистемата', body: 'Партньорският каталог и екосистемните услуги трябва да са съгласувани.' },
      { label: 'Качество', title: 'Каталогът трябва да остане полезен', body: 'По-добре малко проверени партньори, отколкото много неясни записи.' },
    ],
    nextLabel: 'Отвори публичните партньори',
    nextHref: '/partners',
    nextText: 'Публичната страница показва резултата от одобрените записи.',
  },
  adminEcosystem: {
    eyebrow: 'Админ контрол на екосистемата',
    title: 'Екосистемните заявки имат различна чувствителност и различни правила',
    description:
      'Дом, разплод, малки и изгубен/намерен Cane Corso не са обикновени обяви. Те изискват внимателна модерация и защита на контактите.',
    cards: [
      { label: 'Чувствителни', title: 'Не свързвай автоматично хората', body: 'Админът решава кога и дали е безопасно да посредничи между страните.' },
      { label: 'Публични', title: 'Места и услуги могат да помагат на всички', body: 'Полезните записи стават публични след проверка и ясна категория.' },
      { label: 'Архив', title: 'Неактуалното трябва да се прибира', body: 'Сигнали и заявки, които вече не са валидни, не трябва да стоят като активни.' },
    ],
    nextLabel: 'Виж публичната Общност',
    nextHref: '/community',
    nextText: 'Публичната секция трябва да показва само проверена и безопасна информация.',
  },
  adminKnowledge: {
    eyebrow: 'Админ контрол на Knowledge',
    title: 'Знанията са образователен авторитет и трябва да останат внимателни',
    description:
      'Статиите за Cane Corso, USG и Bulgarico трябва да са полезни, честни и ясно отделени от официални стандарти или клубни твърдения.',
    cards: [
      { label: 'Авторитет', title: 'Официални източници и USG наблюдения се разделят', body: 'FCI/AKC/UKC/история и USG наблюдателни рамки не трябва да се смесват като равни факти.' },
      { label: 'Тон', title: 'Без обиди към развъдчици или собственици', body: 'Платформата обяснява, наблюдава и образова, без да напада различни линии или държави.' },
      { label: 'Процес', title: 'Писането остава контролирано', body: 'Докато няма пълен CMS, админ зоната служи като governance и преглед на съдържанието.' },
    ],
    nextLabel: 'Отвори Knowledge',
    nextHref: '/knowledge',
    nextText: 'Публичните статии трябва да звучат завършено и да не обещават повече от доказаното.',
  },
  adminMembers: {
    eyebrow: 'Админ контрол на потребителите',
    title: 'Потребителите са свързани с профили, заявки и доверие',
    description:
      'Тази зона трябва да помага за преглед на member/admin/partner ролите, собствеността върху профили и безопасната работа с данни.',
    cards: [
      { label: 'Роли', title: 'Ролята определя достъпа', body: 'Member, partner и admin не трябва да виждат едни и същи действия.' },
      { label: 'Собственост', title: 'Профилите имат реален собственик', body: 'Cane Corso профилите, снимките и заявките трябва да остават свързани с правилния потребител.' },
      { label: 'Поверителност', title: 'Личните данни се пазят', body: 'Админът трябва да работи внимателно с контактна информация и публична видимост.' },
    ],
    nextLabel: 'Към админ центъра',
    nextHref: '/admin',
    nextText: 'Използвай потребителската зона като помощна проверка, не като shortcut към публичност.',
  },
};

const en: ContentMap = {
  platform: {
    eyebrow: 'Section completeness',
    title: 'The platform is the entry into the whole USG system, not just a landing page',
    description:
      'Visitors understand how official trust surfaces, community utility, education, and private workspaces are separated. After sign-in, the focus shifts to actions and status.',
    cards: [
      { label: 'What it is', title: 'Orientation center', body: 'Shows where Registry, Verify, Gallery, Knowledge, Community, and Partners belong.' },
      { label: 'Who it serves', title: 'Guest, member, partner, and admin', body: 'Each role receives a different path: browse, submit, apply, or moderate.' },
      { label: 'Next step', title: 'Choose intent', body: 'Browse publicly, add a Cane Corso, apply as a partner, or open Knowledge/FAQ for guidance.' },
    ],
    nextLabel: 'Start with Knowledge',
    nextHref: '/knowledge',
    nextText: 'When you are not sure which section you need, begin with education and then continue to an action.',
  },
  registry: {
    eyebrow: 'How to read the Registry',
    title: 'The Registry shows approved public Cane Corso profiles',
    description: 'This is official public profile visibility. Registry publication is not an automatic certificate and does not replace pedigree documents.',
    cards: [
      { label: 'Public', title: 'Only published profiles are visible', body: 'Drafts, pending profiles, and profiles returned for changes remain in the owner workspace.' },
      { label: 'Trust', title: 'The certificate is a separate decision', body: 'A USG certificate appears only after a separate admin decision and can be checked through Verify.' },
      { label: 'Owner', title: 'Status is in My Cane Corso', body: 'If your profile is not public, check whether it is a draft, submitted, returned, or published.' },
    ],
    nextLabel: 'Check my Cane Corso status',
    nextHref: '/my-dogs',
    nextText: 'Your private status is more useful than public search while you are working on your own profile.',
  },
  gallery: {
    eyebrow: 'How to read the Gallery',
    title: 'The Gallery is a curated showcase, not a second Registry',
    description: 'Only selected profiles and photos with strong public presentation and an active USG certificate belong here.',
    cards: [
      { label: 'Difference', title: 'Registry ≠ Gallery', body: 'A profile can be in the Registry without being selected for the Gallery. The Gallery is a more selective stage.' },
      { label: 'Images', title: 'Photo quality matters', body: 'Clear photos, proper presentation, and a completed profile help create a stronger public presence.' },
      { label: 'Control', title: 'Final selection remains an admin decision', body: 'Community support helps, but Gallery visibility remains connected to the official USG trust layer.' },
    ],
    nextLabel: 'Prepare profile and photos',
    nextHref: '/my-dogs',
    nextText: 'Start from the dog profile: photos, data, pedigree information, and readiness for review.',
  },
  certified: {
    eyebrow: 'What Certified means',
    title: 'The Certified archive shows active USG certificate records',
    description: 'This section is for verifiable public assurance: certificate, code, profile, and a link to official verification.',
    cards: [
      { label: 'Verifiable', title: 'Each certificate has a code', body: 'The code leads to public verification so people can confirm status without guessing.' },
      { label: 'Separate', title: 'Not every Registry profile is certified', body: 'A published profile and a certified profile are two different levels.' },
      { label: 'Transparent', title: 'The certificate is not a pedigree', body: 'USG does not replace club documents. It is a platform layer for review, identity, and trust.' },
    ],
    nextLabel: 'Verify a certificate',
    nextHref: '/verify',
    nextText: 'Use Verify when you have a code and want to confirm the active record.',
  },
  verify: {
    eyebrow: 'How verification works',
    title: 'Verify confirms an active certificate record',
    description: 'Verification answers one specific question: does this code match an active USG certificate, and which published profile does it belong to?',
    cards: [
      { label: 'Code', title: 'A specific certificate is checked', body: 'Without a valid code, a certificate record cannot be confirmed.' },
      { label: 'Boundary', title: 'Verify does not judge all Cane Corso', body: 'If a dog has no certificate, that does not automatically mean it is not a real Cane Corso.' },
      { label: 'Path', title: 'Owners work in the private area first', body: 'A profile is prepared, submitted, and reviewed before public verification becomes relevant.' },
    ],
    nextLabel: 'Open verification',
    nextHref: '/verify',
    nextText: 'Enter a code only when you have an issued USG certificate or public certificate number.',
  },
  knowledge: {
    eyebrow: 'What Knowledge contains',
    title: 'Knowledge is the education center for Cane Corso and the USG idea',
    description: 'It brings together history, standards, health, behavior, review photos, the USG certificate, and the Bulgarico observational framework.',
    cards: [
      { label: 'Breed', title: 'History, standard, and structure', body: 'Helps owners understand what they are looking at and what matters in Cane Corso.' },
      { label: 'Practice', title: 'Profile preparation', body: 'Explains which data, photos, and pedigree information help before review.' },
      { label: 'USG', title: 'Idea, certificate, and limits', body: 'Separates USG observations from official standards and avoids presenting hypotheses as fact.' },
    ],
    nextLabel: 'Open articles',
    nextHref: '/knowledge',
    nextText: 'This is the best place to start when you need information before taking action.',
  },
  faq: {
    eyebrow: 'How to use FAQ',
    title: 'FAQ gives short answers about the main platform decisions',
    description: 'It explains the differences between Registry, Certificate, Gallery, Community, Partners, and private requests.',
    cards: [
      { label: 'Fast', title: 'Short answer before a full article', body: 'FAQ is for moments when you need direction without reading a full article.' },
      { label: 'Boundaries', title: 'What becomes public', body: 'Explains why profiles, partners, and community listings are not published automatically.' },
      { label: 'Next step', title: 'Answers lead to action', body: 'After the main questions, you should know whether to open your profile, Knowledge, Community, or Admin.' },
    ],
    nextLabel: 'Read FAQ',
    nextHref: '/faq',
    nextText: 'Use FAQ as a quick navigator whenever something in the platform is unclear.',
  },
  community: {
    eyebrow: 'How Community works',
    title: 'Community gathers real needs, but does not expose private contacts without control',
    description: 'It supports adoption/new home, breeding match, puppies, lost/found, friendly places, and services. Sensitive connections go through an admin.',
    cards: [
      { label: 'Intent', title: 'Choose the real need first', body: 'Home, match, puppies, alert, place, or service are different paths with different responsibility.' },
      { label: 'Protection', title: 'Contacts are not directly public', body: 'For sensitive cases, interest is submitted through the platform and an admin decides whether to connect people.' },
      { label: 'Utility', title: 'Places and services help owners', body: 'The platform can grow into a practical map and directory for Cane Corso life.' },
    ],
    nextLabel: 'Submit or check a request',
    nextHref: '/ecosystem',
    nextText: 'Private requests are managed from the member area, and public visibility comes after review.',
  },
  partners: {
    eyebrow: 'How Partners work',
    title: 'Partners are a reviewed service network around Cane Corso',
    description: 'Services, places, and professionals can help owners and breeders, but public visibility goes through approval.',
    cards: [
      { label: 'Directory', title: 'Approved records are public', body: 'Applications and unreviewed services should not look officially recommended.' },
      { label: 'Categories', title: 'Services must be understandable', body: 'Boarding, transport, training, veterinary care, shops, and places appear with a clear category and location.' },
      { label: 'Responsibility', title: 'Partner does not mean automatic guarantee', body: 'USG gives approved visibility and structure, but users should still evaluate each service carefully.' },
    ],
    nextLabel: 'Apply as a partner',
    nextHref: '/partners/apply',
    nextText: 'Apply only when the service is real, clearly described, and useful for the Cane Corso audience.',
  },
  member: {
    eyebrow: 'What is in the private area',
    title: 'The member center shows the actions that matter after sign-in',
    description: 'After login, users should not read the public explanation again. They should see profiles, statuses, requests, and the closest next step.',
    cards: [
      { label: 'First', title: 'Owner profile', body: 'Name, photo, and contact clarity help before serious requests and dog profiles.' },
      { label: 'Main', title: 'My Cane Corso', body: 'The main path for adding, editing, photos, pedigree information, and review submission.' },
      { label: 'Additional', title: 'Requests and partnerships', body: 'Community and partner requests have their own status and do not become public automatically.' },
    ],
    nextLabel: 'Open My Cane Corso',
    nextHref: '/my-dogs',
    nextText: 'For most owners, this is the most important first step.',
  },
  myDogs: {
    eyebrow: 'What to fill in',
    title: 'My Cane Corso is the workspace for profiles, images, and review',
    description: 'Every profile should guide the owner clearly: data, images, pedigree, readiness, submission, status, and public visibility.',
    cards: [
      { label: 'Data', title: 'Core identity', body: 'Name, sex, color, birth date, location, and microchip/pedigree number if available.' },
      { label: 'Images', title: '1–3 strong photos', body: 'The primary image should show the dog clearly. Additional photos help the review.' },
      { label: 'Status', title: 'Draft, submitted, returned, or published', body: 'Users should understand why a profile is not public yet and what to do next.' },
    ],
    nextLabel: 'Add Cane Corso',
    nextHref: '/my-dogs/new',
    nextText: 'Start with core data, then add images and pedigree information.',
  },
  profile: {
    eyebrow: 'Why the owner profile matters',
    title: 'The owner profile gives context and trust to submitted records',
    description: 'This is not a public social network. The data helps USG understand who submits a profile, how to contact them, and what can become public.',
    cards: [
      { label: 'Identity', title: 'Name and presentation', body: 'The profile should be clear without exposing unnecessary personal information.' },
      { label: 'Contact', title: 'Reachability when needed', body: 'Contact data helps moderation, corrections, partnerships, and sensitive community requests.' },
      { label: 'Privacy', title: 'Not everything is public', body: 'The platform should protect personal data and show only the necessary public information.' },
    ],
    nextLabel: 'Edit profile',
    nextHref: '/profile',
    nextText: 'Check your profile before sending Cane Corso or community requests.',
  },
  ecosystemWorkspace: {
    eyebrow: 'What my requests are',
    title: 'Manage community needs, places, and sensitive connections here',
    description: 'The ecosystem member area keeps the status of each request: draft, submitted, returned, approved, published, or archived.',
    cards: [
      { label: 'Sensitive', title: 'Home, puppies, and breeding go through admin', body: 'These records should not expose direct contacts or connect people automatically.' },
      { label: 'Useful', title: 'Places and services can become public', body: 'Helpful places and services become visible after review and a clear category.' },
      { label: 'Status', title: 'Track what waits for decision', body: 'Returned requests should be edited, while published requests are already visible publicly.' },
    ],
    nextLabel: 'Create request',
    nextHref: '/ecosystem',
    nextText: 'Choose the type according to the real need and submit only information that is safe for review.',
  },
  partnerApply: {
    eyebrow: 'What a partner application is',
    title: 'Partnership is a reviewed public service, not ordinary advertising',
    description: 'The application should show what you offer, where you work, how people contact you, and why it is useful for the Cane Corso audience.',
    cards: [
      { label: 'Clarity', title: 'Category, location, and description', body: 'Users should immediately understand what you offer and who it is suitable for.' },
      { label: 'Trust', title: 'Approval goes through admin', body: 'Public visibility comes only after review and should not be mixed with community popularity.' },
      { label: 'Quality', title: 'Fewer, more meaningful partners', body: 'The goal is a useful Cane Corso network, not an uncontrolled directory.' },
    ],
    nextLabel: 'Fill application',
    nextHref: '/partners/apply',
    nextText: 'Prepare a real description, category, location, and contacts before submitting.',
  },
  adminDashboard: {
    eyebrow: 'Admin command center',
    title: 'Admins should see pending decisions, not just a menu',
    description: 'This section leads to review profiles, Registry control, partners, ecosystem requests, Knowledge, and members.',
    cards: [
      { label: 'Priority', title: 'Pending decisions first', body: 'Profiles, certificates, partnerships, and sensitive requests must remain clearly separated.' },
      { label: 'Responsibility', title: 'Each action has public effect', body: 'Publication, certification, revocation, and approval must remain traceable.' },
      { label: 'Boundary', title: 'Admin is not automation', body: 'The system assists, but the final decision remains human judgment.' },
    ],
    nextLabel: 'Open Review',
    nextHref: '/review',
    nextText: 'Profiles waiting for review are the most common admin priority.',
  },
  review: {
    eyebrow: 'What Review decides',
    title: 'Review is the place for human judgment before public visibility',
    description: 'Admins decide whether a profile is ready, needs changes, can be published, or can receive a separate USG certificate.',
    cards: [
      { label: 'Readiness', title: 'Profile first', body: 'Core data, photos, owner, pedigree information, and rule alignment are reviewed.' },
      { label: 'Decision', title: 'Publication and certificate are separate', body: 'A profile can be published without receiving a certificate.' },
      { label: 'Communication', title: 'Corrections must be clear', body: 'If a profile is returned, the owner should understand what is missing.' },
    ],
    nextLabel: 'Open Registry control',
    nextHref: '/admin/registry',
    nextText: 'After publication, control continues in the admin Registry.',
  },
  adminRegistry: {
    eyebrow: 'Admin Registry control',
    title: 'Published profiles and certificate actions are managed here',
    description: 'This is the control layer after moderation: public records, removal from Registry, issuing, or revoking certificates.',
    cards: [
      { label: 'Public', title: 'Every change is visible outside', body: 'A published profile affects Registry, Verify, Gallery, and trusted surfaces.' },
      { label: 'Certificate', title: 'Issue only with a clear reason', body: 'The certificate is separate from publication and must remain traceable.' },
      { label: 'Rollback', title: 'Revocation is also serious', body: 'Removing from Registry or revoking a certificate should have a reason and a trail.' },
    ],
    nextLabel: 'Return to Review',
    nextHref: '/review',
    nextText: 'New profiles should pass Review before reaching this control layer.',
  },
  adminPartners: {
    eyebrow: 'Admin Partner control',
    title: 'Partner applications are checked before the public directory',
    description: 'Admins decide whether a service is real, clear, suitable for the Cane Corso audience, and safe for public visibility.',
    cards: [
      { label: 'Check', title: 'Review before visibility', body: 'A partner should not appear approved until the application has been reviewed.' },
      { label: 'Sync', title: 'Approved services can appear in the ecosystem', body: 'The partner directory and ecosystem services should stay aligned.' },
      { label: 'Quality', title: 'The directory must stay useful', body: 'A few reviewed partners are better than many unclear records.' },
    ],
    nextLabel: 'Open public partners',
    nextHref: '/partners',
    nextText: 'The public page shows the result of approved records.',
  },
  adminEcosystem: {
    eyebrow: 'Admin Ecosystem control',
    title: 'Ecosystem requests have different sensitivity and rules',
    description: 'Home, breeding, puppies, and lost/found Cane Corso records are not ordinary ads. They require careful moderation and contact protection.',
    cards: [
      { label: 'Sensitive', title: 'Do not connect people automatically', body: 'Admins decide when and whether it is safe to mediate between sides.' },
      { label: 'Public', title: 'Places and services can help everyone', body: 'Useful records become public after review and a clear category.' },
      { label: 'Archive', title: 'Outdated items should be closed', body: 'Signals and requests that are no longer valid should not remain active.' },
    ],
    nextLabel: 'View public Community',
    nextHref: '/community',
    nextText: 'The public section should show only reviewed and safe information.',
  },
  adminKnowledge: {
    eyebrow: 'Admin Knowledge control',
    title: 'Knowledge is educational authority and must stay careful',
    description: 'Articles about Cane Corso, USG, and Bulgarico must be useful, honest, and clearly separated from official standards or club claims.',
    cards: [
      { label: 'Authority', title: 'Official sources and USG observations are separated', body: 'FCI/AKC/UKC/history and USG observation frameworks should not be mixed as equal facts.' },
      { label: 'Tone', title: 'No attacks on breeders or owners', body: 'The platform explains, observes, and educates without attacking lines or countries.' },
      { label: 'Process', title: 'Writing remains controlled', body: 'Until a full CMS exists, the admin area serves content governance and review.' },
    ],
    nextLabel: 'Open Knowledge',
    nextHref: '/knowledge',
    nextText: 'Public articles should feel complete and should not promise more than what is supported.',
  },
  adminMembers: {
    eyebrow: 'Admin Member control',
    title: 'Members connect to profiles, requests, and trust',
    description: 'This area helps review member/admin/partner roles, ownership of profiles, and safe handling of data.',
    cards: [
      { label: 'Roles', title: 'Role controls access', body: 'Member, partner, and admin users should not see the same actions.' },
      { label: 'Ownership', title: 'Profiles have real owners', body: 'Cane Corso profiles, photos, and requests should stay connected to the correct user.' },
      { label: 'Privacy', title: 'Personal data is protected', body: 'Admins should handle contact information and public visibility carefully.' },
    ],
    nextLabel: 'Go to admin center',
    nextHref: '/admin',
    nextText: 'Use the member area as a supporting check, not as a shortcut to public visibility.',
  },
};

const it: ContentMap = {
  platform: {
    eyebrow: 'Completezza della sezione',
    title: 'La piattaforma è l’ingresso all’intero sistema USG, non solo una pagina iniziale',
    description:
      'Il visitatore capisce come sono separati le superfici ufficiali di fiducia, l’utilità della comunità, la conoscenza e le aree private. Dopo l’accesso, il focus diventa azione e stato.',
    cards: [
      { label: 'Cos’è', title: 'Centro di orientamento', body: 'Mostra dove si trovano Registro, Verifica, Galleria, Conoscenze, Comunità e Partner.' },
      { label: 'Per chi è', title: 'Ospite, membro, partner e amministratore', body: 'Ogni ruolo riceve un percorso diverso: esplorare, inviare, candidarsi o moderare.' },
      { label: 'Prossimo passo', title: 'Scegli l’intenzione', body: 'Esplora le pagine pubbliche, aggiungi un Cane Corso, candidati come partner o apri Conoscenze/FAQ.' },
    ],
    nextLabel: 'Inizia da Conoscenze',
    nextHref: '/knowledge',
    nextText: 'Quando non sai quale sezione ti serve, parti dalle informazioni e poi continua verso l’azione.',
  },
  registry: {
    eyebrow: 'Come leggere il Registro',
    title: 'Il Registro mostra profili Cane Corso pubblici e approvati',
    description: 'È la visibilità pubblica ufficiale del profilo. La pubblicazione nel Registro non è un certificato automatico e non sostituisce il pedigree.',
    cards: [
      { label: 'Pubblico', title: 'Sono visibili solo i profili pubblicati', body: 'Bozze, profili in attesa e profili restituiti per correzioni restano nell’area del proprietario.' },
      { label: 'Fiducia', title: 'Il certificato è una decisione separata', body: 'Un certificato USG appare solo dopo una decisione amministrativa separata e può essere verificato.' },
      { label: 'Proprietario', title: 'Lo stato è in I miei Cane Corso', body: 'Se il tuo profilo non è pubblico, controlla se è bozza, inviato, restituito o pubblicato.' },
    ],
    nextLabel: 'Controlla lo stato dei miei Cane Corso',
    nextHref: '/my-dogs',
    nextText: 'Lo stato privato è più utile della ricerca pubblica quando lavori sul tuo profilo.',
  },
  gallery: {
    eyebrow: 'Come leggere la Galleria',
    title: 'La Galleria è una vetrina curata, non un secondo Registro',
    description: 'Qui entrano solo profili e foto selezionati, con forte presentazione pubblica e certificato USG attivo.',
    cards: [
      { label: 'Differenza', title: 'Registro ≠ Galleria', body: 'Un profilo può essere nel Registro senza entrare in Galleria. La Galleria è un livello più selettivo.' },
      { label: 'Foto', title: 'La qualità delle immagini conta', body: 'Foto chiare, buona presentazione e profilo completo aiutano una presenza pubblica più forte.' },
      { label: 'Controllo', title: 'La selezione finale resta amministrativa', body: 'Il sostegno della comunità aiuta, ma la Galleria resta collegata al livello ufficiale di fiducia USG.' },
    ],
    nextLabel: 'Prepara profilo e foto',
    nextHref: '/my-dogs',
    nextText: 'Inizia dal profilo del cane: foto, dati, informazioni genealogiche e prontezza per la revisione.',
  },
  certified: {
    eyebrow: 'Cosa significa Certified',
    title: 'L’archivio Certified mostra certificati USG attivi',
    description: 'Questa sezione serve a dare conferma pubblica verificabile: certificato, codice, profilo e collegamento alla verifica ufficiale.',
    cards: [
      { label: 'Verificabile', title: 'Ogni certificato ha un codice', body: 'Il codice porta alla verifica pubblica, così lo stato può essere confermato senza supposizioni.' },
      { label: 'Separato', title: 'Non ogni profilo nel Registro è certificato', body: 'Profilo pubblicato e profilo certificato sono due livelli diversi.' },
      { label: 'Trasparente', title: 'Il certificato non è un pedigree', body: 'USG non sostituisce i documenti di club. È un livello di piattaforma per revisione, identità e fiducia.' },
    ],
    nextLabel: 'Verifica un certificato',
    nextHref: '/verify',
    nextText: 'Usa la verifica quando hai un codice e vuoi confermare il record attivo.',
  },
  verify: {
    eyebrow: 'Come funziona la verifica',
    title: 'Verifica conferma un certificato attivo',
    description: 'La verifica risponde a una domanda precisa: questo codice corrisponde a un certificato USG attivo e a quale profilo pubblicato appartiene?',
    cards: [
      { label: 'Codice', title: 'Si controlla un certificato specifico', body: 'Senza un codice valido non è possibile confermare un certificato.' },
      { label: 'Confine', title: 'La verifica non giudica tutti i Cane Corso', body: 'Se un cane non ha certificato, non significa automaticamente che non sia un vero Cane Corso.' },
      { label: 'Percorso', title: 'Il proprietario lavora prima nell’area privata', body: 'Il profilo viene preparato, inviato e revisionato prima che la verifica pubblica diventi rilevante.' },
    ],
    nextLabel: 'Apri la verifica',
    nextHref: '/verify',
    nextText: 'Inserisci un codice solo quando hai un certificato USG emesso o un numero certificato pubblico.',
  },
  knowledge: {
    eyebrow: 'Cosa contiene Conoscenze',
    title: 'Conoscenze è il centro educativo per Cane Corso e per l’idea USG',
    description: 'Raccoglie storia, standard, salute, comportamento, foto per revisione, certificato USG e quadro osservativo Bulgarico.',
    cards: [
      { label: 'Razza', title: 'Storia, standard e struttura', body: 'Aiuta il proprietario a capire cosa osserva e cosa conta nel Cane Corso.' },
      { label: 'Pratica', title: 'Preparazione del profilo', body: 'Spiega quali dati, foto e informazioni genealogiche sono utili prima della revisione.' },
      { label: 'USG', title: 'Idea, certificato e limiti', body: 'Separa le osservazioni USG dagli standard ufficiali e non presenta ipotesi come fatti.' },
    ],
    nextLabel: 'Apri gli articoli',
    nextHref: '/knowledge',
    nextText: 'Questa è la sezione migliore quando cerchi informazioni prima di agire.',
  },
  faq: {
    eyebrow: 'Come usare le FAQ',
    title: 'Le FAQ danno risposte brevi sulle decisioni principali della piattaforma',
    description: 'Spiegano le differenze tra Registro, Certificato, Galleria, Comunità, Partner e richieste private.',
    cards: [
      { label: 'Rapido', title: 'Risposta breve prima di un articolo completo', body: 'Le FAQ aiutano quando vuoi una direzione chiara senza leggere un articolo intero.' },
      { label: 'Confini', title: 'Cosa diventa pubblico', body: 'Spiegano perché profili, partner e richieste della comunità non vengono pubblicati automaticamente.' },
      { label: 'Passo successivo', title: 'La risposta porta a un’azione', body: 'Dopo le domande principali dovresti sapere se aprire profilo, Conoscenze, Comunità o Admin.' },
    ],
    nextLabel: 'Leggi le FAQ',
    nextHref: '/faq',
    nextText: 'Usa le FAQ come navigatore rapido quando qualcosa nella piattaforma non è chiaro.',
  },
  community: {
    eyebrow: 'Come funziona la Comunità',
    title: 'La Comunità raccoglie bisogni reali, ma non espone contatti privati senza controllo',
    description: 'Supporta nuovo domicilio, abbinamento riproduttivo, cuccioli, smarrito/trovato, luoghi adatti e servizi. I contatti sensibili passano da un amministratore.',
    cards: [
      { label: 'Intenzione', title: 'Prima scegli il bisogno reale', body: 'Casa, abbinamento, cuccioli, segnalazione, luogo o servizio sono percorsi diversi con responsabilità diverse.' },
      { label: 'Protezione', title: 'I contatti non sono direttamente pubblici', body: 'Nei casi sensibili l’interesse viene inviato dalla piattaforma e l’amministratore decide se collegare le persone.' },
      { label: 'Utilità', title: 'Luoghi e servizi aiutano i proprietari', body: 'La piattaforma può crescere come mappa pratica e directory per la vita con Cane Corso.' },
    ],
    nextLabel: 'Invia o controlla una richiesta',
    nextHref: '/ecosystem',
    nextText: 'Le richieste private si gestiscono dall’area membri e la visibilità pubblica arriva dopo la revisione.',
  },
  partners: {
    eyebrow: 'Come funzionano i Partner',
    title: 'I partner sono una rete verificata di servizi intorno al Cane Corso',
    description: 'Servizi, luoghi e professionisti possono essere utili per proprietari e allevatori, ma la visibilità pubblica passa da approvazione.',
    cards: [
      { label: 'Catalogo', title: 'Sono pubblici i record approvati', body: 'Candidature e servizi non revisionati non devono sembrare raccomandati ufficialmente.' },
      { label: 'Categorie', title: 'I servizi devono essere comprensibili', body: 'Pensione, trasporto, addestramento, veterinaria, negozi e luoghi hanno categoria e posizione chiare.' },
      { label: 'Responsabilità', title: 'Partner non significa garanzia automatica', body: 'USG offre visibilità approvata e struttura, ma l’utente deve comunque valutare ogni servizio con attenzione.' },
    ],
    nextLabel: 'Candidati come partner',
    nextHref: '/partners/apply',
    nextText: 'Candidati solo se il servizio è reale, descritto chiaramente e utile al pubblico Cane Corso.',
  },
  member: {
    eyebrow: 'Cosa contiene l’area privata',
    title: 'Il centro membri mostra le azioni importanti dopo l’accesso',
    description: 'Dopo il login l’utente non dovrebbe rileggere la presentazione pubblica. Deve vedere profili, stati, richieste e il prossimo passo.',
    cards: [
      { label: 'Prima', title: 'Profilo proprietario', body: 'Nome, foto e chiarezza dei contatti aiutano prima di richieste serie e profili dei cani.' },
      { label: 'Principale', title: 'I miei Cane Corso', body: 'Percorso principale per aggiunta, modifica, foto, genealogia e invio per revisione.' },
      { label: 'In più', title: 'Richieste e partnership', body: 'Richieste della comunità e candidature partner hanno stato proprio e non diventano pubbliche automaticamente.' },
    ],
    nextLabel: 'Apri I miei Cane Corso',
    nextHref: '/my-dogs',
    nextText: 'Per la maggior parte dei proprietari, questo è il primo passo più importante.',
  },
  myDogs: {
    eyebrow: 'Cosa compilare',
    title: 'I miei Cane Corso è l’area di lavoro per profili, foto e revisione',
    description: 'Ogni profilo deve guidare il proprietario: dati, foto, genealogia, prontezza, invio, stato e visibilità pubblica.',
    cards: [
      { label: 'Dati', title: 'Identità di base', body: 'Nome, sesso, colore, data di nascita, località e microchip/pedigree se disponibili.' },
      { label: 'Foto', title: '1–3 foto forti', body: 'L’immagine principale deve mostrare chiaramente il cane. Le foto aggiuntive aiutano la revisione.' },
      { label: 'Stato', title: 'Bozza, inviato, restituito o pubblicato', body: 'L’utente deve capire perché il profilo non è ancora pubblico e cosa fare.' },
    ],
    nextLabel: 'Aggiungi Cane Corso',
    nextHref: '/my-dogs/new',
    nextText: 'Inizia dai dati principali, poi aggiungi immagini e informazioni genealogiche.',
  },
  profile: {
    eyebrow: 'Perché il profilo proprietario conta',
    title: 'Il proprietario dà contesto e fiducia ai profili inviati',
    description: 'Non è un social network pubblico. I dati aiutano USG a capire chi invia un profilo, come contattarlo e cosa può diventare pubblico.',
    cards: [
      { label: 'Identità', title: 'Nome e presentazione', body: 'Il profilo deve essere chiaro senza esporre informazioni personali inutili.' },
      { label: 'Contatto', title: 'Raggiungibilità quando serve', body: 'Il contatto aiuta moderazione, correzioni, partnership e richieste sensibili della comunità.' },
      { label: 'Privacy', title: 'Non tutto è pubblico', body: 'La piattaforma deve proteggere i dati personali e mostrare solo le informazioni pubbliche necessarie.' },
    ],
    nextLabel: 'Modifica profilo',
    nextHref: '/profile',
    nextText: 'Controlla il profilo prima di inviare Cane Corso o richieste della comunità.',
  },
  ecosystemWorkspace: {
    eyebrow: 'Cosa sono le mie richieste',
    title: 'Qui gestisci bisogni della comunità, luoghi e contatti sensibili',
    description: 'L’area membri dell’ecosistema conserva lo stato di ogni richiesta: bozza, inviata, restituita, approvata, pubblicata o archiviata.',
    cards: [
      { label: 'Sensibile', title: 'Casa, cuccioli e riproduzione passano da admin', body: 'Questi record non devono esporre contatti diretti o collegare persone automaticamente.' },
      { label: 'Utile', title: 'Luoghi e servizi possono diventare pubblici', body: 'Luoghi e servizi utili diventano visibili dopo revisione e categoria chiara.' },
      { label: 'Stato', title: 'Segui cosa attende decisione', body: 'Le richieste restituite devono essere modificate, quelle pubblicate sono già visibili.' },
    ],
    nextLabel: 'Crea richiesta',
    nextHref: '/ecosystem',
    nextText: 'Scegli il tipo secondo il bisogno reale e invia solo informazioni sicure per la revisione.',
  },
  partnerApply: {
    eyebrow: 'Cos’è una candidatura partner',
    title: 'La partnership è un servizio pubblico revisionato, non pubblicità comune',
    description: 'La candidatura deve mostrare cosa offri, dove lavori, come le persone ti contattano e perché è utile al pubblico Cane Corso.',
    cards: [
      { label: 'Chiarezza', title: 'Categoria, località e descrizione', body: 'Gli utenti devono capire subito cosa offri e per chi è adatto.' },
      { label: 'Fiducia', title: 'L’approvazione passa da un amministratore', body: 'La visibilità pubblica arriva solo dopo revisione e non deve confondersi con la popolarità della comunità.' },
      { label: 'Qualità', title: 'Meno partner, ma più significativi', body: 'L’obiettivo è una rete utile per Cane Corso, non una directory senza controllo.' },
    ],
    nextLabel: 'Compila candidatura',
    nextHref: '/partners/apply',
    nextText: 'Prepara descrizione reale, categoria, località e contatti prima dell’invio.',
  },
  adminDashboard: {
    eyebrow: 'Centro di comando admin',
    title: 'L’amministratore deve vedere cosa attende decisione, non solo un menu',
    description: 'Questa sezione porta a profili in revisione, controllo del Registro, partner, richieste ecosistema, Conoscenze e utenti.',
    cards: [
      { label: 'Priorità', title: 'Prima le decisioni in attesa', body: 'Profili, certificati, partnership e richieste sensibili devono restare chiaramente separati.' },
      { label: 'Responsabilità', title: 'Ogni azione ha effetto pubblico', body: 'Pubblicazione, certificazione, revoca e approvazione devono restare tracciabili.' },
      { label: 'Confine', title: 'Admin non è automazione', body: 'Il sistema aiuta, ma la decisione finale resta giudizio umano.' },
    ],
    nextLabel: 'Apri Revisione',
    nextHref: '/review',
    nextText: 'I profili in attesa di revisione sono la priorità amministrativa più comune.',
  },
  review: {
    eyebrow: 'Cosa decide Revisione',
    title: 'Revisione è il luogo del giudizio umano prima della visibilità pubblica',
    description: 'L’amministratore decide se un profilo è pronto, richiede correzioni, può essere pubblicato o può ricevere un certificato USG separato.',
    cards: [
      { label: 'Prontezza', title: 'Prima il profilo', body: 'Dati principali, foto, proprietario, genealogia e coerenza con le regole vengono controllati.' },
      { label: 'Decisione', title: 'Pubblicazione e certificato sono separati', body: 'Un profilo può essere pubblicato senza ricevere un certificato.' },
      { label: 'Comunicazione', title: 'Le correzioni devono essere chiare', body: 'Se un profilo torna indietro, il proprietario deve capire cosa manca.' },
    ],
    nextLabel: 'Apri controllo Registro',
    nextHref: '/admin/registry',
    nextText: 'Dopo la pubblicazione, il controllo continua nel Registro amministrativo.',
  },
  adminRegistry: {
    eyebrow: 'Controllo admin del Registro',
    title: 'Qui si gestiscono profili pubblicati e azioni sui certificati',
    description: 'È il livello di controllo dopo la moderazione: record pubblici, rimozione dal Registro, emissione o revoca del certificato.',
    cards: [
      { label: 'Pubblico', title: 'Ogni modifica si vede fuori', body: 'Un profilo pubblicato influenza Registro, Verifica, Galleria e superfici di fiducia.' },
      { label: 'Certificato', title: 'Emettere solo con motivo chiaro', body: 'Il certificato è separato dalla pubblicazione e deve restare tracciabile.' },
      { label: 'Revoca', title: 'Anche la revoca è seria', body: 'Rimuovere dal Registro o revocare un certificato deve avere motivo e traccia.' },
    ],
    nextLabel: 'Torna a Revisione',
    nextHref: '/review',
    nextText: 'I nuovi profili devono passare da Revisione prima di arrivare a questo controllo.',
  },
  adminPartners: {
    eyebrow: 'Controllo admin dei partner',
    title: 'Le candidature partner vengono controllate prima del catalogo pubblico',
    description: 'Si valuta se il servizio è reale, chiaro, adatto al pubblico Cane Corso e sicuro per la visibilità pubblica.',
    cards: [
      { label: 'Controllo', title: 'Revisione prima della visibilità', body: 'Un partner non deve apparire approvato finché la candidatura non è stata revisionata.' },
      { label: 'Sincronia', title: 'I servizi approvati possono apparire nell’ecosistema', body: 'Il catalogo partner e i servizi dell’ecosistema devono restare allineati.' },
      { label: 'Qualità', title: 'Il catalogo deve restare utile', body: 'Pochi partner verificati sono meglio di molti record poco chiari.' },
    ],
    nextLabel: 'Apri Partner pubblici',
    nextHref: '/partners',
    nextText: 'La pagina pubblica mostra il risultato dei record approvati.',
  },
  adminEcosystem: {
    eyebrow: 'Controllo admin dell’ecosistema',
    title: 'Le richieste dell’ecosistema hanno sensibilità e regole diverse',
    description: 'Casa, riproduzione, cuccioli e Cane Corso smarrito/trovato non sono annunci comuni. Richiedono moderazione attenta e protezione dei contatti.',
    cards: [
      { label: 'Sensibili', title: 'Non collegare automaticamente le persone', body: 'L’amministratore decide quando e se è sicuro mediare tra le parti.' },
      { label: 'Pubblici', title: 'Luoghi e servizi possono aiutare tutti', body: 'I record utili diventano pubblici dopo revisione e categoria chiara.' },
      { label: 'Archivio', title: 'Ciò che non è più attuale va chiuso', body: 'Segnalazioni e richieste non più valide non devono restare attive.' },
    ],
    nextLabel: 'Vedi Comunità pubblica',
    nextHref: '/community',
    nextText: 'La sezione pubblica deve mostrare solo informazioni verificate e sicure.',
  },
  adminKnowledge: {
    eyebrow: 'Controllo admin delle Conoscenze',
    title: 'Le Conoscenze sono autorità educativa e devono restare prudenti',
    description: 'Gli articoli su Cane Corso, USG e Bulgarico devono essere utili, onesti e separati dagli standard ufficiali o da affermazioni di club.',
    cards: [
      { label: 'Autorità', title: 'Fonti ufficiali e osservazioni USG sono separate', body: 'FCI/AKC/UKC/storia e quadri osservativi USG non devono essere mischiati come fatti equivalenti.' },
      { label: 'Tono', title: 'Nessun attacco ad allevatori o proprietari', body: 'La piattaforma spiega, osserva ed educa senza attaccare linee o paesi.' },
      { label: 'Processo', title: 'La scrittura resta controllata', body: 'Finché non esiste un CMS completo, l’area admin serve per governance e revisione contenuti.' },
    ],
    nextLabel: 'Apri Conoscenze',
    nextHref: '/knowledge',
    nextText: 'Gli articoli pubblici devono sembrare completi e non promettere più di ciò che è supportato.',
  },
  adminMembers: {
    eyebrow: 'Controllo admin degli utenti',
    title: 'Gli utenti sono collegati a profili, richieste e fiducia',
    description: 'Questa area aiuta a controllare ruoli membro/admin/partner, proprietà dei profili e gestione sicura dei dati.',
    cards: [
      { label: 'Ruoli', title: 'Il ruolo determina l’accesso', body: 'Membro, partner e amministratore non devono vedere le stesse azioni.' },
      { label: 'Proprietà', title: 'I profili hanno un proprietario reale', body: 'Profili Cane Corso, foto e richieste devono restare collegati all’utente corretto.' },
      { label: 'Privacy', title: 'I dati personali sono protetti', body: 'L’amministratore deve gestire con attenzione contatti e visibilità pubblica.' },
    ],
    nextLabel: 'Vai al centro admin',
    nextHref: '/admin',
    nextText: 'Usa l’area utenti come controllo di supporto, non come scorciatoia verso la pubblicità.',
  },
};

const copyByLocale: Record<Locale, ContentMap> = { bg, en, it };

interface SectionContentGuidePanelProps {
  locale: Locale;
  surface: SectionContentSurface;
  className?: string;
}

export function SectionContentGuidePanel({ locale, surface, className }: SectionContentGuidePanelProps) {
  const copy = (copyByLocale[locale] ?? copyByLocale.en)[surface];

  return (
    <section className={`content-card section-content-guide section-content-guide--${surface}${className ? ` ${className}` : ''}`} aria-label={copy.title}>
      <div className="section-content-guide__intro">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <div className="section-content-guide__cards">
        {copy.cards.map((card) => (
          <article className="section-content-guide__card" key={`${surface}-${card.label}-${card.title}`}>
            <span>{card.label}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
      <div className="section-content-guide__next">
        <p>{copy.nextText}</p>
        <Link href={copy.nextHref} className="button-secondary small">
          {copy.nextLabel}
        </Link>
      </div>
    </section>
  );
}
