import type { Locale } from '@/lib/i18n';

export type BreedStandardDiagramId =
  | 'overall-proportions'
  | 'head-muzzle-ratio'
  | 'head-axes'
  | 'front-structure'
  | 'owner-photo-guide';

export interface BreedStandardSourceReference {
  label: string;
  href: string;
  note: string;
}

export interface BreedStandardDiagramCard {
  id: BreedStandardDiagramId;
  articleSlug: string;
  title: string;
  subtitle: string;
  ratioLabel: string;
  imageSrc: string;
  imageAlt: string;
  highlights: readonly string[];
  sourceNote: string;
}

export const breedStandardCoreRatios = {
  bodyLength: 'Body length = height at withers + 11%',
  headLength: 'Head length = 36% of height at withers',
  muzzleSkull: 'Muzzle : skull ≈ 1 : 2',
  muzzleShape: 'Muzzle width = muzzle length; nasal bridge straight',
  headAxes: 'Skull and muzzle upper longitudinal axes: slightly convergent',
  skullWidth: 'Skull width at zygomatic arches = skull length or greater',
} as const;

export const breedStandardArticleSlugs = [
  'cane-corso-standard-proportions',
  'cane-corso-head-and-muzzle',
  'cane-corso-head-axes',
  'cane-corso-front-structure',
  'how-to-photograph-cane-corso-for-review',
] as const;

export const breedStandardSources: readonly BreedStandardSourceReference[] = [
  {
    label: 'FCI Standard N°343 — Cane Corso Italiano',
    href: 'https://www.fci.be/nomenclature/standards/343g02-en.pdf',
    note: 'Primary USG reference for exact proportions, head axes, body outline, and muzzle wording.',
  },
  {
    label: 'AKC Official Standard of the Cane Corso',
    href: 'https://images.akc.org/pdf/breeds/standards/CaneCorso.pdf',
    note: 'Cross-check reference for rectangular proportion and head length orientation.',
  },
  {
    label: 'UKC Cane Corso Italiano Breed Standard',
    href: 'https://www.ukcdogs.com/cane-corso-italiano',
    note: 'Support reference for muzzle shape and slightly convergent skull/muzzle planes.',
  },
  {
    label: 'CCAA Judge’s Manual 2022',
    href: 'https://www.canecorso.org/uploads/1/1/8/2/118210967/2022_ccaa_judges_manual.pdf',
    note: 'Educational support only; not an official replacement for kennel-club standards.',
  },
];

