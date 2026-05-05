import type { KnowledgeArticle, KnowledgeArticleStatus } from '@cane-corso-platform/contracts';
import type { Locale } from '@/lib/i18n';
import {
  knowledgeArticleAdminModelFields,
  knowledgeArticleCategoryLabels,
  knowledgeArticleStatusLabels,
  knowledgeReadingLevelLabels,
} from '@/lib/knowledge-articles';

interface KnowledgeAdminDashboardProps {
  articles: readonly KnowledgeArticle[];
  locale: Locale;
}

type KnowledgeAdminCopy = {
  modelEyebrow: string;
  modelTitle: string;
  modelDescription: string;
  queueEyebrow: string;
  queueTitle: string;
  queueDescription: string;
  sourceCount: string;
  relatedCount: string;
  adminNotes: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewDescription: string;
  totalArticles: string;
  publicArticles: string;
  protectedArticles: string;
  sourceReferences: string;
  workflowEyebrow: string;
  workflowTitle: string;
  workflowDescription: string;
  guardrailsEyebrow: string;
  guardrailsTitle: string;
  guardrailsDescription: string;
  readyNext: string;
  workflow: readonly { title: string; description: string }[];
  guardrails: readonly string[];
};

const copyByLocale: Record<Locale, KnowledgeAdminCopy> = {
  en: {
    modelEyebrow: 'Admin article model',
    modelTitle: 'CMS-ready fields',
    modelDescription:
      'Knowledge data is still static, but the article shape is ready for a future database-backed admin editor.',
    queueEyebrow: 'Knowledge records',
    queueTitle: 'Current article seeds',
    queueDescription:
      'Published articles are visible publicly. Draft, pending, and archived records stay admin-only until a future workflow publishes them.',
    sourceCount: 'sources',
    relatedCount: 'related',
    adminNotes: 'Admin notes',
    overviewEyebrow: 'Editorial control center',
    overviewTitle: 'Knowledge publishing overview',
    overviewDescription:
      'A single admin view for article status, public visibility, source discipline, and future editor readiness.',
    totalArticles: 'Total records',
    publicArticles: 'Public articles',
    protectedArticles: 'Protected drafts',
    sourceReferences: 'Source references',
    workflowEyebrow: 'Future workflow',
    workflowTitle: 'Draft → Review → Publish → Maintain',
    workflowDescription:
      'The foundation now documents how Knowledge should move from admin drafting to trusted public education without weakening locked platform logic.',
    guardrailsEyebrow: 'Safety boundary',
    guardrailsTitle: 'What this batch keeps protected',
    guardrailsDescription:
      'This is still a safe foundation. No database writes, no public draft access, no registry or certificate side effects.',
    readyNext: 'Ready for next layer',
    workflow: [
      { title: 'Draft', description: 'Admin creates or imports the article privately, with category, reading level, and source fields.' },
      { title: 'Review', description: 'Editorial review checks clarity, safety language, source discipline, and platform boundaries.' },
      { title: 'Publish', description: 'Only published records become visible on public Knowledge pages and static article routes.' },
      { title: 'Maintain', description: 'Future review labels and source updates keep the article useful as the platform grows.' },
    ],
    guardrails: [
      'Draft, pending, and archived articles remain admin-only.',
      'Public Knowledge pages use published-only records.',
      'The admin view is read-only until database writes are added deliberately.',
      'Registry, Certificate, Gallery, Verify, and Ecosystem logic stay outside this layer.',
    ],
  },
  bg: {
    modelEyebrow: 'Админ модел за статии',
    modelTitle: 'Полета, готови за бъдещо админ управление',
    modelDescription:
      'Съдържанието все още е статично, но структурата на статията вече е готова за бъдещ админ редактор, свързан с база данни.',
    queueEyebrow: 'Записи в знанията',
    queueTitle: 'Текущи начални статии',
    queueDescription:
      'Публикуваните статии се виждат публично. Чернови, чакащи и архивирани записи остават само за админ, докато бъдещ работен поток ги публикува.',
    sourceCount: 'източника',
    relatedCount: 'свързани',
    adminNotes: 'Админ бележки',
    overviewEyebrow: 'Редакционен контролен център',
    overviewTitle: 'Преглед на публикуването в знанията',
    overviewDescription:
      'Един админ изглед за статус на статиите, публична видимост, дисциплина на източниците и готовност за бъдещ редактор.',
    totalArticles: 'Общо записи',
    publicArticles: 'Публични статии',
    protectedArticles: 'Защитени чернови',
    sourceReferences: 'Източници',
    workflowEyebrow: 'Бъдещ работен поток',
    workflowTitle: 'Чернова → Преглед → Публикуване → Поддръжка',
    workflowDescription:
      'Основата вече описва как знанията трябва да преминават от админ чернова към доверено публично обучение, без да се разклащат заключените логики.',
    guardrailsEyebrow: 'Граница на безопасност',
    guardrailsTitle: 'Какво остава защитено в този пакет',
    guardrailsDescription:
      'Това все още е безопасна основа. Няма записи към база данни, няма публичен достъп до чернови и няма странични ефекти върху регистър или сертификати.',
    readyNext: 'Готово за следващ слой',
    workflow: [
      { title: 'Чернова', description: 'Админът създава или подготвя статията частно, с категория, ниво на четене и източници.' },
      { title: 'Преглед', description: 'Редакционният преглед проверява яснота, безопасен език, източници и граници на платформата.' },
      { title: 'Публикуване', description: 'Само публикуваните записи стават видими в публичните Knowledge страници и статичните адреси.' },
      { title: 'Поддръжка', description: 'Бъдещи етикети за преглед и обновени източници пазят статиите полезни, докато платформата расте.' },
    ],
    guardrails: [
      'Чернови, чакащи и архивирани статии остават само за админ.',
      'Публичните Knowledge страници използват само публикувани записи.',
      'Админ изгледът остава само за преглед, докато записите към база данни не се добавят умишлено.',
      'Регистър, Сертификат, Галерия, Проверка и Екосистема остават извън този слой.',
    ],
  },
  it: {
    modelEyebrow: 'Modello admin articoli',
    modelTitle: 'Campi pronti per futura CMS',
    modelDescription:
      'Il contenuto resta statico, ma la struttura articolo è pronta per un futuro editor admin collegato al database.',
    queueEyebrow: 'Record Knowledge',
    queueTitle: 'Seed articoli correnti',
    queueDescription:
      'Gli articoli pubblicati sono pubblici. Bozze, pending e archiviati restano solo admin fino al workflow futuro.',
    sourceCount: 'fonti',
    relatedCount: 'correlati',
    adminNotes: 'Note admin',
    overviewEyebrow: 'Centro editoriale admin',
    overviewTitle: 'Panoramica pubblicazione Knowledge',
    overviewDescription:
      'Una vista admin per stato articoli, visibilità pubblica, disciplina fonti e preparazione editor futura.',
    totalArticles: 'Record totali',
    publicArticles: 'Articoli pubblici',
    protectedArticles: 'Bozze protette',
    sourceReferences: 'Fonti',
    workflowEyebrow: 'Workflow futuro',
    workflowTitle: 'Bozza → Revisione → Pubblicazione → Manutenzione',
    workflowDescription:
      'La fondazione documenta come Knowledge deve passare da bozza admin a formazione pubblica affidabile senza toccare le logiche bloccate.',
    guardrailsEyebrow: 'Confine sicurezza',
    guardrailsTitle: 'Cosa resta protetto in questo pacchetto',
    guardrailsDescription:
      'È ancora una fondazione sicura. Nessuna scrittura database, nessun accesso pubblico alle bozze e nessun effetto su registro o certificati.',
    readyNext: 'Pronto per il prossimo livello',
    workflow: [
      { title: 'Bozza', description: 'L’admin prepara l’articolo privatamente con categoria, livello lettura e fonti.' },
      { title: 'Revisione', description: 'La revisione controlla chiarezza, sicurezza, fonti e confini della piattaforma.' },
      { title: 'Pubblicazione', description: 'Solo i record pubblicati diventano visibili nelle pagine Knowledge pubbliche.' },
      { title: 'Manutenzione', description: 'Future etichette di revisione e aggiornamenti fonti mantengono utile il contenuto.' },
    ],
    guardrails: [
      'Bozze, pending e archiviati restano solo admin.',
      'Le pagine pubbliche usano solo record pubblicati.',
      'La vista admin resta read-only finché le scritture database non vengono aggiunte consapevolmente.',
      'Registro, Certificato, Galleria, Verifica ed Ecosistema restano fuori da questo livello.',
    ],
  },
};

