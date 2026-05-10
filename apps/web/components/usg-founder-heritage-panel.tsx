import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type HeritageVariant = 'full' | 'compact';

type HeritageDog = {
  id: string;
  name: string;
  identity: string;
  imageSrc: string;
  imageAlt: Record<Locale, string>;
  role: Record<Locale, string>;
  note: Record<Locale, string>;
};

type HeritageStorySection = {
  title: string;
  paragraphs: readonly string[];
};

const heritageDogs: readonly HeritageDog[] = [
  {
    id: 'mark-i',
    name: 'Mark I',
    identity: 'Mark I di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/mark-i.jpg',
    imageAlt: {
      en: 'Portrait of Mark I, the first Cane Corso in the personal USG heritage archive.',
      bg: 'Портрет на Mark I — първото Cane Corso в личния USG архив.',
      it: 'Ritratto di Mark I, il primo Cane Corso nell’archivio personale USG.',
    },
    role: {
      en: 'The beginning',
      bg: 'Началото',
      it: 'L’inizio',
    },
    note: {
      en: 'The last puppy that became the first chapter — the Cane Corso that changed Stefan Tananov’s path.',
      bg: 'Последното кученце, което стана първа глава — Cane Corso-то, което промени пътя на Стефан Тананов.',
      it: 'L’ultimo cucciolo diventato il primo capitolo — il Cane Corso che cambiò il percorso di Stefan Tananov.',
    },
  },
  {
    id: 'hera',
    name: 'Hera',
    identity: 'Hera di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/hera.jpg',
    imageAlt: {
      en: 'Portrait of Hera from the personal USG Cane Corso archive.',
      bg: 'Портрет на Hera от личния USG Cane Corso архив.',
      it: 'Ritratto di Hera dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The matriarch',
      bg: 'Матриархът',
      it: 'La matriarca',
    },
    note: {
      en: 'Mark I’s inseparable companion and the motherly heart of the personal archive.',
      bg: 'Неразделната половинка на Mark I и майчиното сърце на личния архив.',
      it: 'La compagna inseparabile di Mark I e il cuore materno dell’archivio personale.',
    },
  },
  {
    id: 'thor',
    name: 'Thor',
    identity: 'Thor di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/thor.jpg',
    imageAlt: {
      en: 'Standing portrait of Thor from the personal USG Cane Corso archive.',
      bg: 'Портрет в стойка на Thor от личния USG Cane Corso архив.',
      it: 'Ritratto in posa di Thor dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The sand presence',
      bg: 'Пясъчното присъствие',
      it: 'La presenza fulva',
    },
    note: {
      en: 'The fawn Cane Corso from the period of searching, color observation, and deeper breed curiosity.',
      bg: 'Пясъчният Cane Corso от периода на търсене, цветови наблюдения и по-дълбоко любопитство към породата.',
      it: 'Il Cane Corso fulvo del periodo di ricerca, osservazione dei colori e curiosità più profonda per la razza.',
    },
  },
  {
    id: 'reia',
    name: 'Reia',
    identity: 'Reia di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/reia.jpg',
    imageAlt: {
      en: 'Portrait of Reia from the personal USG Cane Corso archive.',
      bg: 'Портрет на Reia от личния USG Cane Corso архив.',
      it: 'Ritratto di Reia dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'The balance beside Thor',
      bg: 'Балансът до Thor',
      it: 'L’equilibrio accanto a Thor',
    },
    note: {
      en: 'Thor’s companion and the female balance in the second strong Cane Corso pair.',
      bg: 'Другарчето на Thor и женският баланс във втората силна Cane Corso двойка.',
      it: 'La compagna di Thor e l’equilibrio femminile nella seconda forte coppia Cane Corso.',
    },
  },
  {
    id: 'mark-ii',
    name: 'Mark II',
    identity: 'Mark II di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/mark-ii.jpg',
    imageAlt: {
      en: 'Portrait of Mark II, son of Mark I and Hera, from the personal USG archive.',
      bg: 'Портрет на Mark II, син на Mark I и Hera, от личния USG архив.',
      it: 'Ritratto di Mark II, figlio di Mark I e Hera, dall’archivio personale USG.',
    },
    role: {
      en: 'The continuation',
      bg: 'Продължението',
      it: 'La continuazione',
    },
    note: {
      en: 'Kept from Mark I and Hera as the living continuation of the first chapter.',
      bg: 'Оставен от Mark I и Hera като живото продължение на първата глава.',
      it: 'Tenuto da Mark I ed Hera come continuazione viva del primo capitolo.',
    },
  },
  {
    id: 'ara',
    name: 'Ara',
    identity: 'Ara di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/ara.jpg',
    imageAlt: {
      en: 'Portrait of Ara from the personal USG Cane Corso archive.',
      bg: 'Портрет на Ara от личния USG Cane Corso архив.',
      it: 'Ritratto di Ara dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'Beside Mark II',
      bg: 'До Mark II',
      it: 'Accanto a Mark II',
    },
    note: {
      en: 'The companion of Mark II and part of the next personal archive chapter.',
      bg: 'Спътницата на Mark II и част от следващата глава в личния архив.',
      it: 'La compagna di Mark II e parte del capitolo successivo dell’archivio personale.',
    },
  },
  {
    id: 'broly',
    name: 'Broly',
    identity: 'Broly di Casa Tananov',
    imageSrc: '/brand/heritage/di-casa-tananov/broly.jpg',
    imageAlt: {
      en: 'Portrait of Broly from the personal USG Cane Corso archive.',
      bg: 'Портрет на Broly от личния USG Cane Corso архив.',
      it: 'Ritratto di Broly dall’archivio personale Cane Corso USG.',
    },
    role: {
      en: 'Returned home',
      bg: 'Върналият се у дома',
      it: 'Ritornato a casa',
    },
    note: {
      en: 'A son of Mark I and Hera who returned home when he needed care and safety.',
      bg: 'Син на Mark I и Hera, който се върна у дома, когато имаше нужда от грижа и сигурност.',
      it: 'Figlio di Mark I ed Hera, tornato a casa quando aveva bisogno di cura e sicurezza.',
    },
  },
] as const;