const overviewCopy = {
  en: {
    eyebrow: 'USG Breed Standard Knowledge',
    title: 'Exact Cane Corso proportions in USG style',
    description: 'A premium educational layer that turns official breed-standard proportions into clear owner and admin guidance without becoming automatic judging.',
    disclaimer: 'USG educational visualization based on the official breed standard. It does not replace a qualified judge, veterinary professional, or kennel-club document.',
    sourceTitle: 'Verified source discipline',
    openArticleLabel: 'Open article',
    exactProportionsLabel: 'Exact proportions',
    ownerGuideTitle: 'Owner photo guide for review',
    ownerGuideDescription: 'Better photos help the admin understand structure, balance, profile, and public presentation before publication.',
    ownerGuideItems: ['Full body from the side', 'Head in profile', 'Front standing view', 'Rear standing view', 'Movement / gait if possible'],
    helperTitle: 'Admin helper boundary',
    helperDescription: 'The breed-standard helper is read-only guidance for review, not an automatic score.',
    helperWarning: 'Final USG visibility, certificate decisions, and registry trust remain human-admin decisions.',
  },
  bg: {
    eyebrow: 'USG стандарт на породата',
    title: 'Точни Cane Corso пропорции в USG стил',
    description: 'Премиум образователен слой, който превръща официалните пропорции на породата в ясни насоки за собственици и админ преглед, без да става автоматично оценяване.',
    disclaimer: 'Образователна USG визуализация, базирана на официалния стандарт на породата. Не замества квалифициран съдия, ветеринарен специалист или официален документ на киноложка организация.',
    sourceTitle: 'Проверена дисциплина на източниците',
    openArticleLabel: 'Отвори статията',
    exactProportionsLabel: 'Точни пропорции',
    ownerGuideTitle: 'Насоки за снимки преди преглед',
    ownerGuideDescription: 'По-добрите снимки помагат на администратора да разбере структура, баланс, профил и публично представяне преди публикуване.',
    ownerGuideItems: ['Цяло тяло отстрани', 'Глава в профил', 'Фронтална стойка', 'Задна стойка', 'Движение / походка, ако е възможно'],
    helperTitle: 'Граница на админ помощника',
    helperDescription: 'Помощникът за стандарта е насока само за преглед за преглед, не автоматична оценка.',
    helperWarning: 'Финалната USG видимост, сертификатните решения и регистърното доверие остават човешко админ решение.',
  },
  it: {
    eyebrow: 'Standard di razza USG',
    title: 'Proporzioni Cane Corso esatte in stile USG',
    description: 'Un livello educativo premium che trasforma le proporzioni ufficiali dello standard in guida chiara per proprietari e revisione amministrativa, senza diventare giudizio automatico.',
    disclaimer: 'Visualizzazione educativa USG basata sullo standard ufficiale di razza. Non sostituisce giudice qualificato, veterinario o documento ufficiale di ente cinofilo.',
    sourceTitle: 'Disciplina fonti verificata',
    openArticleLabel: 'Apri articolo',
    exactProportionsLabel: 'Proporzioni esatte',
    ownerGuideTitle: 'Guida foto per revisione',
    ownerGuideDescription: 'Foto migliori aiutano l’amministratore a capire struttura, equilibrio, profilo e presentazione pubblica prima della pubblicazione.',
    ownerGuideItems: ['Corpo intero di lato', 'Testa di profilo', 'Vista frontale in stazione', 'Vista posteriore in stazione', 'Movimento / andatura se possibile'],
    helperTitle: 'Confine dell’assistente amministrativo',
    helperDescription: 'L’assistente dello standard è una guida solo in lettura per la revisione, non punteggio automatico.',
    helperWarning: 'Visibilità USG, certificati e fiducia del registro restano decisioni umane amministrative.',
  },
} as const;

