import type { Locale } from '@/lib/i18n';
import { breedStandardCoreRatios, breedStandardSources, getBreedStandardCopy, getBreedStandardDiagramCards } from '@/lib/breed-standard-content';
import { BreedStandardDiagramCard } from '@/components/breed-standard-diagram-card';

interface BreedStandardOverviewProps {
  locale: Locale;
}

export function BreedStandardOverview({ locale }: BreedStandardOverviewProps) {
  const copy = getBreedStandardCopy(locale);
  const diagrams = getBreedStandardDiagramCards(locale);
  const ratios = Object.values(breedStandardCoreRatios);

  return (
    <section className="breed-standard-system" aria-label={copy.title}>
      <div className="breed-standard-system__header">
        <div>
          <span className="section-block__eyebrow">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <aside className="breed-standard-system__disclaimer">
          <img src="/brand/seal/usg-official-seal-compact.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <p>{copy.disclaimer}</p>
        </aside>
      </div>

      <div className="breed-standard-ratio-strip" aria-label={copy.exactProportionsLabel}>
        <strong>{copy.exactProportionsLabel}</strong>
        <div>
          {ratios.map((ratio) => (
            <span key={ratio}>{ratio}</span>
          ))}
        </div>
      </div>

      <div className="breed-standard-grid">
        {diagrams.map((card) => (
          <BreedStandardDiagramCard card={card} actionLabel={copy.openArticleLabel} key={card.id} />
        ))}
      </div>

      <div className="breed-standard-source-panel">
        <div>
          <span className="section-block__eyebrow">{copy.sourceTitle}</span>
          <h3>{copy.helperTitle}</h3>
          <p>{copy.helperDescription}</p>
          <strong>{copy.helperWarning}</strong>
        </div>
        <div className="breed-standard-source-list">
          {breedStandardSources.map((source) => (
            <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
              <span>{source.label}</span>
              <small>{source.note}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
