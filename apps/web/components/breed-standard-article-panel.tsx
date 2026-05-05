import type { Locale } from '@/lib/i18n';
import { getBreedStandardArticleDiagrams, getBreedStandardCopy } from '@/lib/breed-standard-content';
import { BreedStandardDiagramCard } from '@/components/breed-standard-diagram-card';

interface BreedStandardArticlePanelProps {
  locale: Locale;
  slug: string;
}

export function BreedStandardArticlePanel({ locale, slug }: BreedStandardArticlePanelProps) {
  const copy = getBreedStandardCopy(locale);
  const diagrams = getBreedStandardArticleDiagrams(locale, slug);

  if (!diagrams.length) {
    return null;
  }

  return (
    <section className="breed-standard-article-panel" aria-label={copy.eyebrow}>
      <div className="breed-standard-article-panel__head">
        <span className="section-block__eyebrow">{copy.eyebrow}</span>
        <h2>{copy.exactProportionsLabel}</h2>
        <p>{copy.disclaimer}</p>
      </div>
      <div className="breed-standard-grid breed-standard-grid--article">
        {diagrams.map((card) => (
          <BreedStandardDiagramCard card={card} key={card.id} showAction={false} />
        ))}
      </div>
    </section>
  );
}
