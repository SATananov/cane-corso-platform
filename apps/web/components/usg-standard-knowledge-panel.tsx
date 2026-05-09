import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

type GuideCard = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: readonly string[];
  href: string;
  hrefLabel: string;
};

type QuickPanelCopy = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: readonly string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

type GuideCopy = {
  eyebrow: string;
  title: string;
  description: string;
  chips: readonly string[];
  boundaryTitle: string;
  boundaryBody: string;
  cards: readonly GuideCard[];
  sourceTitle: string;
  sourceBody: string;
  sourceLinks: readonly { label: string; href: string }[];
};

const guideCopy: Record<Locale, GuideCopy> = {
  en: {
    eyebrow: 'USG Cane Corso Standard Guide',
    title: 'A practical USG reading of structure, proportions, photos, and review preparation',
    description:
      'This guide keeps the official Cane Corso standard visible while translating it into a calmer owner language. It helps members prepare better profiles and helps admins review them more consistently, without pretending that USG replaces FCI, ENCI, judges, or veterinarians.',
    chips: ['FCI / ENCI first', 'Owner-friendly language', 'USG education layer'],
    boundaryTitle: 'USG boundary',
    boundaryBody:
      'This is an educational and preparation layer. It does not score dogs automatically, does not replace official judge evaluation, and does not turn one photo into proof of quality, health, or value.',
    cards: [
      {
        eyebrow: '01 / Body',
        title: 'Structure and proportions',
        body:
          'Owners should first read balance: a powerful, athletic Cane Corso with a slightly rectangular body, calm presence, and no exaggerated extremes.',
        bullets: [
          'Balance matters more than dramatic exaggeration.',
          'Athletic substance is different from heaviness without function.',
          'Use side-profile photos to read outline, topline, and body proportion.',
        ],
        href: '/faq#official-references',
        hrefLabel: 'See official references',
      },
      {
        eyebrow: '02 / Head',
        title: 'Head and muzzle',
        body:
          'Head reading should stay calm and comparative: expression, muzzle proportion, skull direction, and overall harmony matter more than social-media hype.',
        bullets: [
          'Read head proportion, not only mass.',
          'Avoid turning one screenshot into a final judgment.',
          'Use front and profile head photos when possible.',
        ],
        href: '/knowledge',
        hrefLabel: 'Stay in Knowledge',
      },
      {
        eyebrow: '03 / Bite',
        title: 'Bite is part of the picture, not the whole picture',
        body:
          'Mouth and bite details can matter, but they should be treated carefully and in context. Public platform trust should not become public bite scoring theater.',
        bullets: [
          'Do not isolate bite from the full headpiece and function.',
          'Use this only as a review support clue, not as a public score badge.',
          'When something is unclear, official evaluation matters more than platform speculation.',
        ],
        href: '/faq#certificate-verify',
        hrefLabel: 'Read trust boundaries',
      },
      {
        eyebrow: '04 / Growth',
        title: 'Growth and development',
        body:
          'Puppy and junior growth tables are orientation tools only. Development depends on line, sex, nutrition, health, and individual pace.',
        bullets: [
          'Growth tables are not a diagnosis.',
          'Do not treat one table as absolute truth for every Cane Corso.',
          'For health or growth concerns, the veterinarian stays the real authority.',
        ],
        href: '/faq#privacy-safety',
        hrefLabel: 'Read platform caution',
      },
      {
        eyebrow: '05 / Photos',
        title: 'What photos help the review most',
        body:
          'Good photos reduce confusion. Owners should give the platform a clear side profile, clear head views, and natural presentation before expecting trust or publication.',
        bullets: [
          'One standing side profile.',
          'One front head photo and one profile head photo.',
          'Optional movement or context photo, without heavy filters.',
        ],
        href: '/my-dogs',
        hrefLabel: 'Open My Dogs',
      },
      {
        eyebrow: '06 / Sources',
        title: 'How to read FCI, ENCI, and AKC together',
        body:
          'USG should treat FCI / ENCI as the core reference and use AKC / CCAA material as supporting reading, not as the main authority for the whole platform.',
        bullets: [
          'FCI keeps the international anchor.',
          'ENCI keeps the Italian context visible.',
          'AKC and CCAA can help with comparison and judge-education language.',
        ],
        href: '/faq#official-references',
        hrefLabel: 'Open source list',
      },
    ],
    sourceTitle: 'Official-source reading path',
    sourceBody:
      'Use the official texts when wording matters. USG explains them, but should not pretend to own or replace them.',
    sourceLinks: [
      { label: 'FCI standard', href: 'https://www.fci.be/nomenclature/standards/343g02-en.pdf' },
      { label: 'ENCI standard', href: 'https://www.enci.it/media/2603/343.pdf' },
      { label: 'AKC standard', href: 'https://images.akc.org/pdf/breeds/standards/CaneCorso.pdf' },
      { label: 'CCAA judge manual', href: 'https://www.canecorso.org/uploads/1/1/8/2/118210967/2022_ccaa_judges_manual.pdf' },
    ],
  },
  bg: {
    eyebrow: 'USG Насоки за Cane Corso стандарт',
    title: 'Практичен USG прочит за структура, пропорции, снимки и подготовка за преглед',
    description:
      'Този guide държи официалния Cane Corso стандарт видим, но го превежда на по-спокоен и разбираем език за собственика. Помага на member потребителите да подготвят по-добри профили и на админа да гледа по-подредено, без USG да се представя като FCI, ENCI, съдия или ветеринар.',
    chips: ['FCI / ENCI като основа', 'Разбираем език', 'USG образователен слой'],
    boundaryTitle: 'USG граница',
    boundaryBody:
      'Това е образователен и подготвителен слой. Не оценява кучета автоматично, не заменя официална съдебна преценка и не превръща една снимка в доказателство за качество, здраве или стойност.',
    cards: [
      {
        eyebrow: '01 / Тяло',
        title: 'Структура и пропорции',
        body:
          'Собственикът трябва първо да чете баланса: силен, атлетичен Cane Corso с леко правоъгълно тяло, спокойно присъствие и без крайности.',
        bullets: [
          'Балансът е по-важен от драматичната крайност.',
          'Атлетичната субстанция е различна от тежест без функция.',
          'Страничната снимка помага най-много за силует, topline и пропорции.',
        ],
        href: '/faq#official-references',
        hrefLabel: 'Виж официалните източници',
      },
      {
        eyebrow: '02 / Глава',
        title: 'Глава и муцуна',
        body:
          'Прочитът на главата трябва да остане спокоен и сравнителен: израз, съотношение на муцуната, посока на черепа и обща хармония са по-важни от шум в социалните мрежи.',
        bullets: [
          'Гледай пропорция, не само маса.',
          'Не превръщай един screenshot в финална присъда.',
          'Полезни са снимка отпред и снимка в профил.',
        ],
        href: '/knowledge',
        hrefLabel: 'Остани в Knowledge',
      },
      {
        eyebrow: '03 / Захапка',
        title: 'Захапката е част от картината, не цялата картина',
        body:
          'Устата и захапката могат да имат значение, но трябва да се гледат внимателно и в контекст. Публичното платформено доверие не трябва да става публичен театър за захапка.',
        bullets: [
          'Не отделяй захапката от цялата глава и функцията.',
          'Ползвай я като помощен review ориентир, не като публичен score badge.',
          'Когато нещо е неясно, официалната преценка е по-важна от платформени догадки.',
        ],
        href: '/faq#certificate-verify',
        hrefLabel: 'Прочети trust границите',
      },
      {
        eyebrow: '04 / Растеж',
        title: 'Растеж и развитие',
        body:
          'Таблиците за малки и подрастващи са само ориентир. Развитието зависи от линия, пол, хранене, здраве и индивидуално темпо.',
        bullets: [
          'Таблицата не е диагноза.',
          'Не приемай една таблица като абсолютна истина за всеки Cane Corso.',
          'При съмнения за здраве и растеж реалният авторитет е ветеринарят.',
        ],
        href: '/faq#privacy-safety',
        hrefLabel: 'Прочети платформената уговорка',
      },
      {
        eyebrow: '05 / Снимки',
        title: 'Какви снимки най-много помагат за преглед',
        body:
          'Добрите снимки намаляват объркването. Собственикът трябва да даде ясен страничен профил, ясни снимки на главата и естествено представяне, преди да очаква доверие или публикация.',
        bullets: [
          'Една странична снимка в стойка.',
          'Една снимка на глава отпред и една в профил.',
          'По желание снимка в движение или контекст, без тежки филтри.',
        ],
        href: '/my-dogs',
        hrefLabel: 'Отвори Моите Cane Corso',
      },
      {
        eyebrow: '06 / Източници',
        title: 'Как да четем FCI, ENCI и AKC заедно',
        body:
          'USG трябва да третира FCI / ENCI като основен ориентир, а AKC / CCAA материалите като подпомагащо четене, не като главен авторитет за цялата платформа.',
        bullets: [
          'FCI държи международната основа.',
          'ENCI пази италианския контекст видим.',
          'AKC и CCAA помагат за сравнение и judge-education език.',
        ],
        href: '/faq#official-references',
        hrefLabel: 'Отвори списъка с източници',
      },
    ],
    sourceTitle: 'Път за официално четене',
    sourceBody:
      'Използвай официалните текстове, когато wording-ът има значение. USG ги обяснява, но не трябва да се представя сякаш ги заменя.',
    sourceLinks: [
      { label: 'FCI стандарт', href: 'https://www.fci.be/nomenclature/standards/343g02-en.pdf' },
      { label: 'ENCI стандарт', href: 'https://www.enci.it/media/2603/343.pdf' },
      { label: 'AKC стандарт', href: 'https://images.akc.org/pdf/breeds/standards/CaneCorso.pdf' },
      { label: 'CCAA judge manual', href: 'https://www.canecorso.org/uploads/1/1/8/2/118210967/2022_ccaa_judges_manual.pdf' },
    ],
  },
  it: {
    eyebrow: 'Guida USG allo standard Cane Corso',
    title: 'Una lettura pratica USG di struttura, proporzioni, foto e preparazione alla revisione',
    description:
      'Questa guida mantiene visibile lo standard ufficiale del Cane Corso ma lo traduce in un linguaggio più calmo e chiaro per il proprietario. Aiuta i membri a preparare profili migliori e aiuta l’admin a leggere con più coerenza, senza che USG finga di sostituire FCI, ENCI, giudici o veterinari.',
    chips: ['FCI / ENCI prima di tutto', 'Linguaggio comprensibile', 'Layer educativo USG'],
    boundaryTitle: 'Confine USG',
    boundaryBody:
      'Questo è un layer educativo e di preparazione. Non valuta automaticamente i cani, non sostituisce il giudizio ufficiale e non trasforma una foto in prova di qualità, salute o valore.',
    cards: [
      {
        eyebrow: '01 / Corpo',
        title: 'Struttura e proporzioni',
        body:
          'Il proprietario dovrebbe leggere prima l’equilibrio: un Cane Corso potente, atletico, leggermente rettangolare, con presenza calma e senza estremi esagerati.',
        bullets: [
          'L’equilibrio conta più dell’esagerazione.',
          'Sostanza atletica non significa pesantezza senza funzione.',
          'La foto laterale è la più utile per leggere outline, topline e proporzioni.',
        ],
        href: '/faq#official-references',
        hrefLabel: 'Vedi fonti ufficiali',
      },
      {
        eyebrow: '02 / Testa',
        title: 'Testa e muso',
        body:
          'La lettura della testa deve restare calma e comparativa: espressione, proporzione del muso, direzione del cranio e armonia generale contano più del rumore social.',
        bullets: [
          'Leggi la proporzione, non solo la massa.',
          'Non trasformare uno screenshot in giudizio finale.',
          'Quando possibile usa foto frontale e di profilo.',
        ],
        href: '/knowledge',
        hrefLabel: 'Resta in Knowledge',
      },
      {
        eyebrow: '03 / Morso',
        title: 'Il morso è parte del quadro, non tutto il quadro',
        body:
          'Bocca e morso possono contare, ma vanno letti con cautela e in contesto. La fiducia pubblica della piattaforma non deve diventare teatro pubblico del morso.',
        bullets: [
          'Non separare il morso dal quadro generale della testa e dalla funzione.',
          'Usalo come supporto alla review, non come badge pubblico di punteggio.',
          'Quando qualcosa è poco chiaro, la valutazione ufficiale conta più delle speculazioni della piattaforma.',
        ],
        href: '/faq#certificate-verify',
        hrefLabel: 'Leggi i confini di fiducia',
      },
      {
        eyebrow: '04 / Crescita',
        title: 'Crescita e sviluppo',
        body:
          'Le tabelle per cuccioli e junior sono solo strumenti di orientamento. Lo sviluppo dipende da linea, sesso, nutrizione, salute e ritmo individuale.',
        bullets: [
          'La tabella non è una diagnosi.',
          'Non trattare una singola tabella come verità assoluta per ogni Cane Corso.',
          'Per dubbi di salute o crescita, il veterinario resta l’autorità reale.',
        ],
        href: '/faq#privacy-safety',
        hrefLabel: 'Leggi la cautela della piattaforma',
      },
      {
        eyebrow: '05 / Foto',
        title: 'Quali foto aiutano di più la revisione',
        body:
          'Le buone foto riducono la confusione. Il proprietario dovrebbe fornire un chiaro profilo laterale, viste chiare della testa e una presentazione naturale prima di aspettarsi fiducia o pubblicazione.',
        bullets: [
          'Una foto laterale in stazione.',
          'Una foto frontale della testa e una di profilo.',
          'Facoltativa una foto in movimento o di contesto, senza filtri pesanti.',
        ],
        href: '/my-dogs',
        hrefLabel: 'Apri I miei Cane Corso',
      },
      {
        eyebrow: '06 / Fonti',
        title: 'Come leggere insieme FCI, ENCI e AKC',
        body:
          'USG dovrebbe trattare FCI / ENCI come riferimento principale e il materiale AKC / CCAA come lettura di supporto, non come autorità principale per tutta la piattaforma.',
        bullets: [
          'FCI resta l’ancora internazionale.',
          'ENCI mantiene visibile il contesto italiano.',
          'AKC e CCAA aiutano con confronto e judge-education language.',
        ],
        href: '/faq#official-references',
        hrefLabel: 'Apri le fonti',
      },
    ],
    sourceTitle: 'Percorso di lettura delle fonti ufficiali',
    sourceBody:
      'Usa i testi ufficiali quando la formulazione conta davvero. USG li spiega, ma non dovrebbe fingere di sostituirli.',
    sourceLinks: [
      { label: 'Standard FCI', href: 'https://www.fci.be/nomenclature/standards/343g02-en.pdf' },
      { label: 'Standard ENCI', href: 'https://www.enci.it/media/2603/343.pdf' },
      { label: 'Standard AKC', href: 'https://images.akc.org/pdf/breeds/standards/CaneCorso.pdf' },
      { label: 'CCAA judge manual', href: 'https://www.canecorso.org/uploads/1/1/8/2/118210967/2022_ccaa_judges_manual.pdf' },
    ],
  },
};

