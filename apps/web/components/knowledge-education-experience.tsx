import Link from 'next/link';
import type { KnowledgeArticle, KnowledgeArticleCategory } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { knowledgeArticleCategoryLabels } from '@/lib/knowledge-articles';

interface KnowledgeEducationExperienceProps {
  articles: readonly KnowledgeArticle[];
  locale: Locale;
  actionLabel: string;
}

const priorityCategories: readonly KnowledgeArticleCategory[] = [
  'history',
  'standard',
  'health',
  'training',
  'care',
  'breeding',
  'travel',
  'adoption',
  'platform',
];

const copyByLocale = {
  en: {
    eyebrow: 'Breed education experience',
    title: 'Learn the Cane Corso before using the trust layers',
    description:
      'The public Knowledge page works as a guided education experience: first understand the breed, then prepare responsible ownership, then use Registry, Certificate, Verify, and Gallery with the right expectations.',
    publicLabel: 'Public education layer',
    featuredLabel: 'Featured reading',
    sourcesLabel: 'Source-backed references',
    categoryLabel: 'Reading zones',
    openZone: 'Open reading zone',
    emptyZone: 'Guided reading zone',
    pathEyebrow: 'Recommended learning path',
    boundariesEyebrow: 'Trust boundaries',
    boundariesTitle: 'Knowledge explains. Registry, Certificate, Verify, and Gallery remain separate authority layers.',
    boundariesDescription:
      'This section is educational. It helps visitors learn, while profile publication, certificate decisions, Verify records, Gallery selection, and moderation remain handled in their own protected areas.',
    path: [
      {
        title: 'Identity first',
        description: 'Start with history and breed identity so the Cane Corso is never presented as a generic status symbol.',
        href: '/knowledge/cane-corso-history-and-identity',
      },
      {
        title: 'Read the standard calmly',
        description: 'Use the official-standard articles to understand structure and terminology without turning owners into judges.',
        href: '/knowledge/official-standard-owner-reading',
      },
      {
        title: 'Prepare real ownership',
        description: 'Health, training, public safety, care, and photography guidance help owners prepare better records and safer decisions.',
        href: '/knowledge/health-screening-and-responsible-care',
      },
      {
        title: 'Then use USG trust surfaces',
        description: 'After learning the basics, Registry, Verify, certificates, and showcase visibility become clearer and more honest.',
        href: '/member',
      },
    ],
    boundaries: [
      'Knowledge is educational guidance, not veterinary, legal, judging, or breeding approval advice.',
      'Registry visibility and USG certificate decisions stay under their own locked review and authority layers.',
      'Only published Knowledge records appear publicly; drafts and maintenance records remain protected.',
    ],
  },
  bg: {
    eyebrow: 'Образователно преживяване за породата',
    title: 'Първо разбери Cane Corso, после използвай слоевете на доверие',
    description:
      'Публичната страница Знания води посетителя спокойно: първо произход и характер на породата, после отговорно притежание, и чак след това Регистър, Сертификат, Проверка и Галерия с правилни очаквания.',
    publicLabel: 'Публичен образователен слой',
    featuredLabel: 'Отличени четива',
    sourcesLabel: 'Източници към статиите',
    categoryLabel: 'Зони за четене',
    openZone: 'Отвори зона',
    emptyZone: 'Зона за насоки',
    pathEyebrow: 'Препоръчан път за учене',
    boundariesEyebrow: 'Граници на доверие',
    boundariesTitle: 'Знанията обясняват. Регистър, Сертификат, Проверка и Галерия остават отделни авторитетни слоеве.',
    boundariesDescription:
      'Тази секция е образователна. Тя помага на посетителя да учи, а публикуването на профили, сертификатните решения, проверките, изборът за Галерия и модерацията остават в отделните защитени части на платформата.',
    path: [
      {
        title: 'Първо идентичност',
        description: 'Започни с историята и породната идентичност, за да не се представя Cane Corso като общ символ за статус.',
        href: '/knowledge/cane-corso-history-and-identity',
      },
      {
        title: 'Чети стандарта спокойно',
        description: 'Статиите за официалния стандарт помагат за структура и терминология, без да превръщат собственика в съдия.',
        href: '/knowledge/official-standard-owner-reading',
      },
      {
        title: 'Подготви реалното притежание',
        description: 'Здраве, обучение, публична безопасност, грижа и снимки помагат за по-добри записи и по-отговорни решения.',
        href: '/knowledge/health-screening-and-responsible-care',
      },
      {
        title: 'После използвай USG слоевете на доверие',
        description: 'След основите Регистър, Проверка, сертификати и представителна видимост стават по-ясни и честни.',
        href: '/member',
      },
    ],
    boundaries: [
      'Знанията са образователни насоки, не ветеринарен, правен, съдийски или развъден съвет за одобрение.',
      'Видимостта в Регистъра и решенията за USG сертификат остават в собствените си заключени слоеве за преглед.',
      'Публично се виждат само публикувани записи в Знания; черновите и поддръжката остават защитени.',
    ],
  },
  it: {
    eyebrow: 'Esperienza educativa di razza',
    title: 'Impara il Cane Corso prima di usare i livelli di fiducia',
    description:
      'La pagina pubblica Knowledge guida il visitatore: prima origine e carattere della razza, poi proprietà responsabile, poi Registro, Certificato, Verifica e Galleria con aspettative corrette.',
    publicLabel: 'Livello educativo pubblico',
    featuredLabel: 'Letture in evidenza',
    sourcesLabel: 'Fonti collegate',
    categoryLabel: 'Zone lettura',
    openZone: 'Apri zona',
    emptyZone: 'Zona di lettura guidata',
    pathEyebrow: 'Percorso consigliato',
    boundariesEyebrow: 'Confini di fiducia',
    boundariesTitle: 'Knowledge spiega. Registro, Certificato, Verifica e Galleria restano livelli autoritativi separati.',
    boundariesDescription:
      'Questa sezione è educativa. Aiuta il visitatore a imparare, mentre pubblicazione profili, decisioni certificato, verifica, scelta Galleria e moderazione restano nelle aree protette della piattaforma.',
    path: [
      {
        title: 'Prima identità',
        description: 'Inizia da storia e identità di razza così il Cane Corso non diventa un simbolo generico di status.',
        href: '/knowledge/cane-corso-history-and-identity',
      },
      {
        title: 'Leggi lo standard con calma',
        description: 'Gli articoli sullo standard aiutano struttura e terminologia senza trasformare i proprietari in giudici.',
        href: '/knowledge/official-standard-owner-reading',
      },
      {
        title: 'Prepara proprietà reale',
        description: 'Salute, training, sicurezza pubblica, cura e foto aiutano record migliori e decisioni più responsabili.',
        href: '/knowledge/health-screening-and-responsible-care',
      },
      {
        title: 'Poi usa i livelli di fiducia USG',
        description: 'Dopo le basi, Registro, Verifica, certificati e vetrina diventano più chiari e onesti.',
        href: '/member',
      },
    ],
    boundaries: [
      'Le Conoscenze sono una guida educativa, non consiglio veterinario, legale, giudicante o approvazione allevamento.',
      'Visibilità Registro e decisioni certificato USG restano nei propri livelli di revisione bloccati.',
      'Solo record Knowledge pubblicati appaiono pubblicamente; bozze e manutenzione restano protette.',
    ],
  },
} as const;

