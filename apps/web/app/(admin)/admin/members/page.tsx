import Link from 'next/link';
import type { DogLifecycleStatus } from '@cane-corso-platform/contracts';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { PageShell } from '@/components/page-shell';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { StatusBadge } from '@/components/status-badge';
import { ImageLightbox } from '@/components/image-lightbox';
import { getCurrentLocale } from '@/lib/locale.server';
import { requireReviewAdminSession } from '@/lib/review.server';
import { canAccessAdminArea } from '@/lib/access-control';
import {
  certificates,
  dogMedia,
  dogs,
  getDb,
  profiles,
  registryEntries,
  users,
} from '@cane-corso-platform/db';
import { deactivateMemberAction, deleteMemberProfileAction } from './actions';
import { issueDogCertificateAction, removeDogProfileAction, revokeDogCertificateAction } from '../registry/actions';

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    eyebrow: 'Admin member control',
    title: 'Members',
    description:
      'Inspect the real member footprint behind every account — full identity details, Cane Corso profiles, public registry state, certificates, and quick admin removal actions.',
    chips: ['Full member view', 'Cane Corso details', 'Safer admin control'],
    note:
      'This layer is no longer just an access list. It now shows what each member actually owns and what is already public in the registry.',
    stats: {
      active: 'Active identities',
      admins: 'Admin identities',
      members: 'Member identities',
      publishedDogs: 'Public Cane Corso',
    },
    labels: {
      list: 'Member profiles with registry presence',
      reviewHint: 'This page shows owner data. To approve or publish a Cane Corso profile, open Review first.',
      openReview: 'Open Review',
      email: 'Email',
      role: 'Role',
      access: 'Access',
      dogs: 'Cane Corso',
      published: 'Published',
      certified: 'Certified',
      locale: 'Locale',
      location: 'Location',
      joined: 'Joined',
      fullName: 'Full name',
      current: 'Current admin session',
      disable: 'Disable access',
      deleteProfile: 'Delete profile',
      deleteDog: 'Delete Cane Corso',
      noDogs: 'No Cane Corso profiles are connected to this member yet.',
      emptyTitle: 'No active identities found',
      emptyDescription: 'Once active members exist in the platform, they will appear here for full admin management.',
      help: 'Help',
      openRegistry: 'Open public profile',
      verify: 'Verify',
      issueCertificate: 'Issue USG certificate',
      revokeCertificate: 'Revoke certificate',
      profileDetails: 'Member details',
      dogDetails: 'Cane Corso details',
      gallery: 'Images',
      notPublished: 'Not public yet',
      notCertified: 'No active certificate',
      created: 'Created',
      updated: 'Updated',
      pedigree: 'Pedigree',
      birth: 'Birth date',
      color: 'Color',
      sex: 'Sex',
      status: 'Status',
      certificate: 'Certificate',
      publicEntry: 'Public entry',
      safeHint: 'Safer than hard-delete',
      notAvailable: 'Not available',
      publishedSince: 'Public since',
    },
    roleLabels: {
      admin: 'Admin',
      super_admin: 'Super admin',
      reviewer: 'Reviewer',
      partner: 'Partner',
      member: 'Member',
    },
    sexLabels: {
      male: 'Male',
      female: 'Female',
    },
  },
  bg: {
    eyebrow: 'Админ управление на потребители',
    title: 'Потребители',
    description:
      'Тук вече виждаш реалното съдържание зад всеки профил — пълна информация за потребителя, неговите Cane Corso профили, публичния registry статус, сертификатите и бързите админ действия.',
    chips: ['Пълен member view', 'Детайли за Cane Corso', 'Истински админ контрол'],
    note:
      'Тази страница вече не е само списък за достъп. Тя показва какво реално притежава всеки потребител и какво вече е публично в регистъра.',
    stats: {
      active: 'Активни идентичности',
      admins: 'Админ идентичности',
      members: 'Членски идентичности',
      publishedDogs: 'Публични Cane Corso',
    },
    labels: {
      list: 'Потребители с реално registry присъствие',
      reviewHint: 'Тази страница показва owner данни. За одобрение или публикуване на Cane Corso профил първо отвори Преглед.',
      openReview: 'Отвори Преглед',
      email: 'Имейл',
      role: 'Роля',
      access: 'Достъп',
      dogs: 'Cane Corso',
      published: 'Публикувани',
      certified: 'Сертифицирани',
      locale: 'Език',
      location: 'Локация',
      joined: 'Създаден',
      fullName: 'Пълно име',
      current: 'Текуща админ сесия',
      disable: 'Спри достъпа',
      deleteProfile: 'Изтрий профила',
      deleteDog: 'Изтрий Cane Corso',
      noDogs: 'Този потребител все още няма свързани Cane Corso профили.',
      emptyTitle: 'Няма активни идентичности',
      emptyDescription: 'Когато в платформата има активни членове, те ще се виждат тук за пълен админ контрол.',
      help: 'Помощ',
      openRegistry: 'Отвори публичния профил',
      verify: 'Провери',
      issueCertificate: 'Издай USG сертификат',
      revokeCertificate: 'Отнеми сертификата',
      profileDetails: 'Детайли за потребителя',
      dogDetails: 'Детайли за Cane Corso',
      gallery: 'Снимки',
      notPublished: 'Още не е публичен',
      notCertified: 'Няма активен сертификат',
      created: 'Създаден',
      updated: 'Обновен',
      pedigree: 'Родословие',
      birth: 'Дата на раждане',
      color: 'Цвят',
      sex: 'Пол',
      status: 'Статус',
      certificate: 'Сертификат',
      publicEntry: 'Публичен профил',
      safeHint: 'По-безопасно от hard delete',
      notAvailable: 'Няма',
      publishedSince: 'Публичен от',
    },
    roleLabels: {
      admin: 'Админ',
      super_admin: 'Супер админ',
      reviewer: 'Ревю админ',
      partner: 'Партньор',
      member: 'Член',
    },
    sexLabels: {
      male: 'Мъжки',
      female: 'Женски',
    },
  },
  it: {
    eyebrow: 'Controllo admin membri',
    title: 'Membri',
    description:
      'Qui vedi il contenuto reale dietro ogni profilo — identità completa, profili Cane Corso, stato pubblico nel registro, certificati e azioni admin rapide.',
    chips: ['Vista completa membri', 'Dettagli Cane Corso', 'Controllo admin reale'],
    note:
      'Questa pagina non è più solo una lista accessi. Mostra cosa possiede davvero ogni membro e cosa è già pubblico nel registro.',
    stats: {
      active: 'Identità attive',
      admins: 'Identità admin',
      members: 'Identità membri',
      publishedDogs: 'Cane Corso pubblici',
    },
    labels: {
      list: 'Membri con presenza reale nel registro',
      reviewHint: 'Questa pagina mostra i dati owner. Per approvare o pubblicare un profilo Cane Corso, apri prima Review.',
      openReview: 'Apri Review',
      email: 'Email',
      role: 'Ruolo',
      access: 'Accesso',
      dogs: 'Cane Corso',
      published: 'Pubblicati',
      certified: 'Certificati',
      locale: 'Lingua',
      location: 'Località',
      joined: 'Creato',
      fullName: 'Nome completo',
      current: 'Sessione admin corrente',
      disable: 'Disattiva accesso',
      deleteProfile: 'Elimina profilo',
      deleteDog: 'Elimina Cane Corso',
      noDogs: 'Questo membro non ha ancora profili Cane Corso collegati.',
      emptyTitle: 'Nessuna identità attiva trovata',
      emptyDescription: 'Quando esistono membri attivi nella piattaforma, appariranno qui per il pieno controllo admin.',
      help: 'Aiuto',
      openRegistry: 'Apri profilo pubblico',
      verify: 'Verifica',
      issueCertificate: 'Emetti certificato USG',
      revokeCertificate: 'Revoca certificato',
      profileDetails: 'Dettagli membro',
      dogDetails: 'Dettagli Cane Corso',
      gallery: 'Immagini',
      notPublished: 'Non ancora pubblico',
      notCertified: 'Nessun certificato attivo',
      created: 'Creato',
      updated: 'Aggiornato',
      pedigree: 'Pedigree',
      birth: 'Data di nascita',
      color: 'Colore',
      sex: 'Sesso',
      status: 'Stato',
      certificate: 'Certificato',
      publicEntry: 'Profilo pubblico',
      safeHint: 'Più sicuro del hard delete',
      notAvailable: 'Non disponibile',
      publishedSince: 'Pubblico dal',
    },
    roleLabels: {
      admin: 'Admin',
      super_admin: 'Super admin',
      reviewer: 'Reviewer',
      partner: 'Partner',
      member: 'Membro',
    },
    sexLabels: {
      male: 'Maschio',
      female: 'Femmina',
    },
  },
} as const;

