import type { Locale } from '@/lib/i18n';
import { getBreedStandardCopy } from '@/lib/breed-standard-content';

interface OwnerPhotoGuidePanelProps {
  locale: Locale;
}

const panelActionCopy: Record<Locale, { action: string; note: string }> = {
  en: {
    action: 'Open the full photo guide',
    note: 'The small card stays text-first. Larger visual references belong in the expandable guide below, where they can be read properly.',
  },
  bg: {
    action: 'Отвори пълните насоки за снимки',
    note: 'Малката карта остава само като ясна текстова помощ. Визуалните примери стоят в разгъваемите насоки по-долу, където се виждат нормално.',
  },
  it: {
    action: 'Apri la guida foto completa',
    note: 'La scheda piccola resta testuale. Gli esempi visivi più grandi stanno nella guida espandibile sotto, dove sono leggibili.',
  },
};

export function OwnerPhotoGuidePanel({ locale }: OwnerPhotoGuidePanelProps) {
  const copy = getBreedStandardCopy(locale);
  const actionCopy = panelActionCopy[locale] ?? panelActionCopy.en;

  return (
    <section className="owner-photo-guide-panel owner-photo-guide-panel--text-only">
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
        <a className="owner-photo-guide-panel__action" href="#owner-photo-review-guidance">
          {actionCopy.action}
        </a>
        <p className="owner-photo-guide-panel__note">{actionCopy.note}</p>
      </div>
    </section>
  );
}
