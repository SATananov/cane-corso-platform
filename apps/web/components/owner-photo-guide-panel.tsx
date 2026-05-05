import type { Locale } from '@/lib/i18n';
import { getBreedStandardCopy, getBreedStandardDiagramById } from '@/lib/breed-standard-content';

interface OwnerPhotoGuidePanelProps {
  locale: Locale;
}

export function OwnerPhotoGuidePanel({ locale }: OwnerPhotoGuidePanelProps) {
  const copy = getBreedStandardCopy(locale);
  const diagram = getBreedStandardDiagramById(locale, 'owner-photo-guide');

  return (
    <section className="owner-photo-guide-panel">
      <div className="owner-photo-guide-panel__copy">
        <span className="eyebrow-label">USG STANDARD</span>
        <h3>{copy.ownerGuideTitle}</h3>
        <p>{copy.ownerGuideDescription}</p>
        <ul>
          {copy.ownerGuideItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <small>{copy.helperWarning}</small>
      </div>
      {diagram ? (
        <div className="owner-photo-guide-panel__visual">
          <img src={diagram.imageSrc} alt={diagram.imageAlt} loading="lazy" />
        </div>
      ) : null}
    </section>
  );
}
