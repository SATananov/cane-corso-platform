'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface ProgressiveChoiceItem {
  id: string;
  label: string;
  title: string;
  body: string;
  eyebrow?: string;
  bullets?: readonly string[];
  actionHref?: string;
  actionLabel?: string;
  meta?: string;
  tone?: 'default' | 'warning' | 'trust' | 'calm';
}

interface ProgressiveChoicePanelProps {
  ariaLabel: string;
  title?: string;
  description?: string;
  items: readonly ProgressiveChoiceItem[];
  initialId?: string;
  className?: string;
  actionPrefix?: string;
}

function normalizeId(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9а-яёіїєъь]+/gi, '-').replace(/^-+|-+$/g, '') || 'section';
}

export function ProgressiveChoicePanel({
  ariaLabel,
  title,
  description,
  items,
  initialId,
  className,
  actionPrefix,
}: ProgressiveChoicePanelProps) {
  const normalizedItems = useMemo(
    () => items.map((item, index) => ({ ...item, id: item.id || `${normalizeId(item.label)}-${index}` })),
    [items],
  );
  const firstId = normalizedItems[0]?.id ?? '';
  const [activeId, setActiveId] = useState(initialId && normalizedItems.some((item) => item.id === initialId) ? initialId : firstId);
  const activeItem = normalizedItems.find((item) => item.id === activeId) ?? normalizedItems[0];

  if (!normalizedItems.length || !activeItem) return null;

  return (
    <section className={`progressive-choice-panel${className ? ` ${className}` : ''}`} aria-label={ariaLabel}>
      {title || description ? (
        <div className="progressive-choice-panel__head">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}

      <div className="progressive-choice-panel__tabs" role="tablist" aria-label={ariaLabel}>
        {normalizedItems.map((item) => {
          const isActive = item.id === activeItem.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`progressive-panel-${item.id}`}
              id={`progressive-tab-${item.id}`}
              className={isActive ? 'is-active' : undefined}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <article
        className={`progressive-choice-panel__body progressive-choice-panel__body--${activeItem.tone ?? 'default'}`}
        role="tabpanel"
        id={`progressive-panel-${activeItem.id}`}
        aria-labelledby={`progressive-tab-${activeItem.id}`}
      >
        <div>
          {activeItem.eyebrow ? <span className="eyebrow-label">{activeItem.eyebrow}</span> : null}
          <h3>{activeItem.title}</h3>
          <p>{activeItem.body}</p>
          {activeItem.bullets?.length ? (
            <ul>
              {activeItem.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          {activeItem.meta ? <small>{activeItem.meta}</small> : null}
        </div>
        {activeItem.actionHref && activeItem.actionLabel ? (
          <Link href={activeItem.actionHref} className="button-secondary small">
            {actionPrefix ? `${actionPrefix} · ${activeItem.actionLabel}` : activeItem.actionLabel}
          </Link>
        ) : null}
      </article>
    </section>
  );
}
