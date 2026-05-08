import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { StatusBadge } from '@/components/status-badge';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPublishedRegistryDocument } from '@/lib/registry.server';
import { getReviewQueueDocument, requireReviewAdminSession } from '@/lib/review.server';
import { issueDogCertificateAction, removeDogProfileAction, removeRegistryEntryAction, revokeDogCertificateAction } from './actions';
import { AdminRegistryEvidencePolishPanel } from '@/components/admin-registry-evidence-polish-panel';
import { AdminOperationalClarityPanel } from '@/components/admin-operational-clarity-panel';
import { RegistryCertificateReleaseFlowPanel } from '@/components/registry-certificate-release-flow-panel';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Admin registry control',
    title: 'Registry management',
    description:
      'Keep your own Cane Corso in My Dogs, and manage every submitted, published, and certified profile from one separate admin layer.',
    chips: ['My Dogs = mine', 'Review = moderation', 'Registry = all profiles'],
    note:
      'Registry publication and the USG certificate are separate layers. A Cane Corso can be public in the registry without automatically receiving a certificate.',
    stats: {
      mine: 'My published Cane Corso',
      published: 'Published profiles',
      certified: 'Active certificates',
      queue: 'Profiles in moderation',
    },
    sections: {
      mine: 'My published Cane Corso',
      published: 'All published registry profiles',
      queue: 'Profiles waiting in the admin flow',
      noneMine: 'Your own published Cane Corso will continue to appear in My Dogs as soon as they are live in the registry.',
      nonePublished: 'There are no published registry profiles yet.',
      noneQueue: 'There are no profiles in moderation right now.',
      owner: 'Owner',
      location: 'Location',
      certificate: 'Certificate',
      publishedAt: 'Published',
      submittedAt: 'Submitted',
      openProfile: 'Open profile',
      verify: 'Verify',
      openReview: 'Open moderation',
      remove: 'Remove profile',
      removeFromRegistry: 'Remove from Registry',
      issueCertificate: 'Issue USG certificate',
      revokeCertificate: 'Revoke certificate',
      myDogs: 'Open My Dogs',
      review: 'Open review queue',
      status: 'Status',
      pending: 'Pending',
      notIssued: 'Not issued yet',
      profile: 'Profile',
      help: 'Help',
    },
  },
  bg: {
    eyebrow: 'Админ управление на регистъра',
    title: 'Управление на регистъра',
    description:
      'Дръж своите Cane Corso в Моите Cane Corso, а всички изпратени, публикувани и сертифицирани профили управлявай от отделния администраторски слой.',
    chips: ['Моите Cane Corso = моите', 'Преглед = модерация', 'Регистър = всички профили'],
    note:
      'Публикацията в регистъра и USG сертификатът са отделни нива. Cane Corso може да е публичен в регистъра, без автоматично да получи сертификат.',
    stats: {
      mine: 'Моите публикувани Cane Corso',
      published: 'Публикувани профили',
      certified: 'Активни сертификати',
      queue: 'Профили в модерация',
    },
    sections: {
      mine: 'Моите публикувани Cane Corso',
      published: 'Всички публикувани профили в регистъра',
      queue: 'Профили в админ потока',
      noneMine: 'Твоите публикувани Cane Corso ще продължат да се виждат в Моите Cane Corso веднага щом станат активни в регистъра.',
      nonePublished: 'Все още няма публикувани профили в регистъра.',
      noneQueue: 'В момента няма профили в модерация.',
      owner: 'Собственик',
      location: 'Локация',
      certificate: 'Сертификат',
      publishedAt: 'Публикуван',
      submittedAt: 'Изпратен',
      openProfile: 'Отвори профила',
      verify: 'Провери',
      openReview: 'Отвори модерацията',
      remove: 'Премахни профила',
      removeFromRegistry: 'Свали от регистъра',
      issueCertificate: 'Издай USG сертификат',
      revokeCertificate: 'Отмени сертификата',
      myDogs: 'Отвори Моите Cane Corso',
      review: 'Отвори прегледа',
      status: 'Статус',
      pending: 'В изчакване',
      notIssued: 'Все още не е издаден',
      profile: 'Профил',
      help: 'Помощ',
    },
  },
  it: {
    eyebrow: 'Controllo admin del registro',
    title: 'Gestione del registro',
    description:
      'Tieni i tuoi Cane Corso in I miei Cane Corso e gestisci tutti i profili inviati, pubblicati e certificati da un livello amministrativo separato.',
    chips: ['I miei Cane Corso = i miei', 'Revisione = moderazione', 'Registro = tutti i profili'],
    note:
      'La pubblicazione nel registro e il certificato USG sono livelli separati. Un Cane Corso può essere pubblico nel registro senza ricevere automaticamente un certificato.',
    stats: {
      mine: 'I miei Cane Corso pubblicati',
      published: 'Profili pubblicati',
      certified: 'Certificati attivi',
      queue: 'Profili in moderazione',
    },
    sections: {
      mine: 'I miei Cane Corso pubblicati',
      published: 'Tutti i profili pubblicati nel registro',
      queue: 'Profili nel flusso admin',
      noneMine: 'I tuoi Cane Corso pubblicati continueranno ad apparire in I miei Cane Corso appena saranno attivi nel registro.',
      nonePublished: 'Non ci sono ancora profili pubblicati nel registro.',
      noneQueue: 'Al momento non ci sono profili in moderazione.',
      owner: 'Proprietario',
      location: 'Località',
      certificate: 'Certificato',
      publishedAt: 'Pubblicato',
      submittedAt: 'Inviato',
      openProfile: 'Apri profilo',
      verify: 'Verifica',
      openReview: 'Apri moderazione',
      remove: 'Rimuovi profilo',
      removeFromRegistry: 'Rimuovi dal Registro',
      issueCertificate: 'Emetti certificato USG',
      revokeCertificate: 'Revoca certificato',
      myDogs: 'Apri I miei Cane Corso',
      review: 'Apri revisione',
      status: 'Stato',
      pending: 'In attesa',
      notIssued: 'Non ancora emesso',
      profile: 'Profilo',
      help: 'Aiuto',
    },
  },
} as const;

