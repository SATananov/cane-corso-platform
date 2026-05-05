import { SectionCard } from '@/components/section-card';
import { KnowledgeEducationExperience } from '@/components/knowledge-education-experience';
import { KnowledgeArticleDirectory } from '@/components/knowledge-article-directory';
import type { KnowledgeArticle } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import type { KnowledgeCenterCard, KnowledgeCenterCopy, KnowledgeFact, KnowledgeSource } from '@/lib/knowledge-center-content';

function KnowledgeMiniCard({ card }: { card: KnowledgeCenterCard }) {
  return (
    <article className="knowledge-mini-card">
      <div className="knowledge-mini-card__eyebrow">{card.eyebrow}</div>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      {card.meta ? <span>{card.meta}</span> : null}
    </article>
  );
}

function FactRow({ fact }: { fact: KnowledgeFact }) {
  return (
    <div className="knowledge-fact-row">
      <dt>{fact.label}</dt>
      <dd>
        <strong>{fact.value}</strong>
        {fact.note ? <span>{fact.note}</span> : null}
      </dd>
    </div>
  );
}

function SourceCard({ source, actionLabel }: { source: KnowledgeSource; actionLabel: string }) {
  return (
    <a className="knowledge-source-card" href={source.href} target="_blank" rel="noreferrer">
      <span>{source.label}</span>
      <p>{source.description}</p>
      <strong>{actionLabel}</strong>
    </a>
  );
}

export function KnowledgeCenter({
  copy,
  actionLabel,
  articles,
  locale,
}: {
  copy: KnowledgeCenterCopy;
  actionLabel: string;
  articles: readonly KnowledgeArticle[];
  locale: Locale;
}) {
  return (
    <div className="knowledge-center">
      <section className="knowledge-section knowledge-section--overview" aria-label={copy.overview.title}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.overview.eyebrow}</div>
          <h2 className="section-block__title">{copy.overview.title}</h2>
          <p className="section-block__description">{copy.overview.description}</p>
        </div>
        <div className="section-card-grid section-card-grid--three">
          {copy.overview.cards.map((card) => (
            <SectionCard key={card.title} {...card} actionLabel={actionLabel} icon="knowledge" />
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--timeline" aria-label={copy.timeline.title}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.timeline.eyebrow}</div>
          <h2 className="section-block__title">{copy.timeline.title}</h2>
          <p className="section-block__description">{copy.timeline.description}</p>
        </div>
        <div className="knowledge-timeline">
          {copy.timeline.items.map((item) => (
            <article className="knowledge-timeline__item" key={`${item.period}-${item.title}`}>
              <div className="knowledge-timeline__period">{item.period}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--standard" aria-label={copy.standard.title}>
        <div className="knowledge-section__split-header">
          <div>
            <div className="section-block__eyebrow">{copy.standard.eyebrow}</div>
            <h2 className="section-block__title">{copy.standard.title}</h2>
            <p className="section-block__description">{copy.standard.description}</p>
          </div>
        </div>
        <dl className="knowledge-fact-grid">
          {copy.standard.facts.map((fact) => (
            <FactRow key={fact.label} fact={fact} />
          ))}
        </dl>
        <div className="knowledge-mini-grid">
          {copy.standard.notes.map((card) => (
            <KnowledgeMiniCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--temperament" aria-label={copy.temperament.title}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.temperament.eyebrow}</div>
          <h2 className="section-block__title">{copy.temperament.title}</h2>
          <p className="section-block__description">{copy.temperament.description}</p>
        </div>
        <div className="knowledge-mini-grid knowledge-mini-grid--four">
          {copy.temperament.principles.map((card) => (
            <KnowledgeMiniCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--health" aria-label={copy.health.title}>
        <div className="knowledge-section__split-header">
          <div>
            <div className="section-block__eyebrow">{copy.health.eyebrow}</div>
            <h2 className="section-block__title">{copy.health.title}</h2>
            <p className="section-block__description">{copy.health.description}</p>
          </div>
          <aside className="knowledge-disclaimer">{copy.health.disclaimer}</aside>
        </div>
        <dl className="knowledge-fact-grid knowledge-fact-grid--screenings">
          {copy.health.screenings.map((fact) => (
            <FactRow key={fact.label} fact={fact} />
          ))}
        </dl>
      </section>

      <section className="knowledge-section knowledge-section--owner" aria-label={copy.ownerGuide.title}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.ownerGuide.eyebrow}</div>
          <h2 className="section-block__title">{copy.ownerGuide.title}</h2>
          <p className="section-block__description">{copy.ownerGuide.description}</p>
        </div>
        <div className="section-card-grid section-card-grid--three">
          {copy.ownerGuide.sections.map((card) => (
            <SectionCard key={card.title} {...card} actionLabel={actionLabel} icon="owner" />
          ))}
        </div>
      </section>


      <KnowledgeEducationExperience articles={articles} locale={locale} actionLabel={actionLabel} />

      <KnowledgeArticleDirectory
        articles={articles}
        locale={locale}
        title={
          locale === 'bg'
            ? 'Публични статии в секцията Знания'
            : locale === 'it'
              ? 'Articoli pubblici nel Knowledge Center'
              : 'Public Knowledge Center articles'
        }
        description={
          locale === 'bg'
            ? 'Step 30 добавя първата структура за статии, готова за админ управление: публично се показват само публикувани записи, а черновите остават само в админ слоя.'
            : locale === 'it'
              ? 'Step 30 aggiunge la prima struttura admin-ready per articoli: solo i record pubblicati appaiono nel pubblico, mentre le bozze restano nel livello admin.'
              : 'Step 30 adds the first admin-ready article structure: only published records are shown publicly, while drafts stay in the admin layer.'
        }
        actionLabel={actionLabel}
      />

      <section className="knowledge-section knowledge-section--editorial" aria-label={copy.editorialModel.title}>
        <div className="knowledge-section__split-header">
          <div>
            <div className="section-block__eyebrow">{copy.editorialModel.eyebrow}</div>
            <h2 className="section-block__title">{copy.editorialModel.title}</h2>
            <p className="section-block__description">{copy.editorialModel.description}</p>
          </div>
        </div>
        <div className="knowledge-field-list" aria-label="Future knowledge content fields">
          {copy.editorialModel.fields.map((field) => (
            <span key={field}>{field}</span>
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--sources" aria-label={copy.sources.title}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.sources.eyebrow}</div>
          <h2 className="section-block__title">{copy.sources.title}</h2>
          <p className="section-block__description">{copy.sources.description}</p>
        </div>
        <div className="knowledge-source-grid">
          {copy.sources.items.map((source) => (
            <SourceCard key={source.href} source={source} actionLabel={actionLabel} />
          ))}
        </div>
      </section>
    </div>
  );
}