function firstArticleByCategory(articles: readonly KnowledgeArticle[], category: KnowledgeArticleCategory) {
  return articles.find((article) => article.category === category) ?? null;
}

export function KnowledgeEducationExperience({ articles, locale, actionLabel }: KnowledgeEducationExperienceProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const categoryLabels = knowledgeArticleCategoryLabels[locale] ?? knowledgeArticleCategoryLabels.en;
  const featuredCount = articles.filter((article) => article.featured).length;
  const sourceCount = articles.reduce((total, article) => total + article.sourceReferences.length, 0);
  const availableCategories = priorityCategories.filter((category) => articles.some((article) => article.category === category));

  return (
    <section className="knowledge-section knowledge-section--education-experience" aria-label={copy.title}>
      <div className="knowledge-education-hero">
        <div>
          <div className="section-block__eyebrow">{copy.eyebrow}</div>
          <h2 className="section-block__title">{copy.title}</h2>
          <p className="section-block__description">{copy.description}</p>
        </div>
        <div className="knowledge-education-stats" aria-label={copy.publicLabel}>
          <span><strong>{articles.length}</strong>{copy.publicLabel}</span>
          <span><strong>{featuredCount}</strong>{copy.featuredLabel}</span>
          <span><strong>{sourceCount}</strong>{copy.sourcesLabel}</span>
          <span><strong>{availableCategories.length}</strong>{copy.categoryLabel}</span>
        </div>
      </div>

      <div className="knowledge-learning-path" aria-label={copy.pathEyebrow}>
        <div className="knowledge-learning-path__intro">
          <span>{copy.pathEyebrow}</span>
        </div>
        {copy.path.map((item, index) => (
          <Link className="knowledge-learning-step" href={item.href} key={item.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <strong>{actionLabel}</strong>
          </Link>
        ))}
      </div>

      <div className="knowledge-reading-zone-grid" aria-label={copy.categoryLabel}>
        {availableCategories.map((category) => {
          const article = firstArticleByCategory(articles, category);
          const count = articles.filter((item) => item.category === category).length;
          return article ? (
            <Link className="knowledge-reading-zone-card" href={`/knowledge/${article.slug}`} key={category}>
              <span>{categoryLabels[category]}</span>
              <strong>{count}</strong>
              <p>{article.title}</p>
              <em>{copy.openZone}</em>
            </Link>
          ) : (
            <div className="knowledge-reading-zone-card is-empty" key={category}>
              <span>{categoryLabels[category]}</span>
              <strong>0</strong>
              <p>{copy.emptyZone}</p>
            </div>
          );
        })}
      </div>

      <div className="knowledge-boundary-panel" aria-label={copy.boundariesEyebrow}>
        <div>
          <div className="section-block__eyebrow">{copy.boundariesEyebrow}</div>
          <h3>{copy.boundariesTitle}</h3>
          <p>{copy.boundariesDescription}</p>
        </div>
        <ul>
          {copy.boundaries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
