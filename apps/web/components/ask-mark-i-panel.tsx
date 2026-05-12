'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { getAskMarkICopy, type AskMarkIVariant } from '@/lib/ask-mark-i-content';

type AskMarkIPanelProps = {
  locale: Locale;
  variant: AskMarkIVariant;
  className?: string;
};

const MARK_I_IMAGE = '/brand/heritage/di-casa-tananov/mark-i.jpg' as const;
const USG_SEAL = '/brand/seal/usg-official-seal-compact.png' as const;

export function AskMarkIPanel({ locale, variant, className }: AskMarkIPanelProps) {
  const copy = getAskMarkICopy(locale, variant);
  const [activeQuestionId, setActiveQuestionId] = useState(copy.questions[0]?.id ?? '');
  const activeQuestion = useMemo(
    () => copy.questions.find((question) => question.id === activeQuestionId) ?? copy.questions[0],
    [activeQuestionId, copy.questions],
  );

  if (!activeQuestion) return null;

  return (
    <section className={`ask-mark-i-panel ask-mark-i-panel--${variant}${className ? ` ${className}` : ''}`} aria-labelledby={`ask-mark-i-${variant}-title`}>
      <div className="ask-mark-i-panel__identity" aria-hidden="true">
        <div className="ask-mark-i-panel__portrait">
          <Image src={MARK_I_IMAGE} alt="" fill sizes="(max-width: 720px) 72px, 160px" priority={false} />
        </div>
        <div className="ask-mark-i-panel__seal">
          <Image src={USG_SEAL} alt="" fill sizes="72px" priority={false} />
        </div>
        <span>{copy.visualLabel}</span>
      </div>

      <div className="ask-mark-i-panel__content">
        <div className="ask-mark-i-panel__head">
          <div>
            <span className="eyebrow-label">{copy.eyebrow}</span>
            <h2 id={`ask-mark-i-${variant}-title`}>{copy.title}</h2>
            <p>{copy.intro}</p>
          </div>
          <em>{copy.subtitle}</em>
        </div>

        <div className="ask-mark-i-panel__workspace">
          <div className="ask-mark-i-panel__questions" aria-label={copy.promptLabel}>
            <span>{copy.promptLabel}</span>
            <div className="ask-mark-i-panel__question-grid">
              {copy.questions.map((question) => {
                const isActive = question.id === activeQuestion.id;
                return (
                  <button
                    key={question.id}
                    className={isActive ? 'is-active' : undefined}
                    type="button"
                    onClick={() => setActiveQuestionId(question.id)}
                    aria-pressed={isActive}
                  >
                    {question.question}
                  </button>
                );
              })}
            </div>
          </div>

          <article className="ask-mark-i-panel__answer" aria-live="polite">
            <span>{copy.answerLabel}</span>
            <h3>{activeQuestion.question}</h3>
            <p>{activeQuestion.answer}</p>
            <div className="ask-mark-i-panel__actions">
              <Link href={activeQuestion.href} className="button-primary">
                {activeQuestion.actionLabel}
              </Link>
              {activeQuestion.secondaryHref && activeQuestion.secondaryLabel ? (
                <Link href={activeQuestion.secondaryHref} className="button-secondary">
                  {activeQuestion.secondaryLabel}
                </Link>
              ) : null}
            </div>
          </article>
        </div>

        <div className="ask-mark-i-panel__notes">
          <p>{copy.safetyNote}</p>
          <strong>{copy.authorityNote}</strong>
        </div>
      </div>
    </section>
  );
}