const copyByLocale = {
  en: {
    eyebrow: 'USG heritage',
    title: 'The personal Cane Corso path behind USG',
    description:
      'USG did not begin as a sales idea. It began from years of living with Cane Corso, observing the breed, and building respect for character, presence, structure, care, and the bond between owner and dog.',
    disclaimerTitle: 'Personal archive, not a kennel page',
    disclaimer:
      'di Casa Tananov is used here as a personal heritage identity. It does not present USG as a breeder, sales channel, pedigree authority, or official kennel record.',
    archiveTitle: 'Personal Cane Corso archive',
    archiveDescription:
      'These dogs are shown as part of a personal memory and identity layer. They explain the human experience behind the platform without replacing official breed systems or documentation.',
    founderTitle: 'From obsession with the breed to a useful platform',
    founderText:
      'The purpose is simple: turn personal passion into a cleaner, more responsible digital home for owners — with profiles, care history, knowledge, verification, and moderated community usefulness.',
    identityLabel: 'Archive identity',
    openFull: 'Open full heritage archive',
    openPlatform: 'Back to platform',
    storySummary: 'Read Stefan’s story',
    storyHint: 'A personal text opens here only for visitors who want the deeper story.',
    storyTitle: 'From the first Cane to the idea of USG',
    storyLead:
      'This is not a kennel statement. It is the personal path of Stefan Tananov — an owner, enthusiast, and person deeply connected to Cane Corso.',
    storySections: [
      {
        title: 'The accidental beginning',
        paragraphs: [
          'My name is Stefan Tananov. USG did not begin as a business idea. It began from something very simple: since childhood I wanted a dog, but my parents did not allow it.',
          'Later, when I became independent, built a family, and could afford a dog, I needed a guard dog for my warehouse. I knew Rottweilers only roughly as guard dogs. Then, by chance, a friend told me about a dog that someone wanted to give or sell him, but he lived in an apartment and knew such a dog was a serious responsibility.',
          'He said the breed was Cane Corso. That was the first time I heard the name. I started reading, asking, and within about a week I already felt: this is my dog. I drove there without real criteria for sex, size, or choice. When I saw the mother and father, I was honestly startled by their powerful presence, even though there was no aggression. The last promised puppy had not been taken. That is how Mark I came to me.',
        ],
      },
      {
        title: 'Learning with Mark I',
        paragraphs: [
          'When I took Mark I, I did not yet understand what owning a Cane Corso truly meant. I learned by asking the owners of his parents, speaking with veterinarians, reading, and trying to care for him properly.',
          'Mark I grew very well. He became stronger, more powerful, and larger than his brothers, even though he had been the last puppy left. For me that stayed symbolic: sometimes the one left last becomes the one of a kind.',
        ],
      },
      {
        title: 'Hera and the life around them',
        paragraphs: [
          'I started falling in love with the breed. Mark I was no longer just a guard dog for me. He was presence, character, and bond. I wanted him to have a companion, and that is how Hera came into the story.',
          'Mark I and Hera became inseparable. Walks together, the big yard together, everyday life together. Even though they had separate houses, they often chose to sleep together. For me they were not just two dogs. They were a pair.',
        ],
      },
      {
        title: 'Nature, responsibility, and the people test',
        paragraphs: [
          'For me Cane Corso has never been a business. I have never forced the process or treated these dogs as production. I respect natural life and my role has always been to care, protect, help, and keep the Canes healthy and happy.',
          'Over time Hera and Mark I had 57 puppies. I did not sell any of them. I gifted them. But I never gave them randomly. Every person had to pass my personal conversation — how they planned to raise the dog, where it would live, how they understood care, strength, character, and responsibility.',
          'Not everyone who wants a Cane Corso is ready for a Cane Corso. When someone did not give me confidence, I refused. Some people came from other cities and I even covered their travel costs, because it was more important that a Cane Corso did not end up in the wrong home.',
        ],
      },
      {
        title: 'Cane Corso is CANE CORSO',
        paragraphs: [
          'At some point I stopped speaking about Cane Corso as just a dog. I do not say this to insult other breeds or the people who love them. Every bond between a person and a dog is valuable. But for me Cane Corso became something different.',
          'When I speak about mine, I do not say “my dog”. I say “my Cane”. Because for me Cane Corso is strength, calmness, dignity, loyalty, and a presence that is hard to explain.',
        ],
      },
      {
        title: 'Thor, Reia, Mark II, Ara, and Broly',
        paragraphs: [
          'Because of that love I began traveling around Bulgaria to see different colors, types, structures, and expressions of Cane Corso. That is how Thor, the fawn Cane Corso, entered the story. And because Mark I and Hera were a pair, I wanted Thor to have his companion too — Reia.',
          'From Mark I and Hera I kept Mark II. He was the continuation of the first chapter. Later Ara came as his companion. Broly, also a son of Mark I and Hera from another litter, returned home after almost two years because the person I had gifted him to became ill and could no longer care for him.',
          'For me Cane Corso is not given and forgotten. I still keep contact with many people who received a Cane Corso from me. If I learn there is a problem, I try to help. I will never leave my Cane Corso unsupported.',
        ],
      },
      {
        title: 'Why USG exists',
        paragraphs: [
          'My Cane Corso do not have official pedigrees or certificates. That does not mean they are not real to me. Documents matter. Official standards matter. But a Cane Corso is not only a document. It is structure, character, care, history, presence, and a bond with the person.',
          'Over the years I began observing that many Cane Corso in Bulgaria carry the spirit of the breed while sometimes looking different from strict standard frames — often larger or heavier. I do not present this as an official standard. It is a personal observation and a direction for respectful research.',
          'USG — UNICO SUO GENERE — was born from this path: history, care, observation, knowledge, responsibility, and respect for Cane Corso.',
        ],
      },
    ] satisfies readonly HeritageStorySection[],
    storyClosing:
      'This text is personal memory and responsibility. di Casa Tananov is not presented here as a kennel, sales page, or official pedigree authority — it is the name of a personal Cane Corso archive.',
    platformStorySummary: 'How the USG platform idea was born',
    platformStoryHint: 'A separate chapter opens here for visitors who want to understand why the platform exists.',
    platformStoryTitle: 'From trial and error to a Cane Corso ecosystem',
    platformStoryLead:
      'The platform was born from the same owner path: years of searching, asking, learning, and wanting the next Cane Corso owner to have a clearer road.',
    platformStorySections: [
      {
        title: 'The missing complete place',
        paragraphs: [
          'After years with Cane Corso, I understood that there is information about the breed, but it is scattered. There are articles, posts, opinions, and separate publications, yet not one complete place that brings the important things together.',
          'For a person who starts seriously, this becomes difficult. You search in many places, compare opinions, ask people, speak with veterinarians, learn from mistakes, and slowly build your own understanding.',
        ],
      },
      {
        title: 'Why I decided to learn and build it',
        paragraphs: [
          'I did not want every Cane Corso owner to discover everything the hard way, the way I had to — by trial and error, reading, asking, and experience. That is why I decided to learn how to build a system online.',
          'The goal was not just to make a website. The goal was to create a real Cane Corso ecosystem: information about the breed, guidance for owners, profiles and history for the dogs, health and growth tracking, and useful services around them.',
        ],
      },
      {
        title: 'The USG ecosystem',
        paragraphs: [
          'USG is meant to be a place only for Cane Corso and the people around them — owners, future owners, services, clinics, hotels, shops, pet-friendly places, and partners who understand the responsibility of large breeds.',
          'I want it to be easier for people to be informed, guided, and supported. Not lost between random information, but able to find knowledge, tools, care history, services, and community usefulness in one place.',
        ],
      },
    ] satisfies readonly HeritageStorySection[],
    platformStoryClosing:
      'This is why USG exists as a platform: to turn a difficult personal learning path into a clearer, more useful, and more responsible Cane Corso ecosystem for others.',
    chips: ['Owner experience', 'Personal archive', 'Cane Corso only'],
  },
  bg: {
    eyebrow: 'USG наследство',
    title: 'Личният Cane Corso път зад USG',
    description:
      'USG не започва като идея за продажби. Започва от години живот с Cane Corso, наблюдение върху породата и уважение към характер, присъствие, структура, грижа и връзката между човек и куче.',
    disclaimerTitle: 'Личен архив, не развъдник',
    disclaimer:
      'di Casa Tananov се използва тук като лична heritage идентичност. Тази секция не представя USG като развъдник, канал за продажби, родословна власт или официален kennel запис.',
    archiveTitle: 'Личен Cane Corso архив',
    archiveDescription:
      'Тези Cane Corso са показани като част от лична памет и идентичност. Те обясняват човешкия опит зад платформата, без да заменят официални породни системи или документи.',
    founderTitle: 'От обсебеност по породата към полезна платформа',
    founderText:
      'Целта е проста: личната страст да се превърне в по-чист, по-отговорен дигитален дом за собственици — с профили, история на грижата, знания, проверка и модерирана общностна полезност.',
    identityLabel: 'Архивна идентичност',
    openFull: 'Отвори целия архив',
    openPlatform: 'Към платформата',
    storySummary: 'Прочети историята на Стефан',
    storyHint: 'Историята се отваря само ако посетителят иска да прочете повече.',
    storyTitle: 'От първото Cane до идеята за USG',
    storyLead:
      'Това не е текст на развъдник. Това е личният път на Стефан Тананов — собственик, любител и човек, дълбоко свързан с Cane Corso.',
    storySections: [
      {
        title: 'Случайното начало',
        paragraphs: [
          'Казвам се Стефан Тананов. USG не започна като бизнес идея. Започна много по-просто — от желание, което носех още от малък: да имам куче.',
          'Като дете винаги съм искал куче, но родителите ми не позволяваха. По-късно, когато вече бях самостоятелен, имах семейство и можех сам да решавам какво ще правя, отново се върнах към тази идея. Тогава ми трябваше куче пазач за склада. Познавах бегло Ротвайлер като пазач, но не знаех почти нищо за Cane Corso.',
          'По една случайност мой приятел ми каза за куче, което искали да му дадат или продадат. Той живееше в апартамент и знаеше, че такова куче е голяма отговорност. Тогава за първи път чух името Cane Corso. Започнах да чета и само за около седмица вече знаех, че това е моето куче. Запалих колата и отидох. Нямах претенции за пол, размер или избор — тогава още не разбирах породата. Когато видях майката и бащата, честно казано се стреснах. Нямаше агресия, но присъствието им беше мощно. Последното обещано кученце не беше взето. Така при мен дойде Mark I.',
        ],
      },
      {
        title: 'Mark I — първото ми Cane',
        paragraphs: [
          'Когато взех Mark I, още не знаех истински за какво става въпрос. Започнах да се уча в движение — питах собствениците на майка му и баща му, консултирах се с ветеринарни лекари, четях много материали и се опитвах да се грижа за него правилно.',
          'Mark I растеше много добре. С времето стана по-силен, по-мощен и по-голям от братята си. А беше последното останало кученце — онова, което никой не беше избрал първо. За мен това остана символично: понякога най-малкото и последното се оказва най-най.',
        ],
      },
      {
        title: 'Hera — когато пазачът стана семейство',
        paragraphs: [
          'С времето започнах да се влюбвам в породата. Mark I вече не беше просто куче пазач. Той беше присъствие, характер и връзка. Исках да има другарче, затова купих Hera.',
          'Mark I и Hera свикнаха един с друг естествено. Станаха неразделни — заедно на разходки, заедно в големия двор, заедно в ежедневието. Имаха отделни къщички, но често избираха да спят заедно. За мен те не бяха просто две Cane Corso. Те бяха двойка.',
        ],
      },
      {
        title: 'Природа, грижа и личен тест за хората',
        paragraphs: [
          'За мен Cane Corso никога не е било бизнес. Не съм гледал на тях като на производство. Никога не съм връзвал Cane Corso и не съм насилвал процесите. Вярвам, че трябва да живеят естествено, спокойно и щастливо. Моята роля е да се грижа, да пазя, да помагам и Canetata да са добре.',
          'С времето Hera роди от Mark I общо 57 малки Cane Corso. Нито едно не съм продал. Всички съм подарил. Но никога не съм ги давал безразборно.',
          'Всеки човек минаваше през мой разговор — как смята да гледа кучето, къде ще живее, как разбира грижата, характера, силата и отговорността на Cane Corso. Не всеки, който иска Cane Corso, е готов за Cane Corso. Ако човек не ми вдъхваше сигурност, отказвах. Имало е хора от други градове, на които съм покривал пътните разходи, защото за мен беше по-важно Cane Corso-то да не попадне на неподходящо място.',
        ],
      },
      {
        title: 'Cane Corso не е просто куче',
        paragraphs: [
          'В един момент се обсебих от породата в добрия смисъл. За мен Cane Corso вече не беше просто куче. Не го казвам, за да обидя други породи или хората, които ги обичат. Всяка връзка между човек и куче е ценна. Но за мен Cane Corso застана на друго място.',
          'Когато говоря за моето Cane Corso, аз не казвам просто „кучето ми“. Казвам „Cane-то ми“. Защото за мен Cane Corso е CANE CORSO — сила, спокойствие, характер, достойнство, лоялност и присъствие, което трудно се обяснява.',
        ],
      },
      {
        title: 'Thor, Reia, Mark II, Ara и Broly',
        paragraphs: [
          'От любовта към породата започнах да обикалям България, за да видя различните цветове, типове, структури и лица на Cane Corso. Така в историята дойде Thor — пясъчният Cane Corso. А понеже Mark I и Hera бяха двойка, исках и Thor да има другарче. Така дойде Reia.',
          'От Mark I и Hera оставих при себе си Mark II — продължението на първата глава. За него купих Ara. Broly също е син на Mark I и Hera, от друго кучило. Бях го подарил, но след близо две години човекът, на когото го дадох, се разболя и вече не можеше да се грижи за него. Тогава си го прибрах.',
          'За мен Cane Corso не се дава и забравя. Все още поддържам връзка с много хора, на които съм подарил Cane Corso. Ако разбера, че има проблем, гледам да помогна. Никога няма да си оставя Cane Corso-то.',
        ],
      },
      {
        title: 'Защо се роди USG',
        paragraphs: [
          'Моите Cane Corso нямат официално родословие и сертификати. Но за мен това не означава, че не са истински. Документите имат стойност. Стандартите имат значение. Но едно Cane Corso не се състои само от документ. То има структура, характер, история, грижа, присъствие и връзка с човека.',
          'С годините започнах да забелязвам, че в България има Cane Corso, които носят духа на породата, но често са по-различни от строгите рамки на стандарта — понякога по-едри, по-тежки, с различно присъствие. Не го представям като официален стандарт. Това е лично наблюдение и посока за честно, уважително изследване.',
          'Точно от този път се роди USG — UNICO SUO GENERE: история, грижа, наблюдение, знание, отговорност и уважение към Cane Corso.',
        ],
      },
    ] satisfies readonly HeritageStorySection[],
    storyClosing:
      'Този текст е лична памет и отговорност. di Casa Tananov не е представено като развъдник, продажбена страница или официална родословна власт — това е името на личния Cane Corso архив зад USG.',
    platformStorySummary: 'Как се роди идеята за платформата',
    platformStoryHint: 'Отделна глава се отваря само ако посетителят иска да разбере защо съществува USG.',
    platformStoryTitle: 'От проба-грешка към Cane Corso екосистема',
    platformStoryLead:
      'Идеята за платформата се роди от същия личен път — години питане, четене, опит, грешки и желание следващият собственик на Cane Corso да има по-ясен път.',
    platformStorySections: [
      {
        title: 'Липсваше едно цялостно място',
        paragraphs: [
          'След години с Cane Corso разбрах, че информация за породата има, но тя е разпръсната. Има статии, има публикации, има отделни мнения и материали, но липсваше едно място, което да събира всичко важно около Cane Corso.',
          'Когато човек започне да търси сериозно, пътят не е лесен. Четеш на много места, питаш различни хора, сравняваш мнения, консултираш се, грешиш, пробваш и малко по малко си изграждаш собствено разбиране.',
        ],
      },
      {
        title: 'Затова реших да уча',
        paragraphs: [
          'Аз минах през много неща по трудния начин — с питане, четене, проба-грешка, ветеринарни консултации и личен опит. И в един момент си казах, че не е нужно всеки собственик на Cane Corso да започва от нулата като мен.',
          'Затова реших да уча, за да мога да изградя такава система в интернет. Не просто сайт, а платформа, която да направи пътя по-лесен, по-ясен и по-информиран за хората, които обичат Cane Corso.',
        ],
      },
      {
        title: 'Какво искам да бъде USG',
        paragraphs: [
          'Идеята ми беше цялостна екосистема само за Cane Corso и за собственици — информация за породата, насоки за отглеждане, профили и история на самите Cane Corso, снимки, развитие, здраве, ваксини и проследяване на грижата.',
          'Искам в тази екосистема да има и полезни услуги около породата: хотели и boarding за големи породи, ветеринарни клиники, магазини, pet-friendly места, партньори и хора, които разбират какво означава Cane Corso.',
          'За мен USG трябва да е място, където човек не се лута между случайни статии и непълна информация, а намира знание, инструменти, общност и подкрепа на едно място.',
        ],
      },
    ] satisfies readonly HeritageStorySection[],
    platformStoryClosing:
      'Така личният ми път с Cane Corso започна да се превръща в платформа — не за да бъде всичко около мен, а за да бъде по-лесно, по-ясно и по-полезно за всеки, който носи отговорност към своето Cane.',
    chips: ['Опит като собственик', 'Личен архив', 'Само Cane Corso'],
  },
  it: {
    eyebrow: 'Eredità USG',
    title: 'Il percorso personale Cane Corso dietro USG',
    description:
      'USG non nasce come idea di vendita. Nasce da anni vissuti con il Cane Corso, osservando la razza e rispettando carattere, presenza, struttura, cura e legame tra persona e cane.',
    disclaimerTitle: 'Archivio personale, non pagina di allevamento',
    disclaimer:
      'di Casa Tananov è usato qui come identità personale di heritage. Questa sezione non presenta USG come allevamento, canale di vendita, autorità genealogica o registro kennel ufficiale.',
    archiveTitle: 'Archivio personale Cane Corso',
    archiveDescription:
      'Questi Cane Corso sono mostrati come memoria e identità personale. Spiegano l’esperienza umana dietro la piattaforma senza sostituire sistemi o documenti ufficiali.',
    founderTitle: 'Dalla passione per la razza a una piattaforma utile',
    founderText:
      'Lo scopo è semplice: trasformare la passione personale in una casa digitale più chiara e responsabile per owner — profili, cura, conoscenza, verifica e community moderata.',
    identityLabel: 'Identità archivio',
    openFull: 'Apri archivio completo',
    openPlatform: 'Torna alla piattaforma',
    storySummary: 'Leggi la storia di Stefan',
    storyHint: 'Il testo resta chiuso e si apre solo se il visitatore vuole approfondire.',
    storyTitle: 'Dal primo Cane all’idea di USG',
    storyLead:
      'Non è un testo da allevamento. È il percorso personale di Stefan Tananov — owner, appassionato e persona profondamente legata al Cane Corso.',
    storySections: [
      {
        title: 'L’inizio per caso',
        paragraphs: [
          'Mi chiamo Stefan Tananov. USG non nasce come idea commerciale. Nasce da un desiderio semplice: fin da bambino volevo un cane, ma i miei genitori non me lo permettevano.',
          'Più tardi, quando ero indipendente, avevo una famiglia e potevo permettermi un cane, cercavo un cane da guardia per il magazzino. Conoscevo solo in modo generale il Rottweiler. Poi, per caso, un amico mi parlò di un Cane Corso che non poteva prendere perché viveva in appartamento e sapeva che era una grande responsabilità.',
          'Fu la prima volta che sentii il nome Cane Corso. Iniziai a leggere e in circa una settimana sentii che era il mio cane. Andai a prenderlo senza criteri precisi. Quando vidi madre e padre rimasi colpito dalla loro presenza potente, senza aggressività. L’ultimo cucciolo promesso non era stato preso. Così arrivò Mark I.',
        ],
      },
      {
        title: 'Imparare con Mark I',
        paragraphs: [
          'Con Mark I imparai strada facendo: chiedevo ai proprietari dei suoi genitori, parlavo con veterinari, leggevo e cercavo di prendermi cura di lui nel modo giusto.',
          'Cresceva forte, potente e più grande dei fratelli, anche se era l’ultimo cucciolo rimasto. Per me è rimasto un simbolo: a volte ciò che resta per ultimo diventa unico.',
        ],
      },
      {
        title: 'Hera e la vita insieme',
        paragraphs: [
          'Mi innamorai sempre di più della razza. Mark I non era più solo un cane da guardia. Era presenza, carattere e legame. Volevo una compagna per lui, e così arrivò Hera.',
          'Mark I e Hera divennero inseparabili: passeggiate insieme, grande cortile insieme, vita quotidiana insieme. Avevano case separate, ma spesso dormivano insieme. Per me erano una coppia.',
        ],
      },
      {
        title: 'Natura, cura e responsabilità',
        paragraphs: [
          'Per me Cane Corso non è mai stato un business. Non ho mai forzato i processi e non li ho mai trattati come produzione. Il mio ruolo era curare, proteggere, aiutare e fare stare bene i miei Cane.',
          'Nel tempo Hera e Mark I ebbero 57 cuccioli. Non ne ho venduto nessuno. Li ho regalati, ma mai senza criterio. Ogni persona doveva parlare con me: come avrebbe cresciuto il cane, dove avrebbe vissuto, come capiva cura, forza, carattere e responsabilità.',
          'Non tutti quelli che vogliono un Cane Corso sono pronti per un Cane Corso. Se una persona non mi dava fiducia, rifiutavo. A volte ho anche coperto le spese di viaggio, perché era più importante che un Cane Corso non finisse nel posto sbagliato.',
        ],
      },
      {
        title: 'Cane Corso è CANE CORSO',
        paragraphs: [
          'A un certo punto per me Cane Corso non era semplicemente un cane. Non lo dico per offendere altre razze o chi le ama. Ogni legame è prezioso. Ma per me Cane Corso diventò qualcosa di diverso.',
          'Quando parlo del mio, non dico solo “il mio cane”. Dico “il mio Cane”. Perché Cane Corso è forza, calma, carattere, dignità, lealtà e una presenza difficile da spiegare.',
        ],
      },
      {
        title: 'Thor, Reia, Mark II, Ara e Broly',
        paragraphs: [
          'Cominciai a viaggiare in Bulgaria per osservare colori, tipi, strutture e presenze diverse. Così arrivò Thor, il Cane Corso fulvo. E poiché Mark I e Hera erano una coppia, volevo una compagna anche per Thor: Reia.',
          'Da Mark I e Hera tenni Mark II. Poi arrivò Ara come sua compagna. Broly, figlio di Mark I e Hera da un altro parto, tornò a casa dopo quasi due anni perché la persona a cui lo avevo regalato si ammalò e non poteva più occuparsi di lui.',
          'Per me un Cane Corso non si dà e si dimentica. Mantengo ancora contatti con molte persone a cui ho regalato Cane Corso. Se so che c’è un problema, provo ad aiutare. Non lascerò mai il mio Cane Corso senza supporto.',
        ],
      },
      {
        title: 'Perché esiste USG',
        paragraphs: [
          'I miei Cane Corso non hanno pedigree o certificati ufficiali. Per me questo non significa che non siano veri. I documenti e gli standard contano, ma un Cane Corso non è solo un documento: è struttura, carattere, storia, cura, presenza e legame.',
          'Negli anni ho osservato in Bulgaria Cane Corso con lo spirito della razza ma talvolta diversi dai limiti rigidi dello standard. Non lo presento come standard ufficiale, ma come osservazione personale e ricerca rispettosa.',
          'Da questo percorso nasce USG — UNICO SUO GENERE: storia, cura, osservazione, conoscenza, responsabilità e rispetto per il Cane Corso.',
        ],
      },
    ] satisfies readonly HeritageStorySection[],
    storyClosing:
      'Questo testo è memoria personale e responsabilità. di Casa Tananov non è presentato come allevamento, vendita o autorità genealogica ufficiale — è il nome dell’archivio personale Cane Corso dietro USG.',
    platformStorySummary: 'Come è nata l’idea della piattaforma',
    platformStoryHint: 'Un capitolo separato si apre solo se il visitatore vuole capire perché esiste USG.',
    platformStoryTitle: 'Dalla prova ed errore a un ecosistema Cane Corso',
    platformStoryLead:
      'L’idea della piattaforma nasce dallo stesso percorso personale: anni di domande, letture, esperienza e desiderio di dare al prossimo owner Cane Corso una strada più chiara.',
    platformStorySections: [
      {
        title: 'Mancava un luogo completo',
        paragraphs: [
          'Dopo anni con Cane Corso ho capito che esistono informazioni sulla razza, ma sono sparse: articoli, pubblicazioni, opinioni e materiali separati. Mancava un luogo che raccogliesse ciò che conta davvero.',
          'Chi cerca seriamente deve leggere in molti posti, chiedere, confrontare opinioni, parlare con professionisti, sbagliare e costruire piano piano la propria comprensione.',
        ],
      },
      {
        title: 'Per questo ho deciso di studiare',
        paragraphs: [
          'Io ho imparato molte cose nel modo difficile: domande, letture, prova ed errore, consulenze veterinarie ed esperienza personale. Non volevo che ogni owner Cane Corso dovesse iniziare da zero come me.',
          'Per questo ho deciso di studiare e imparare a costruire un sistema online. Non solo un sito, ma una piattaforma che renda il percorso più semplice, chiaro e informato per chi ama il Cane Corso.',
        ],
      },
      {
        title: 'Cosa deve essere USG',
        paragraphs: [
          'L’idea è un ecosistema completo solo per Cane Corso e owner: informazioni sulla razza, guida alla cura, profili e storia dei Cane Corso, foto, crescita, salute, vaccini e tracciamento della cura.',
          'Dentro questo ecosistema devono esserci anche servizi utili: hotel e boarding per razze grandi, cliniche veterinarie, negozi, luoghi pet-friendly, partner e persone che comprendono cosa significa Cane Corso.',
          'USG deve essere un luogo dove non ci si perde tra informazioni casuali, ma si trovano conoscenza, strumenti, community e supporto nello stesso posto.',
        ],
      },
    ] satisfies readonly HeritageStorySection[],
    platformStoryClosing:
      'Così il mio percorso personale con Cane Corso ha iniziato a diventare piattaforma: più chiara, più utile e più responsabile per chi vive con il proprio Cane.',
    chips: ['Esperienza owner', 'Archivio personale', 'Solo Cane Corso'],
  },
} as const;

