import Link from 'next/link';
import { BreedStandardArticlePanel } from '@/components/breed-standard-article-panel';
import { KnowledgeArticleReaderCompass } from '@/components/knowledge-article-reader-compass';
import type { KnowledgeArticle } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import {
  getRelatedPublishedKnowledgeArticles,
  knowledgeArticleCategoryLabels,
  knowledgeArticleStatusLabels,
  knowledgeReadingLevelLabels,
} from '@/lib/knowledge-articles';

interface KnowledgeArticleDetailProps {
  article: KnowledgeArticle;
  locale: Locale;
}

const copyByLocale = {
  en: {
    back: 'Back to Knowledge',
    keyFacts: 'Key facts',
    warnings: 'Important notes',
    sources: 'Source references',
    related: 'Related articles',
    openSource: 'Open source',
    openArticle: 'Open article',
    articleStatus: 'Article status',
    readingLevel: 'Reading level',
    officialLayer: 'Official Knowledge layer',
    officialLayerText: 'Reviewed public guidance connected to the USG trust system.',
  },
  bg: {
    back: 'Назад към знанията',
    keyFacts: 'Ключови факти',
    warnings: 'Важни бележки',
    sources: 'Източници',
    related: 'Свързани статии',
    openSource: 'Отвори източник',
    openArticle: 'Отвори статия',
    articleStatus: 'Статус на статията',
    readingLevel: 'Ниво на четене',
    officialLayer: 'Официален слой Знания',
    officialLayerText: 'Прегледани публични насоки, свързани със системата на доверие USG.',
  },
  it: {
    back: 'Torna a Knowledge',
    keyFacts: 'Fatti principali',
    warnings: 'Note importanti',
    sources: 'Fonti',
    related: 'Articoli correlati',
    openSource: 'Apri fonte',
    openArticle: 'Apri articolo',
    articleStatus: 'Stato articolo',
    readingLevel: 'Livello lettura',
    officialLayer: 'Layer Conoscenza ufficiale',
    officialLayerText: 'Guida pubblica revisionata collegata al sistema trust USG.',
  },
} as const;

export function KnowledgeArticleDetail({ article, locale }: KnowledgeArticleDetailProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const categoryLabels = knowledgeArticleCategoryLabels[locale] ?? knowledgeArticleCategoryLabels.en;
  const statusLabels = knowledgeArticleStatusLabels[locale] ?? knowledgeArticleStatusLabels.en;
  const readingLabels = knowledgeReadingLevelLabels[locale] ?? knowledgeReadingLevelLabels.en;
  const related = getRelatedPublishedKnowledgeArticles(locale, article);

  return (
    <article className="knowledge-article-detail">
      <Link className="knowledge-back-link" href="/knowledge">
        {copy.back}
      </Link>

      <header className="knowledge-article-detail__header">
        <div className="knowledge-article-detail__kicker">
          <span>{categoryLabels[article.category]}</span>
          <span>{article.reviewedLabel}</span>
        </div>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        <div className="knowledge-article-detail__chips" aria-label={`${copy.articleStatus} / ${copy.readingLevel}`}>
          <span>{statusLabels[article.status]}</span>
          <span>{readingLabels[article.readingLevel]}</span>
          {article.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <aside className="knowledge-article-detail__note">{article.heroNote}</aside>
        <div className="knowledge-article-official-strip">
          <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div>
            <strong>{copy.officialLayer}</strong>
            <span>{copy.officialLayerText}</span>
          </div>
        </div>
      </header>

      <KnowledgeArticleReaderCompass article={article} locale={locale} relatedCount={related.length} />

      <div className="knowledge-article-layout">
        <div className="knowledge-article-main">
          <BreedStandardArticlePanel locale={locale} slug={article.slug} />

          {article.sections.map((section) => (
            <section className="knowledge-article-section" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="knowledge-article-aside">
          <section className="knowledge-article-panel">
            <h2>{copy.keyFacts}</h2>
            <dl>
              {article.keyFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    <strong>{fact.value}</strong>
                    {fact.note ? <span>{fact.note}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {article.warnings.length ? (
            <section className="knowledge-article-panel knowledge-article-panel--warning">
              <h2>{copy.warnings}</h2>
              <ul>
                {article.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {article.sourceReferences.length ? (
            <section className="knowledge-article-panel">
              <h2>{copy.sources}</h2>
              <div className="knowledge-article-sources">
                {article.sourceReferences.map((source) => (
                  <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                    <span>{source.label}</span>
                    {source.note ? <p>{source.note}</p> : null}
                    <strong>{copy.openSource}</strong>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      {related.length ? (
        <section className="knowledge-section knowledge-section--related" aria-label={copy.related}>
          <div className="section-block__header">
            <div className="section-block__eyebrow">{copy.related}</div>
            <h2 className="section-block__title">{copy.related}</h2>
          </div>
          <div className="knowledge-article-grid">
            {related.map((item) => (
              <Link className="knowledge-article-card" href={`/knowledge/${item.slug}`} key={item.slug}>
                <div className="knowledge-article-card__meta">
                  <span>{categoryLabels[item.category]}</span>
                  <span>{readingLabels[item.readingLevel]}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <div className="knowledge-article-card__footer">
                  <span>{statusLabels[item.status]}</span>
                  <strong>{copy.openArticle}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