function localizedCards(locale: Locale): readonly BreedStandardDiagramCard[] {
  const bg = locale === 'bg';
  const it = locale === 'it';

  return [
    {
      id: 'overall-proportions',
      articleSlug: 'cane-corso-standard-proportions',
      title: bg ? 'Общи пропорции' : it ? 'Proporzioni generali' : 'Overall proportions',
      subtitle: bg ? 'Правоъгълен силует и дължина на глава' : it ? 'Sagoma rettangolare e lunghezza testa' : 'Rectangular outline and head length',
      ratioLabel: bg ? 'Тяло +11% / Глава 36%' : it ? 'Corpo +11% / Testa 36%' : 'Body +11% / Head 36%',
      imageSrc: '/brand/standard/usg-standard-overall-proportions.avif',
      imageAlt: bg ? 'USG техническа диаграма на общите Cane Corso пропорции' : 'USG technical diagram of Cane Corso overall proportions',
      highlights: bg
        ? ['Дължината на тялото е 11% по-голяма от височината при холката.', 'Дължината на главата достига 36% от височината при холката.', 'AKC cross-check: приблизително 10% по-дълъг от висок.']
        : it
          ? ['La lunghezza del corpo è 11% maggiore dell’altezza al garrese.', 'La lunghezza della testa raggiunge 36% dell’altezza al garrese.', 'AKC cross-check: circa 10% più lungo che alto.']
          : ['Body length is 11% greater than height at withers.', 'Head length reaches 36% of height at withers.', 'AKC cross-check: approximately 10% longer than tall.'],
      sourceNote: bg ? 'Основен източник: FCI Standard N°343. Cross-check: AKC official standard.' : it ? 'Fonte primaria: FCI Standard N°343. Cross-check: AKC official standard.' : 'Primary: FCI Standard N°343. Cross-check: AKC official standard.',
    },
    {
      id: 'head-muzzle-ratio',
      articleSlug: 'cane-corso-head-and-muzzle',
      title: bg ? 'Глава и муцуна' : it ? 'Testa e muso' : 'Head and muzzle ratio',
      subtitle: bg ? 'Муцуна : череп ≈ 1 : 2' : it ? 'Muso : cranio ≈ 1 : 2' : 'Muzzle : skull ≈ 1 : 2',
      ratioLabel: '1 : 2',
      imageSrc: '/brand/standard/usg-standard-head-muzzle-ratio.png',
      imageAlt: bg ? 'USG техническа диаграма на глава и муцуна на Cane Corso' : 'USG technical diagram of Cane Corso head and muzzle ratio',
      highlights: bg
        ? ['Муцуната е осезаемо по-къса от черепа.', 'Муцуната е силна и квадратна.', 'Ширината на муцуната е равна на дължината; носният профил е прав.']
        : it
          ? ['Il muso è nettamente più corto del cranio.', 'Il muso è forte e quadrato.', 'La larghezza del muso equivale alla lunghezza; canna nasale diritta.']
          : ['Muzzle is noticeably shorter than skull.', 'Muzzle is strong and square.', 'Muzzle width equals muzzle length; nasal bridge is straight.'],
      sourceNote: bg ? 'Основен източник: FCI Standard N°343. Подкрепа: UKC breed standard.' : it ? 'Fonte primaria: FCI Standard N°343. Supporto: UKC breed standard.' : 'Primary: FCI Standard N°343. Support: UKC breed standard.',
    },
    {
      id: 'head-axes',
      articleSlug: 'cane-corso-head-axes',
      title: bg ? 'Оси на главата' : it ? 'Assi della testa' : 'Head axes',
      subtitle: bg ? 'Леко събиращи се равнини на череп и муцуна' : it ? 'Piani superiori leggermente convergenti' : 'Slightly convergent skull and muzzle planes',
      ratioLabel: bg ? 'Лека конвергенция' : it ? 'Leggera convergenza' : 'Slight convergence',
      imageSrc: '/brand/standard/usg-standard-head-axes.png',
      imageAlt: bg ? 'USG сравнение на правилни и неправилни оси на Cane Corso глава' : 'USG technical comparison of Cane Corso head axes and muzzle variations',
      highlights: bg
        ? ['Правилно: горните оси на черепа и муцуната леко се събират.', 'Разминаващи се оси не са правилни за типа.', 'Дълга муцуна, къса муцуна и прекомерни бръчки изискват внимателен визуален преглед.']
        : it
          ? ['Corretto: assi superiori di cranio e muso leggermente convergenti.', 'Assi divergenti non sono corretti per il tipo.', 'Muso lungo, corto e rughe eccessive richiedono revisione attenta.']
          : ['Correct: skull and muzzle upper axes slightly converge.', 'Divergent axes are not correct for the breed type.', 'Long muzzle, short muzzle, and excessive wrinkles need careful visual review.'],
      sourceNote: bg ? 'Основен източник: FCI Standard N°343. Образователна подкрепа: CCAA Judge’s Manual.' : it ? 'Fonte primaria: FCI Standard N°343. Supporto educativo: CCAA Judge’s Manual.' : 'Primary: FCI Standard N°343. Support: CCAA Judge’s Manual.',
    },
    {
      id: 'front-structure',
      articleSlug: 'cane-corso-front-structure',
      title: bg ? 'Предна стойка и метакарпус' : it ? 'Struttura frontale e metacarpo' : 'Front structure and metacarpus',
      subtitle: bg ? 'Правилно подравняване срещу отклонение навътре/навън' : it ? 'Allineamento corretto contro deviazioni interne/esterne' : 'Correct alignment versus inward/outward deviation',
      ratioLabel: bg ? 'Правилно подравняване' : it ? 'Allineamento corretto' : 'Correct alignment',
      imageSrc: '/brand/standard/usg-standard-front-structure.png',
      imageAlt: bg ? 'USG техническа диаграма за предна стойка и метакарпус при Cane Corso' : 'USG technical front structure diagram for Cane Corso metacarpus alignment',
      highlights: bg
        ? ['Фронталният изглед помага да се видят баланс и стойка.', 'Метакарпусът не трябва видимо да се отклонява навътре или навън.', 'Това е насока за админ преглед, не автоматично оценяване.']
        : it
          ? ['La vista frontale aiuta a leggere equilibrio e stazione.', 'Il metacarpo non dovrebbe deviare dentro o fuori.', 'È guida per review admin, non giudizio automatico.']
          : ['Front view helps reveal balance and stance.', 'Metacarpus should not visibly deviate inward or outward.', 'This is guidance for admin review, not automatic judging.'],
      sourceNote: bg ? 'Образователна USG визуализация, съобразена с езика за структура в стандартите.' : it ? 'Visualizzazione educativa USG coerente con il linguaggio strutturale degli standard.' : 'Educational USG visualization cross-referenced with breed-standard structure language.',
    },
    {
      id: 'owner-photo-guide',
      articleSlug: 'how-to-photograph-cane-corso-for-review',
      title: bg ? 'Насоки за снимки' : it ? 'Guida foto proprietario' : 'Owner photo guide',
      subtitle: bg ? 'Кадри, които помагат за отговорен преглед' : it ? 'Scatti che aiutano la revisione responsabile' : 'Images that help responsible review',
      ratioLabel: bg ? '5 вида снимки' : it ? '5 viste foto' : '5 photo views',
      imageSrc: '/brand/standard/usg-standard-photo-guide.avif',
      imageAlt: bg ? 'USG насоки за снимане на Cane Corso преди преглед' : 'USG guide for photographing Cane Corso before review',
      highlights: bg
        ? ['Тяло отстрани, глава в профил, фронт, гръб и движение.', 'Ясна светлина и естествена стойка подобряват админ прегледа.', 'Насоките за снимки не обещават публикуване или сертификат.']
        : it
          ? ['Corpo di lato, testa profilo, frontale, posteriore e movimento.', 'Luce chiara e stazione naturale migliorano la review admin.', 'Le linee guida foto non promettono pubblicazione o certificato.']
          : ['Side body, head profile, front, rear, and movement views.', 'Clear light and natural stance improve admin review.', 'Photo guidance does not promise publication or certification.'],
      sourceNote: bg ? 'USG работна насока, базирана на процеса на преглед и образователния стандарт.' : it ? 'Guida workflow USG basata sul processo review e sull’educazione standard.' : 'USG workflow guidance based on the platform review process and breed-standard education.',
    },
  ];
}

export function getBreedStandardCopy(locale: Locale) {
  return overviewCopy[locale] ?? overviewCopy.en;
}

export function getBreedStandardDiagramCards(locale: Locale): readonly BreedStandardDiagramCard[] {
  return localizedCards(locale);
}

export function getBreedStandardDiagramById(locale: Locale, id: BreedStandardDiagramId): BreedStandardDiagramCard | null {
  return getBreedStandardDiagramCards(locale).find((card) => card.id === id) ?? null;
}

export function getBreedStandardArticleDiagrams(locale: Locale, slug: string): readonly BreedStandardDiagramCard[] {
  const diagrams = getBreedStandardDiagramCards(locale);
  const map: Record<string, BreedStandardDiagramId[]> = {
    'cane-corso-standard-proportions': ['overall-proportions'],
    'cane-corso-head-and-muzzle': ['head-muzzle-ratio', 'head-axes'],
    'cane-corso-head-axes': ['head-axes', 'head-muzzle-ratio'],
    'cane-corso-front-structure': ['front-structure'],
    'how-to-photograph-cane-corso-for-review': ['owner-photo-guide', 'overall-proportions'],
  };

  const ids = map[slug] ?? [];
  return diagrams.filter((card) => ids.includes(card.id));
}