export function UsgFounderHeritagePanel({ locale, variant = 'compact' }: { locale: Locale; variant?: HeritageVariant }) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const dogs = variant === 'compact' ? heritageDogs.slice(0, 4) : heritageDogs;

  return (
    <section className={`usg-founder-heritage usg-founder-heritage--${variant}`} aria-label={copy.title}>
      <div className="usg-founder-heritage__hero">
        <div className="usg-founder-heritage__copy">
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          <div className="usg-founder-heritage__chips" aria-label={copy.eyebrow}>
            {copy.chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>
        <aside className="usg-founder-heritage__disclaimer">
          <strong>{copy.disclaimerTitle}</strong>
          <span>{copy.disclaimer}</span>
        </aside>
      </div>

      {variant === 'full' ? (
        <>
          <details className="usg-founder-heritage-story">
            <summary className="usg-founder-heritage-story__summary">
              <span>{copy.storySummary}</span>
              <small>{copy.storyHint}</small>
            </summary>
            <article className="usg-founder-heritage-story__body" aria-label={copy.storyTitle}>
              <span className="eyebrow-label">di Casa Tananov</span>
              <h3>{copy.storyTitle}</h3>
              <p className="usg-founder-heritage-story__lead">{copy.storyLead}</p>
              <div className="usg-founder-heritage-story__sections">
                {copy.storySections.map((section) => (
                  <section key={section.title} className="usg-founder-heritage-story__section">
                    <h4>{section.title}</h4>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
              <p className="usg-founder-heritage-story__closing">{copy.storyClosing}</p>
            </article>
          </details>

          <details className="usg-founder-heritage-story usg-founder-heritage-story--platform-origin">
            <summary className="usg-founder-heritage-story__summary">
              <span>{copy.platformStorySummary}</span>
              <small>{copy.platformStoryHint}</small>
            </summary>
            <article className="usg-founder-heritage-story__body" aria-label={copy.platformStoryTitle}>
              <span className="eyebrow-label">UNICO SUO GENERE</span>
              <h3>{copy.platformStoryTitle}</h3>
              <p className="usg-founder-heritage-story__lead">{copy.platformStoryLead}</p>
              <div className="usg-founder-heritage-story__sections">
                {copy.platformStorySections.map((section) => (
                  <section key={section.title} className="usg-founder-heritage-story__section">
                    <h4>{section.title}</h4>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
              <p className="usg-founder-heritage-story__closing">{copy.platformStoryClosing}</p>
            </article>
          </details>
        </>
      ) : null}

      <div className="usg-founder-heritage__archive-head">
        <div>
          <span className="eyebrow-label">di Casa Tananov</span>
          <h3>{copy.archiveTitle}</h3>
          <p>{copy.archiveDescription}</p>
        </div>
        {variant === 'compact' ? (
          <Link href="/heritage" className="button-ghost small">
            {copy.openFull}
          </Link>
        ) : (
          <Link href="/platform" className="button-ghost small">
            {copy.openPlatform}
          </Link>
        )}
      </div>

      <div className="usg-founder-heritage__grid">
        {dogs.map((dog) => (
          <article className="usg-founder-heritage-card" key={dog.id}>
            <div className="usg-founder-heritage-card__media">
              <Image src={dog.imageSrc} alt={dog.imageAlt[locale]} width={1024} height={1024} sizes="(max-width: 760px) 90vw, (max-width: 1200px) 42vw, 310px" />
            </div>
            <div className="usg-founder-heritage-card__body">
              <span className="usg-founder-heritage-card__role">{dog.role[locale]}</span>
              <h4>{dog.name}</h4>
              <p className="usg-founder-heritage-card__identity">
                <span>{copy.identityLabel}</span>
                <strong>{dog.identity}</strong>
              </p>
              <p>{dog.note[locale]}</p>
            </div>
          </article>
        ))}
      </div>

      <article className="usg-founder-heritage__founder-note">
        <span className="eyebrow-label">UNICO SUO GENERE</span>
        <h3>{copy.founderTitle}</h3>
        <p>{copy.founderText}</p>
      </article>
    </section>
  );
}
