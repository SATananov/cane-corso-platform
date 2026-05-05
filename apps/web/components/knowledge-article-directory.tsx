import Link from 'next/link';
import type { KnowledgeArticle } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import { knowledgeArticleCategoryLabels, knowledgeArticleStatusLabels, knowledgeReadingLevelLabels } from '@/lib/knowledge-articles';
import { BreedStandardOverview } from '@/components/breed-standard-overview';

interface KnowledgeArticleDirectoryProps {
  articles: readonly KnowledgeArticle[];
  locale: Locale;
  title: string;
  description: string;
  actionLabel: string;
}

const copyByLocale = {
  en: {
    eyebrow: 'Articles',
    publishedOnly: 'Published only',
    sourceDiscipline: 'Source discipline',
    featured: 'Featured',
    articleCount: 'articles',
    trustTitle: 'Published Knowledge layer',
    trustText: 'Only reviewed, published articles appear publicly. Drafts and maintenance records stay out of the public route.',
  },
  bg: {
    eyebrow: 'Статии',
    publishedOnly: 'Само публикувани',
    sourceDiscipline: 'Проверени източници',
    featured: 'Отличени',
    articleCount: 'статии',
    trustTitle: 'Публикуван слой Знания',
    trustText: 'Публично се показват само прегледани и публикувани статии. Черновите и вътрешните записи остават извън публичния път.',
  },
  it: {
    eyebrow: 'Articoli',
    publishedOnly: 'Solo pubblicati',
    sourceDiscipline: 'Fonti controllate',
    featured: 'In evidenza',
    articleCount: 'articoli',
    trustTitle: 'Layer Conoscenza pubblicato',
    trustText: 'Pubblicamente compaiono solo articoli revisionati e pubblicati. Bozze e record interni restano fuori dal percorso pubblico.',
  },
} as const;

export function KnowledgeArticleDirectory({ articles, locale, title, description, actionLabel }: KnowledgeArticleDirectoryProps) {
  const categoryLabels = knowledgeArticleCategoryLabels[locale] ?? knowledgeArticleCategoryLabels.en;
  const statusLabels = knowledgeArticleStatusLabels[locale] ?? knowledgeArticleStatusLabels.en;
  const readingLabels = knowledgeReadingLevelLabels[locale] ?? knowledgeReadingLevelLabels.en;
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const featuredCount = articles.filter((article) => article.featured).length;
  const sourceCount = articles.reduce((total, article) => total + article.sourceReferences.length, 0);

  return (
    <section className="knowledge-section knowledge-section--articles" aria-label={title}>
      <div className="section-block__header knowledge-article-directory-header">
        <div>
          <div className="section-block__eyebrow">{copy.eyebrow}</div>
          <h2 className="section-block__title">{title}</h2>
          <p className="section-block__description">{description}</p>
        </div>
        <div className="knowledge-article-directory-stats" aria-label={copy.publishedOnly}>
          <span><strong>{articles.length}</strong> {copy.articleCount}</span>
          <span>{copy.publishedOnly}</span>
          <span>{copy.sourceDiscipline}: <strong>{sourceCount}</strong></span>
          <span>{copy.featured}: <strong>{featuredCount}</strong></span>
        </div>
      </div>

      <div className="knowledge-public-trust-strip">
        <div className="knowledge-public-trust-strip__seal" aria-hidden="true">
          <img src="/brand/seal/usg-official-seal-compact.png" alt="" loading="lazy" decoding="async" />
        </div>
        <div>
          <strong>{copy.trustTitle}</strong>
          <p>{copy.trustText}</p>
        </div>
      </div>

      <BreedStandardOverview locale={locale} />

      <div className="knowledge-article-grid">
        {articles.map((article) => (
          <Link className="knowledge-article-card" href={`/knowledge/${article.slug}`} key={article.slug}>
            <div className="knowledge-article-card__meta">
              <span>{categoryLabels[article.category]}</span>
              <span>{readingLabels[article.readingLevel]}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <div className="knowledge-article-card__footer">
              <span>{statusLabels[article.status]}</span>
              <strong>{actionLabel}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