const countByStatus = (articles: readonly KnowledgeArticle[], status: KnowledgeArticleStatus) =>
  articles.filter((article) => article.status === status).length;

export function KnowledgeAdminDashboard({ articles, locale }: KnowledgeAdminDashboardProps) {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const categoryLabels = knowledgeArticleCategoryLabels[locale] ?? knowledgeArticleCategoryLabels.en;
  const statusLabels = knowledgeArticleStatusLabels[locale] ?? knowledgeArticleStatusLabels.en;
  const readingLabels = knowledgeReadingLevelLabels[locale] ?? knowledgeReadingLevelLabels.en;
  const modelFields = knowledgeArticleAdminModelFields[locale] ?? knowledgeArticleAdminModelFields.en;
  const publishedCount = countByStatus(articles, 'published');
  const protectedCount = articles.length - publishedCount;
  const sourceCount = articles.reduce((total, article) => total + article.sourceReferences.length, 0);

  return (
    <div className="knowledge-admin-dashboard">
      <section className="knowledge-section knowledge-section--admin-overview" aria-label={copy.overviewTitle}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.overviewEyebrow}</div>
          <h2 className="section-block__title">{copy.overviewTitle}</h2>
          <p className="section-block__description">{copy.overviewDescription}</p>
        </div>
        <div className="knowledge-admin-metric-grid">
          <div className="knowledge-admin-metric-card">
            <span>{copy.totalArticles}</span>
            <strong>{articles.length}</strong>
          </div>
          <div className="knowledge-admin-metric-card knowledge-admin-metric-card--public">
            <span>{copy.publicArticles}</span>
            <strong>{publishedCount}</strong>
          </div>
          <div className="knowledge-admin-metric-card knowledge-admin-metric-card--protected">
            <span>{copy.protectedArticles}</span>
            <strong>{protectedCount}</strong>
          </div>
          <div className="knowledge-admin-metric-card">
            <span>{copy.sourceReferences}</span>
            <strong>{sourceCount}</strong>
          </div>
        </div>
      </section>

      <section className="knowledge-section knowledge-section--admin-workflow" aria-label={copy.workflowTitle}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.workflowEyebrow}</div>
          <h2 className="section-block__title">{copy.workflowTitle}</h2>
          <p className="section-block__description">{copy.workflowDescription}</p>
        </div>
        <div className="knowledge-admin-workflow-grid">
          {copy.workflow.map((item, index) => (
            <article className="knowledge-admin-workflow-card" key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--admin-model" aria-label={copy.modelTitle}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.modelEyebrow}</div>
          <h2 className="section-block__title">{copy.modelTitle}</h2>
          <p className="section-block__description">{copy.modelDescription}</p>
        </div>
        <div className="knowledge-field-list">
          {modelFields.map((field) => (
            <span key={field}>{field}</span>
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--admin-queue" aria-label={copy.queueTitle}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.queueEyebrow}</div>
          <h2 className="section-block__title">{copy.queueTitle}</h2>
          <p className="section-block__description">{copy.queueDescription}</p>
        </div>

        <div className="knowledge-admin-list">
          {articles.map((article) => (
            <article className="knowledge-admin-row" key={`${article.locale}-${article.slug}`}>
              <div>
                <div className="knowledge-admin-row__meta">
                  <span>{statusLabels[article.status]}</span>
                  <span>{categoryLabels[article.category]}</span>
                  <span>{readingLabels[article.readingLevel]}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </div>
              <dl>
                <div>
                  <dt>{copy.sourceCount}</dt>
                  <dd>{article.sourceReferences.length}</dd>
                </div>
                <div>
                  <dt>{copy.relatedCount}</dt>
                  <dd>{article.relatedSlugs.length}</dd>
                </div>
              </dl>
              {article.adminNotes ? <p className="knowledge-admin-row__notes">{copy.adminNotes}: {article.adminNotes}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-section knowledge-section--admin-guardrails" aria-label={copy.guardrailsTitle}>
        <div className="section-block__header">
          <div className="section-block__eyebrow">{copy.guardrailsEyebrow}</div>
          <h2 className="section-block__title">{copy.guardrailsTitle}</h2>
          <p className="section-block__description">{copy.guardrailsDescription}</p>
        </div>
        <div className="knowledge-admin-guardrail-grid">
          {copy.guardrails.map((guardrail) => (
            <div className="knowledge-admin-guardrail-card" key={guardrail}>
              <span>USG</span>
              <p>{guardrail}</p>
            </div>
          ))}
        </div>
        <p className="knowledge-admin-ready-label">{copy.readyNext}</p>
      </section>
    </div>
  );
}