type LocaleKey = keyof typeof copyByLocale;

function formatDate(locale: string, value: string | Date | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
}

function formatFullName(firstName: string | null, lastName: string | null, displayName: string) {
  const fullName = `${firstName?.trim() ?? ''} ${lastName?.trim() ?? ''}`.trim();
  return fullName || displayName;
}

function formatLocation(city: string | null, country: string | null, fallback: string) {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
}

function normalizeLocaleLabel(locale: string | null, fallback: string) {
  return locale?.trim()?.toUpperCase() || fallback;
}

export default async function AdminMembersPage() {
  const locale = await getCurrentLocale();
  const copy = copyByLocale[locale as LocaleKey] ?? copyByLocale.en;
  const session = await requireReviewAdminSession();
  const db = getDb();

  const identities = await db
    .select({
      profile: profiles,
      user: users,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(eq(profiles.isActive, true))
    .orderBy(desc(profiles.createdAt))
    .limit(48);

  const adminCount = identities.filter((identity) => canAccessAdminArea(identity.profile.role)).length;
  const memberCount = identities.length - adminCount;
  const profileIds = identities.map((identity) => identity.profile.id);

  const dogRows =
    profileIds.length > 0
      ? await db
          .select({
            ownerProfileId: dogs.ownerProfileId,
            dogId: dogs.id,
            name: dogs.name,
            slug: dogs.slug,
            sex: dogs.sex,
            dateOfBirth: dogs.dateOfBirth,
            color: dogs.color,
            city: dogs.city,
            country: dogs.country,
            pedigreeNumber: dogs.pedigreeNumber,
            shortDescription: dogs.shortDescription,
            mainImageUrl: dogs.mainImageUrl,
            visibility: dogs.visibility,
            lifecycleStatus: dogs.lifecycleStatus,
            createdAt: dogs.createdAt,
            updatedAt: dogs.updatedAt,
            publicSlug: registryEntries.publicSlug,
            publishedAt: registryEntries.publishedAt,
            certificateCode: certificates.certificateCode,
            verificationSlug: certificates.verificationSlug,
          })
          .from(dogs)
          .leftJoin(registryEntries, and(eq(registryEntries.dogId, dogs.id), eq(registryEntries.isActive, true)))
          .leftJoin(certificates, and(eq(certificates.dogId, dogs.id), eq(certificates.status, 'active')))
          .where(inArray(dogs.ownerProfileId, profileIds))
          .orderBy(desc(registryEntries.publishedAt), desc(dogs.updatedAt))
      : [];

  const dogIds = dogRows.map((dog) => dog.dogId);
  const mediaRows =
    dogIds.length > 0
      ? await db
          .select({
            dogId: dogMedia.dogId,
            publicUrl: dogMedia.publicUrl,
            isPrimary: dogMedia.isPrimary,
            sortOrder: dogMedia.sortOrder,
          })
          .from(dogMedia)
          .where(inArray(dogMedia.dogId, dogIds))
          .orderBy(desc(dogMedia.isPrimary), asc(dogMedia.sortOrder))
      : [];

  const mediaByDogId = new Map<string, string[]>();
  for (const media of mediaRows) {
    if (!media.publicUrl) {
      continue;
    }

    const bucket = mediaByDogId.get(media.dogId) ?? [];
    if (!bucket.includes(media.publicUrl)) {
      bucket.push(media.publicUrl);
    }
    mediaByDogId.set(media.dogId, bucket);
  }

  const dogsByProfileId = new Map<string, typeof dogRows>();
  for (const dog of dogRows) {
    const bucket = dogsByProfileId.get(dog.ownerProfileId) ?? [];
    bucket.push(dog);
    dogsByProfileId.set(dog.ownerProfileId, bucket);
  }

  const publishedDogsCount = dogRows.filter((dog) => Boolean(dog.publicSlug)).length;

  return (
    <PageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      accentLabel="USG admin members"
      helpHref="/guide?topic=member-workspace#member-workspace"
      helpLabel={copy.labels.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG admin members"
      visualFit="contain"
      heroChips={copy.chips}
      heroNote={copy.note}
    >
      <div className="member-route-stack">
        <div className="stats-grid admin-four-up">
          <OverviewStatCard label={copy.stats.active} value={String(identities.length)} tone="gold" />
          <OverviewStatCard label={copy.stats.admins} value={String(adminCount)} tone="ivory" />
          <OverviewStatCard label={copy.stats.members} value={String(memberCount)} tone="gold" />
          <OverviewStatCard label={copy.stats.publishedDogs} value={String(publishedDogsCount)} tone="ivory" />
        </div>

        <section className="content-card admin-management-card">
          <div className="section-head-row">
            <div>
              <span className="eyebrow-label">USG member control</span>
              <h2>{copy.labels.list}</h2>
            </div>
          </div>

          <div className="admin-inline-guidance admin-inline-guidance--review">
            <p>{copy.labels.reviewHint}</p>
            <Link href="/review" className="button-primary small">
              {copy.labels.openReview}
            </Link>
          </div>

          {identities.length === 0 ? (
            <div className="empty-state-panel empty-state-panel--compact">
              <h3>{copy.labels.emptyTitle}</h3>
              <p className="empty-state-panel__description">{copy.labels.emptyDescription}</p>
            </div>
          ) : (
            <div className="admin-management-list">
              {identities.map((identity) => {
                const isCurrent = identity.profile.id === session.user.profileId;
                const identityDogs = dogsByProfileId.get(identity.profile.id) ?? [];
                const isAdminIdentity = canAccessAdminArea(identity.profile.role);
                const certifiedCount = identityDogs.filter((dog) => Boolean(dog.certificateCode)).length;
                const publishedCount = identityDogs.filter((dog) => Boolean(dog.publicSlug)).length;
                const fullName = formatFullName(identity.profile.firstName, identity.profile.lastName, identity.profile.displayName);
                const roleLabel = copy.roleLabels[identity.profile.role as keyof typeof copy.roleLabels] ?? identity.profile.role;

                return (
                  <article className="admin-management-item admin-member-profile-card" key={identity.profile.id}>
                    <div className="admin-management-item__head admin-member-profile-card__head">
                      <div>
                        <span className="eyebrow-label">{copy.labels.access}</span>
                        <div className="admin-member-profile-card__title-row">
                          <h3>{identity.profile.displayName}</h3>
                          <span className="route-pill">{roleLabel}</span>
                          {isCurrent ? <span className="route-pill route-pill--glow">{copy.labels.current}</span> : null}
                        </div>
                        <p className="admin-management-item__summary">{identity.user.email}</p>
                      </div>

                      <div className="admin-management-item__actions">
                        {!isCurrent ? (
                          <form action={deactivateMemberAction}>
                            <input type="hidden" name="profileId" value={identity.profile.id} />
                            <button type="submit" className="button-secondary button-secondary--danger small">
                              {copy.labels.disable}
                            </button>
                          </form>
                        ) : null}
                        {!isCurrent && !isAdminIdentity ? (
                          <form action={deleteMemberProfileAction}>
                            <input type="hidden" name="profileId" value={identity.profile.id} />
                            <button type="submit" className="button-secondary button-secondary--danger small">
                              {copy.labels.deleteProfile}
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>

                    <dl className="admin-management-item__meta-grid admin-member-profile-card__meta-grid">
                      <div>
                        <dt>{copy.labels.fullName}</dt>
                        <dd>{fullName}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.email}</dt>
                        <dd>{identity.user.email}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.locale}</dt>
                        <dd>{normalizeLocaleLabel(identity.profile.locale, copy.labels.notAvailable)}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.location}</dt>
                        <dd>{formatLocation(identity.profile.city, identity.profile.country, copy.labels.notAvailable)}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.joined}</dt>
                        <dd>{formatDate(locale, identity.profile.createdAt)}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.dogs}</dt>
                        <dd>{String(identityDogs.length)}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.published}</dt>
                        <dd>{String(publishedCount)}</dd>
                      </div>
                      <div>
                        <dt>{copy.labels.certified}</dt>
                        <dd>{String(certifiedCount)}</dd>
                      </div>
                    </dl>

                    <section className="admin-member-dogs-section">
                      <div className="section-head-row section-head-row--compact">
                        <div>
                          <span className="eyebrow-label">USG Cane Corso</span>
                          <h3>{copy.labels.dogDetails}</h3>
                        </div>
                      </div>

                      {identityDogs.length === 0 ? (
                        <p className="admin-member-dogs-section__empty">{copy.labels.noDogs}</p>
                      ) : (
                        <div className="admin-member-dogs-grid">
                          {identityDogs.map((dog) => {
                            const gallery = [dog.mainImageUrl, ...(mediaByDogId.get(dog.dogId) ?? [])].filter(
                              (value, index, array): value is string => Boolean(value) && array.indexOf(value) === index,
                            );
                            const certificateValue = dog.certificateCode ?? copy.labels.notCertified;
                            const publicValue = dog.publicSlug ?? copy.labels.notPublished;

                            return (
                              <article className="admin-member-dog-card" key={dog.dogId}>
                                <div className={`admin-member-dog-card__media${gallery[0] ? ' has-image' : ''}`}>
                                  {gallery[0] ? (
                                    <ImageLightbox src={gallery[0]} alt={dog.name} imageClassName="admin-member-dog-card__image" />
                                  ) : (
                                    <div className="admin-member-dog-card__placeholder">UNICO SUO GENERE</div>
                                  )}
                                </div>

                                <div className="admin-member-dog-card__body">
                                  <div className="admin-member-dog-card__head">
                                    <div>
                                      <span className="eyebrow-label">{copy.labels.dogs}</span>
                                      <h4>{dog.name}</h4>
                                    </div>
                                    <div className="admin-member-dog-card__status-row">
                                      <StatusBadge status={dog.lifecycleStatus as DogLifecycleStatus} />
                                      {dog.publicSlug ? <span className="route-pill">{copy.labels.publicEntry}</span> : null}
                                      {dog.certificateCode ? <span className="route-pill route-pill--glow">USG</span> : null}
                                    </div>
                                  </div>

                                  <dl className="admin-member-dog-card__meta-grid">
                                    <div>
                                      <dt>{copy.labels.sex}</dt>
                                      <dd>{copy.sexLabels[dog.sex as keyof typeof copy.sexLabels] ?? dog.sex}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.color}</dt>
                                      <dd>{dog.color ?? copy.labels.notAvailable}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.location}</dt>
                                      <dd>{formatLocation(dog.city, dog.country, copy.labels.notAvailable)}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.birth}</dt>
                                      <dd>{formatDate(locale, dog.dateOfBirth)}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.pedigree}</dt>
                                      <dd>{dog.pedigreeNumber ?? copy.labels.notAvailable}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.created}</dt>
                                      <dd>{formatDate(locale, dog.createdAt)}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.updated}</dt>
                                      <dd>{formatDate(locale, dog.updatedAt)}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.publishedSince}</dt>
                                      <dd>{formatDate(locale, dog.publishedAt)}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.publicEntry}</dt>
                                      <dd>{publicValue}</dd>
                                    </div>
                                    <div>
                                      <dt>{copy.labels.certificate}</dt>
                                      <dd>{certificateValue}</dd>
                                    </div>
                                  </dl>

                                  <p className="admin-member-dog-card__description">{dog.shortDescription ?? copy.labels.notAvailable}</p>

                                  {gallery.length > 1 ? (
                                    <div className="admin-member-dog-card__gallery">
                                      {gallery.slice(0, 4).map((imageUrl) => (
                                        <div className="admin-member-dog-card__thumb" key={imageUrl}>
                                          <ImageLightbox src={imageUrl} alt={dog.name} />
                                        </div>
                                      ))}
                                    </div>
                                  ) : null}

                                  <div className="admin-member-dog-card__actions">
                                    {dog.publicSlug ? (
                                      <Link href={`/registry/${dog.publicSlug}`} className="button-secondary small">
                                        {copy.labels.openRegistry}
                                      </Link>
                                    ) : null}
                                    {dog.verificationSlug || dog.certificateCode ? (
                                      <Link href={`/verify/${dog.certificateCode ?? dog.verificationSlug}`} className="button-ghost small">
                                        {copy.labels.verify}
                                      </Link>
                                    ) : null}
                                    {dog.publicSlug && !dog.certificateCode ? (
                                      <form action={issueDogCertificateAction}>
                                        <input type="hidden" name="dogId" value={dog.dogId} />
                                        <button type="submit" className="button-secondary small">
                                          {copy.labels.issueCertificate}
                                        </button>
                                      </form>
                                    ) : null}
                                    {dog.certificateCode ? (
                                      <form action={revokeDogCertificateAction}>
                                        <input type="hidden" name="dogId" value={dog.dogId} />
                                        <button type="submit" className="button-secondary small">
                                          {copy.labels.revokeCertificate}
                                        </button>
                                      </form>
                                    ) : null}
                                    <form action={removeDogProfileAction}>
                                      <input type="hidden" name="dogId" value={dog.dogId} />
                                      <button type="submit" className="button-secondary button-secondary--danger small">
                                        {copy.labels.deleteDog}
                                      </button>
                                    </form>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
