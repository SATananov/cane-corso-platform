export const knowledgeArticleStatuses = ['draft', 'pending_review', 'published', 'archived'] as const;
export type KnowledgeArticleStatus = (typeof knowledgeArticleStatuses)[number];

export const knowledgeArticleCategories = [
  'history',
  'standard',
  'health',
  'training',
  'care',
  'breeding',
  'travel',
  'adoption',
  'platform',
] as const;
export type KnowledgeArticleCategory = (typeof knowledgeArticleCategories)[number];

export const knowledgeReadingLevels = ['basic', 'advanced', 'expert'] as const;
export type KnowledgeReadingLevel = (typeof knowledgeReadingLevels)[number];

export interface KnowledgeArticleSourceReference {
  label: string;
  href: string;
  note?: string;
}

export interface KnowledgeArticleFact {
  label: string;
  value: string;
  note?: string;
}

export interface KnowledgeArticleSection {
  heading: string;
  body: string;
  bullets?: readonly string[];
}

export interface KnowledgeArticleSummary {
  slug: string;
  locale: 'en' | 'bg' | 'it';
  status: KnowledgeArticleStatus;
  category: KnowledgeArticleCategory;
  title: string;
  excerpt: string;
  reviewedLabel: string;
  readingLevel: KnowledgeReadingLevel;
  featured?: boolean;
  tags: readonly string[];
}

export interface KnowledgeArticle extends KnowledgeArticleSummary {
  heroNote: string;
  sections: readonly KnowledgeArticleSection[];
  keyFacts: readonly KnowledgeArticleFact[];
  warnings: readonly string[];
  sourceReferences: readonly KnowledgeArticleSourceReference[];
  relatedSlugs: readonly string[];
  adminNotes?: string;
}
