import type { KnowledgeArticle } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { knowledgeArticleCategoryLabels, knowledgeReadingLevelLabels } from '@/lib/knowledge-articles';

interface KnowledgeArticleReaderCompassProps {
  article: KnowledgeArticle;
  locale: Locale;
  relatedCount: number;
}

const copyByLocale = {
  en: {
    eyebrow: 'Reader compass',
    title: 'How to use this article responsibly',
    education: 'Education purpose',
    educationText: 'Use this as owner orientation before decisions, submissions, reviews, or public-facing Cane Corso visibility.',
    boundary: 'Authority boundary',
    boundaryText: 'This article does not replace official kennel-club material, veterinary advice, professional training, or USG admin decisions.',
    next: 'Next context',
    sources: 'sources',
    related: 'related articles',
  },
  bg: {
    eyebrow: 'Компас за читателя',
    title: 'Как да използваш тази статия отговорно',
    education: 'Образователна цел',
    educationText: 'Използвай я като ориентация преди решения, подаване на профили, прегледи или публична Cane Corso видимост.',
    boundary: 'Авторитетна граница',
    boundaryText: 'Тази статия не заменя официални киноложки материали, ветеринарен съвет, професионално обучение или USG админ решения.',
    next: 'Следващ контекст',
    sources: 'източника',
    related: 'свързани статии',
  },
  it: {
    eyebrow: 'Bussola lettore',
    title: 'Come usare questo articolo in modo responsabile',
    education: 'Scopo educativo',
    educationText: 'Usalo come orientamento prima di decisioni, invii, review o visibilità pubblica Cane Corso.',
    boundary: 'Confine autoritativo',
    boundaryText: 'Questo articolo non sostituisce materiali kennel-club ufficiali, consigli veterinari, training professionale o decisioni admin USG.',
    next: 'Contesto successivo',
    sources: 'fonti',
    related: 'articoli correlati',
  },
} as const;

export function KnowledgeArticleReaderCompass({ article, locale, relatedCount }: KnowledgeArticleReaderCompassProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const categoryLabels = knowledgeArticleCategoryLabels[locale] ?? knowledgeArticleCategoryLabels.en;
  const readingLabels = knowledgeReadingLevelLabels[locale] ?? knowledgeReadingLevelLabels.en;

  return (
    <section className="knowledge-article-reader-compass" aria-label={copy.title}>
      <div className="knowledge-article-reader-compass__intro">
        <div className="section-block__eyebrow">{copy.eyebrow}</div>
        <h2>{copy.title}</h2>
      </div>
      <div className="knowledge-article-reader-compass__grid">
        <article>
          <span>{categoryLabels[article.category]}</span>
          <h3>{copy.education}</h3>
          <p>{copy.educationText}</p>
        </article>
        <article>
          <span>{readingLabels[article.readingLevel]}</span>
          <h3>{copy.boundary}</h3>
          <p>{copy.boundaryText}</p>
        </article>
        <article>
          <span>{copy.next}</span>
          <h3>{article.sourceReferences.length} {copy.sources}</h3>
          <p>{relatedCount} {copy.related}</p>
        </article>
      </div>
    </section>
  );
}