const ownerPanelCopy: Record<Locale, QuickPanelCopy> = {
  en: {
    eyebrow: 'Photo preparation',
    title: 'What helps the Cane Corso review most',
    description: 'Before submission, owners should make the profile easier to read, not just more decorative.',
    bullets: [
      'Prepare one standing side profile.',
      'Add one front head photo and one side head photo.',
      'Keep filters, dark shadows, and crowded backgrounds low.',
      'Documents are optional for admin review, not mandatory for public beauty.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Open the USG guide',
    secondaryHref: '/my-dogs/new',
    secondaryLabel: 'Add or complete a profile',
  },
  bg: {
    eyebrow: 'Подготовка на снимки',
    title: 'Какво най-много помага за преглед на Cane Corso',
    description: 'Преди изпращане собственикът трябва да направи профила по-четим, не просто по-декоративен.',
    bullets: [
      'Подготви една странична снимка в стойка.',
      'Добави една снимка на глава отпред и една в профил.',
      'Избягвай тежки филтри, тъмни сенки и претрупан фон.',
      'Документите са по желание за admin review, не задължителна публична украса.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Отвори USG guide',
    secondaryHref: '/my-dogs/new',
    secondaryLabel: 'Добави или довърши профил',
  },
  it: {
    eyebrow: 'Preparazione foto',
    title: 'Che cosa aiuta di più la review del Cane Corso',
    description: 'Prima dell’invio il proprietario dovrebbe rendere il profilo più leggibile, non solo più decorativo.',
    bullets: [
      'Prepara una foto laterale in stazione.',
      'Aggiungi una foto frontale della testa e una di profilo.',
      'Tieni bassi filtri, ombre scure e sfondi affollati.',
      'I documenti sono facoltativi per la review admin, non ornamento pubblico obbligatorio.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Apri la guida USG',
    secondaryHref: '/my-dogs/new',
    secondaryLabel: 'Aggiungi o completa un profilo',
  },
};

const adminPanelCopy: Record<Locale, QuickPanelCopy> = {
  en: {
    eyebrow: 'Visual review helper',
    title: 'Read structure and evidence before publication',
    description: 'Admin review should stay disciplined: profile clarity first, trust decision second, certificate only after a clear human decision.',
    bullets: [
      'Read balance, proportion, and photo usefulness before style claims.',
      'Treat bite and growth notes as supporting clues, not public scoring drama.',
      'Keep evidence levels separate from value judgments.',
      'When something is uncertain, ask for better photos or more context.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Open the USG guide',
    secondaryHref: '/faq#official-references',
    secondaryLabel: 'Open official references',
  },
  bg: {
    eyebrow: 'Помощ за визуален преглед',
    title: 'Чети структура и доказуемост преди публикация',
    description: 'Админ прегледът трябва да остане дисциплиниран: първо яснота на профила, после trust решение, а сертификат само след ясна човешка преценка.',
    bullets: [
      'Гледай баланс, пропорции и полезност на снимките преди стилови твърдения.',
      'Приемай захапка и растеж като помощни ориентири, не като публична драма за оценка.',
      'Дръж нивата на доказуемост отделно от стойностни преценки.',
      'Когато нещо е неясно, поискай по-добри снимки или повече контекст.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Отвори USG guide',
    secondaryHref: '/faq#official-references',
    secondaryLabel: 'Отвори официалните източници',
  },
  it: {
    eyebrow: 'Supporto per review visuale',
    title: 'Leggi struttura ed evidenza prima della pubblicazione',
    description: 'La review admin dovrebbe restare disciplinata: prima chiarezza del profilo, poi decisione di fiducia, e certificato solo dopo una chiara decisione umana.',
    bullets: [
      'Leggi equilibrio, proporzioni e utilità delle foto prima delle affermazioni di stile.',
      'Tratta morso e crescita come indizi di supporto, non come dramma pubblico di punteggio.',
      'Tieni separati livelli di evidenza e giudizi di valore.',
      'Quando qualcosa non è chiaro, chiedi foto migliori o più contesto.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Apri la guida USG',
    secondaryHref: '/faq#official-references',
    secondaryLabel: 'Apri fonti ufficiali',
  },
};

const faqPanelCopy: Record<Locale, QuickPanelCopy> = {
  en: {
    eyebrow: 'Standard reading path',
    title: 'Where official reading stops and USG guidance starts',
    description: 'FAQ should keep the boundary clear: the guide helps orientation, while the official sources stay the final wording anchor.',
    bullets: [
      'Use the Knowledge guide for a calmer owner explanation.',
      'Use official standards when exact wording matters.',
      'Do not confuse observation, education, certificate, and official pedigree authority.',
      'Move from FAQ to the section that matches the real next action.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Open the USG guide',
    secondaryHref: '/faq#official-references',
    secondaryLabel: 'Jump to official sources',
  },
  bg: {
    eyebrow: 'Път за четене на стандарта',
    title: 'Къде свършва официалното четене и къде започва USG насоката',
    description: 'FAQ трябва да пази границата ясна: guide-ът помага за ориентация, а официалните източници остават последният ориентир за точния wording.',
    bullets: [
      'Използвай Knowledge guide-а за по-спокойно обяснение към собственика.',
      'Използвай официалните стандарти, когато точният текст е важен.',
      'Не смесвай наблюдение, образование, сертификат и официална родословна власт.',
      'Премини от FAQ към секцията, която отговаря на реалната следваща стъпка.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Отвори USG guide',
    secondaryHref: '/faq#official-references',
    secondaryLabel: 'Скочи към официалните източници',
  },
  it: {
    eyebrow: 'Percorso di lettura dello standard',
    title: 'Dove finisce la lettura ufficiale e dove inizia la guida USG',
    description: 'La FAQ deve tenere chiaro il confine: la guida aiuta l’orientamento, mentre le fonti ufficiali restano l’ancora finale del wording esatto.',
    bullets: [
      'Usa la guida Knowledge per una spiegazione più calma al proprietario.',
      'Usa gli standard ufficiali quando conta la formulazione esatta.',
      'Non confondere osservazione, educazione, certificato e autorità ufficiale del pedigree.',
      'Passa dalla FAQ alla sezione che corrisponde al vero passo successivo.',
    ],
    primaryHref: '/knowledge#usg-standard-guide',
    primaryLabel: 'Apri la guida USG',
    secondaryHref: '/faq#official-references',
    secondaryLabel: 'Vai alle fonti ufficiali',
  },
};

function QuickPanel({ copy }: { copy: QuickPanelCopy }) {
  return (
    <section className="content-card usg-standard-shortcut" aria-label={copy.title}>
      <div className="usg-standard-shortcut__header">
        <span className="eyebrow-label">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <ul className="usg-standard-shortcut__list">
        {copy.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="usg-standard-shortcut__actions">
        <Link href={copy.primaryHref} className="button-secondary">
          {copy.primaryLabel}
        </Link>
        <Link href={copy.secondaryHref} className="button-ghost small">
          {copy.secondaryLabel}
        </Link>
      </div>
    </section>
  );
}

export function UsgStandardKnowledgePanel({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale] ?? guideCopy.en;

  return (
    <section className="knowledge-section knowledge-section--usg-standard-guide usg-standard-guide" id="usg-standard-guide" aria-labelledby="usg-standard-guide-title">
      <div className="usg-standard-guide__header">
        <div>
          <div className="section-block__eyebrow">{copy.eyebrow}</div>
          <h2 className="section-block__title" id="usg-standard-guide-title">{copy.title}</h2>
          <p className="section-block__description">{copy.description}</p>
        </div>
        <div className="usg-standard-guide__chips" aria-label={copy.eyebrow}>
          {copy.chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>

      <div className="usg-standard-guide__boundary">
        <strong>{copy.boundaryTitle}</strong>
        <p>{copy.boundaryBody}</p>
      </div>

      <div className="usg-standard-guide__grid">
        {copy.cards.map((card) => (
          <article className="usg-standard-guide__card" key={card.title}>
            <div className="usg-standard-guide__card-eyebrow">{card.eyebrow}</div>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <ul>
              {card.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <Link href={card.href} className="inline-link-action">
              {card.hrefLabel}
            </Link>
          </article>
        ))}
      </div>

      <div className="usg-standard-guide__footer">
        <div>
          <span className="eyebrow-label">{copy.sourceTitle}</span>
          <p>{copy.sourceBody}</p>
        </div>
        <div className="usg-standard-guide__sources">
          {copy.sourceLinks.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="usg-standard-guide__source-link">
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UsgOwnerPhotoChecklistPanel({ locale }: { locale: Locale }) {
  const copy = ownerPanelCopy[locale] ?? ownerPanelCopy.en;
  return <QuickPanel copy={copy} />;
}

export function UsgAdminVisualReviewPanel({ locale }: { locale: Locale }) {
  const copy = adminPanelCopy[locale] ?? adminPanelCopy.en;
  return <QuickPanel copy={copy} />;
}

export function UsgFaqKnowledgeBoundaryPanel({ locale }: { locale: Locale }) {
  const copy = faqPanelCopy[locale] ?? faqPanelCopy.en;
  return <QuickPanel copy={copy} />;
}