function formatDateLabel(locale: string, value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
}

function formatLocation(city: string | null | undefined, country: string | null | undefined, fallback: string) {
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

export default async function AdminRegistryManagementPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const session = await requireReviewAdminSession();
  const registryDocument = await getPublishedRegistryDocument();
  const reviewDocument = await getReviewQueueDocument();

  const ownPublished = registryDocument.entries.filter((entry) => entry.owner.profileId === session.user.profileId);
  const moderationItems = reviewDocument.items.filter((item) => item.status !== 'published');
  const certifiedCount = registryDocument.entries.filter((entry) => entry.certificate).length;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      accentLabel="USG admin registry"
      helpHref="/guide?topic=review#review"
      helpLabel={copy.sections.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG admin registry management"
      visualFit="contain"
      heroChips={copy.chips}
      heroNote={copy.note}
    >
      <div className="member-route-stack">
        <div className="stats-grid admin-four-up">
          <OverviewStatCard label={copy.stats.mine} value={String(ownPublished.length)} tone="gold" />
          <OverviewStatCard label={copy.stats.published} value={String(registryDocument.entries.length)} tone="ivory" />
          <OverviewStatCard label={copy.stats.certified} value={String(certifiedCount)} tone="gold" />
          <OverviewStatCard label={copy.stats.queue} value={String(moderationItems.length)} tone="ivory" />
        </div>

        <RegistryCertificateReleaseFlowPanel
          locale={locale}
          variant="admin"
          publishedCount={registryDocument.entries.length}
          certifiedCount={certifiedCount}
          queueCount={moderationItems.length}
        />
        <SectionContentGuidePanel locale={locale} surface="adminRegistry" />

        <section className="content-card admin-guide-card">
      <AdminOperationalClarityPanel locale={locale} surface="registry" />
      <AdminRegistryEvidencePolishPanel />
          <div>
            <span className="eyebrow-label">USG admin flow</span>
            <h2>{copy.title}</h2>
            <p>{copy.note}</p>
          </div>
          <div className="admin-guide-card__actions">
            <Link href="/my-dogs" className="button-primary small">
              {copy.sections.myDogs}
            </Link>
            <Link href="/review" className="button-secondary small">
              {copy.sections.review}
            </Link>
          </div>
        </section>

        <section className="content-card admin-management-card">
          <div className="section-head-row">
            <div>
              <span className="eyebrow-label">{locale === 'bg' ? 'Моите Cane Corso' : locale === 'it' ? 'I miei Cane Corso' : 'My Dogs'}</span>
              <h2>{copy.sections.mine}</h2>
            </div>
          </div>

          {ownPublished.length === 0 ? (
            <div className="empty-state-panel empty-state-panel--compact">
              <h3>{copy.sections.mine}</h3>
              <p className="empty-state-panel__description">{copy.sections.noneMine}</p>
            </div>
          ) : (
            <div className="admin-management-list">
              {ownPublished.map((entry) => {
                const hasCertificate = Boolean(entry.certificate);

                return (
                  <article className="admin-management-item" key={`mine-${entry.entryId}`}>
                    <div className="admin-management-item__head">
                      <div>
                        <span className="eyebrow-label">{copy.sections.profile}</span>
                        <h3>{entry.dog.name}</h3>
                        <p className="admin-management-item__summary">{entry.summary}</p>
                      </div>
                      <div className="admin-management-item__actions">
                        <Link href={`/registry/${entry.publicSlug}`} className="button-secondary small">
                          {copy.sections.openProfile}
                        </Link>
                        {hasCertificate ? (
                          <>
                            <Link
                              href={`/verify/${entry.certificate?.certificateCode ?? entry.certificate?.verificationSlug}`}
                              className="button-ghost small"
                            >
                              {copy.sections.verify}
                            </Link>
                            <form action={revokeDogCertificateAction}>
                              <input type="hidden" name="dogId" value={entry.dog.id} />
                              <button type="submit" className="button-secondary button-secondary--danger small">
                                {copy.sections.revokeCertificate}
                              </button>
                            </form>
                          </>
                        ) : (
                          <form action={issueDogCertificateAction}>
                            <input type="hidden" name="dogId" value={entry.dog.id} />
                            <button type="submit" className="button-primary small">
                              {copy.sections.issueCertificate}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>

                    <dl className="admin-management-item__meta-grid">
                      <div>
                        <dt>{copy.sections.owner}</dt>
                        <dd>{entry.owner.displayName}</dd>
                      </div>
                      <div>
                        <dt>{copy.sections.location}</dt>
                        <dd>{formatLocation(entry.owner.city, entry.owner.country, copy.sections.pending)}</dd>
                      </div>
                      <div>
                        <dt>{copy.sections.publishedAt}</dt>
                        <dd>{formatDateLabel(locale, entry.publishedAt) ?? copy.sections.pending}</dd>
                      </div>
                      <div>
                        <dt>{copy.sections.certificate}</dt>
                        <dd>{entry.certificate?.certificateCode ?? copy.sections.notIssued}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="content-card admin-management-card">
          <div className="section-head-row">
            <div>
              <span className="eyebrow-label">USG</span>
              <h2>{copy.sections.published}</h2>
            </div>
          </div>

          {registryDocument.entries.length === 0 ? (
            <div className="empty-state-panel empty-state-panel--compact">
              <h3>{copy.sections.published}</h3>
              <p className="empty-state-panel__description">{copy.sections.nonePublished}</p>
            </div>
          ) : (
            <div className="admin-management-list">
              {registryDocument.entries.map((entry) => {
                const hasCertificate = Boolean(entry.certificate);

                return (
                  <article className="admin-management-item" key={entry.entryId}>
                    <div className="admin-management-item__head">
                      <div>
                        <span className="eyebrow-label">{copy.sections.profile}</span>
                        <h3>{entry.dog.name}</h3>
                        <p className="admin-management-item__summary">{entry.summary}</p>
                      </div>
                      <div className="admin-management-item__actions">
                        <Link href={`/registry/${entry.publicSlug}`} className="button-secondary small">
                          {copy.sections.openProfile}
                        </Link>
                        {hasCertificate ? (
                          <>
                            <Link
                              href={`/verify/${entry.certificate?.certificateCode ?? entry.certificate?.verificationSlug}`}
                              className="button-ghost small"
                            >
                              {copy.sections.verify}
                            </Link>
                            <form action={revokeDogCertificateAction}>
                              <input type="hidden" name="dogId" value={entry.dog.id} />
                              <button type="submit" className="button-secondary button-secondary--danger small">
                                {copy.sections.revokeCertificate}
                              </button>
                            </form>
                          </>
                        ) : (
                          <form action={issueDogCertificateAction}>
                            <input type="hidden" name="dogId" value={entry.dog.id} />
                            <button type="submit" className="button-primary small">
                              {copy.sections.issueCertificate}
                            </button>
                          </form>
                        )}
                        <form action={removeRegistryEntryAction}>
                          <input type="hidden" name="dogId" value={entry.dog.id} />
                          <button type="submit" className="button-secondary button-secondary--danger small">
                            {copy.sections.removeFromRegistry}
                          </button>
                        </form>
                      </div>
                    </div>

                    <dl className="admin-management-item__meta-grid">
                      <div>
                        <dt>{copy.sections.owner}</dt>
                        <dd>{entry.owner.displayName}</dd>
                      </div>
                      <div>
                        <dt>{copy.sections.location}</dt>
                        <dd>{formatLocation(entry.owner.city, entry.owner.country, copy.sections.pending)}</dd>
                      </div>
                      <div>
                        <dt>{copy.sections.publishedAt}</dt>
                        <dd>{formatDateLabel(locale, entry.publishedAt) ?? copy.sections.pending}</dd>
                      </div>
                      <div>
                        <dt>{copy.sections.certificate}</dt>
                        <dd>{entry.certificate?.certificateCode ?? copy.sections.notIssued}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="content-card admin-management-card">
          <div className="section-head-row">
            <div>
              <span className="eyebrow-label">Review</span>
              <h2>{copy.sections.queue}</h2>
            </div>
          </div>

          {moderationItems.length === 0 ? (
            <div className="empty-state-panel empty-state-panel--compact">
              <h3>{copy.sections.queue}</h3>
              <p className="empty-state-panel__description">{copy.sections.noneQueue}</p>
            </div>
          ) : (
            <div className="admin-management-list">
              {moderationItems.map((item) => (
                <article className="admin-management-item" key={item.submissionId}>
                  <div className="admin-management-item__head">
                    <div>
                      <div className="admin-management-item__title-row">
                        <h3>{item.dog.name}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="admin-management-item__summary">{item.dog.shortDescription || copy.sections.pending}</p>
                    </div>
                    <div className="admin-management-item__actions">
                      <Link href="/review" className="button-secondary small">
                        {copy.sections.openReview}
                      </Link>
                      <form action={removeDogProfileAction}>
                        <input type="hidden" name="dogId" value={item.dog.id} />
                        <button type="submit" className="button-secondary button-secondary--danger small">
                          {copy.sections.remove}
                        </button>
                      </form>
                    </div>
                  </div>

                  <dl className="admin-management-item__meta-grid">
                    <div>
                      <dt>{copy.sections.owner}</dt>
                      <dd>{item.owner.displayName}</dd>
                    </div>
                    <div>
                      <dt>{copy.sections.location}</dt>
                      <dd>{formatLocation(item.owner.city, item.owner.country, copy.sections.pending)}</dd>
                    </div>
                    <div>
                      <dt>{copy.sections.submittedAt}</dt>
                      <dd>{formatDateLabel(locale, item.submittedAt) ?? copy.sections.pending}</dd>
                    </div>
                    <div>
                      <dt>{copy.sections.status}</dt>
                      <dd>{item.status}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
