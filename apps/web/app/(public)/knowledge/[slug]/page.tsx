import { notFound } from 'next/navigation';
import { KnowledgeArticleDetail } from '@/components/knowledge-article-detail';
import { PageShell } from '@/components/page-shell';
import {
  getKnowledgeArticleStaticParams,
  getPublishedKnowledgeArticleBySlug,
} from '@/lib/knowledge-articles';
import { getCurrentLocale } from '@/lib/locale.server';

interface KnowledgeArticlePageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

const copyByLocale = {
  en: {
    eyebrow: 'Knowledge article',
    helpLabel: 'Help',
    note:
      'Public Knowledge article pages only open for published records. Drafts, pending review records, and archived records stay out of the public route.',
  },
  bg: {
    eyebrow: 'Статия от знанията',
    helpLabel: 'Помощ',
    note:
      'Публичните страници за статии в знанията се отварят само за публикувани записи. Чернови, чакащи преглед и архивирани записи остават извън публичния адрес.',
  },
  it: {
    eyebrow: 'Articolo Knowledge',
    helpLabel: 'Aiuto',
    note:
      'Le pagine pubbliche degli articoli Knowledge si aprono solo per record pubblicati. Bozze, record in revisione e archiviati restano fuori dal route pubblico.',
  },
} as const;

export function generateStaticParams() {
  return getKnowledgeArticleStaticParams();
}

export default async function KnowledgeArticlePage({ params }: KnowledgeArticlePageProps) {
  const locale = await getCurrentLocale();
  const resolvedParams = await Promise.resolve(params);
  const article = getPublishedKnowledgeArticleBySlug(locale, resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={article.title}
      description={article.excerpt}
      cards={[]}
      accentLabel={article.reviewedLabel}
      helpHref="/guide?topic=knowledge#knowledge"
      helpLabel={copy.helpLabel}
      visualSrc="/brand/primary/welcome-logo.jpg"
      visualAlt={article.title}
      heroChips={article.tags}
      heroNote={copy.note}
      variant="knowledge"
    >
      <KnowledgeArticleDetail article={article} locale={locale} />
    </PageShell>
  );
}
