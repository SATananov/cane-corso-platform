import Link from 'next/link';
import type { Dog, DogMedia } from '@cane-corso-platform/contracts';
import { MyDogCard, type OwnerWorkspaceDog } from '@/components/my-dog-card';
import { OverviewStatCard } from '@/components/overview-stat-card';
import { AskMarkIPanel } from '@/components/ask-mark-i-panel';
import { EmptyStatePanel } from '@/components/empty-state-panel';
import { OwnerCaneCorsoSpotlight } from '@/components/owner-cane-corso-spotlight';
import { OwnerCaneCorsoSectionWorkspace } from '@/components/owner-cane-corso-section-workspace';
import { OwnerPhotoGuidePanel } from '@/components/owner-photo-guide-panel';
import { OwnerReviewReadinessPanel } from '@/components/owner-review-readiness-panel';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { canAccessAdminArea } from '@/lib/access-control';
import { getCurrentMemberDogMediaDocument } from '@/lib/my-dog-media.server';
import { getPublishedRegistryProfileDocument } from '@/lib/registry.server';
import { getPedigreeFilledCount, getPedigreePhotoCount } from '@/lib/dog-pedigree';
import { UsgOwnerPhotoChecklistPanel } from '@/components/usg-standard-knowledge-panel';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { UsgJourneyCarousel } from '@/components/usg-journey-carousel';
import { UsgOwnerPathTimeline } from '@/components/usg-owner-path-timeline';

interface MyDogsOverviewProps {
  dogs: Dog[];
}

async function enrichDogsWithMedia(dogs: Dog[]): Promise<OwnerWorkspaceDog[]> {
  return await Promise.all(
    dogs.map(async (dog) => {
      try {
        const document = await getCurrentMemberDogMediaDocument(dog.id, { allowDevFallback: false });
        const media = document.media
          .filter((item): item is DogMedia => item.mediaType === 'image')
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
          .slice(0, 3);

        return { ...dog, media };
      } catch {
        return { ...dog, media: [] };
      }
    }),
  );
}

const supportCopy = {
  en: {
    privateEyebrow: 'Personal first',
    privateTitle: 'What is private and what becomes public',
    privateBullets: [
      'Your Cane Corso profile stays private while you edit it.',
      'It appears in Review only after you press “Submit for review”.',
      'It becomes public only after administrator publication.',
      'Other people see only approved photos, the Cane Corso name, birth date, and owner public name.',
      'The full Cane Corso data remains visible to you and admin only.',
      'The USG certificate is a separate official decision.',
    ],
    nextEyebrow: 'Clear next step',
    nextTitle: 'What to do next',
    nextBullets: [
      'Look first at the large Cane Corso card.',
      'Check the three photo slots and profile status.',
      'Use the main action button before reading the extra notes.',
    ],
    otherProfilesEyebrow: 'Other Cane Corso profiles',
    otherProfilesTitle: 'Additional profiles stay below the main one',
    otherProfilesDescription: 'The main profile is shown first so a new user does not have to choose between duplicate panels.',
  },
  bg: {
    privateEyebrow: 'Първо лична зона',
    privateTitle: 'Какво е лично и какво става публично',
    privateBullets: [
      'Профилът на Cane Corso остава личен, докато го редактираш.',
      'Появява се в преглед само след натискане на „Изпрати за преглед“.',
      'Става публичен само след публикуване от администратор.',
      'Другите хора виждат само одобрени снимки, име на Cane Corso, дата на раждане и публично име на собственика.',
      'Пълните Cane Corso данни остават видими само за теб и админ.',
      'USG сертификатът е отделно официално решение.',
    ],
    nextEyebrow: 'Ясна следваща стъпка',
    nextTitle: 'Какво да направиш сега',
    nextBullets: [
      'Първо гледай голямата карта на Cane Corso.',
      'Провери трите места за снимки и статуса на профила.',
      'Използвай основния бутон, преди да четеш допълнителните обяснения.',
    ],
    otherProfilesEyebrow: 'Други Cane Corso профили',
    otherProfilesTitle: 'Допълнителните профили стоят под основния',
    otherProfilesDescription: 'Основният профил се показва първи, за да не избира новият потребител между повтарящи се панели.',
  },
  it: {
    privateEyebrow: 'Prima area privata',
    privateTitle: 'Cosa è privato e cosa diventa pubblico',
    privateBullets: [
      'Il profilo Cane Corso resta privato mentre lo modifichi.',
      'Entra in revisione solo dopo “Invia alla revisione”.',
      'Diventa pubblico solo dopo la pubblicazione dell’amministratore.',
      'Gli altri vedono solo foto approvate, nome del Cane Corso, data di nascita e nome pubblico del proprietario.',
      'I dati Cane Corso completi restano visibili solo a te e all’admin.',
      'Il certificato USG è una decisione ufficiale separata.',
    ],
    nextEyebrow: 'Prossimo passo chiaro',
    nextTitle: 'Cosa fare ora',
    nextBullets: [
      'Guarda prima la grande scheda del Cane Corso.',
      'Controlla i tre spazi foto e lo stato del profilo.',
      'Usa il pulsante principale prima di leggere le note aggiuntive.',
    ],
    otherProfilesEyebrow: 'Altri profili Cane Corso',
    otherProfilesTitle: 'I profili aggiuntivi restano sotto quello principale',
    otherProfilesDescription: 'Il profilo principale è mostrato per primo, così un nuovo utente non deve scegliere tra pannelli duplicati.',
  },
} as const;

export async function MyDogsOverview({ dogs }: MyDogsOverviewProps) {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const currentSession = await getOptionalCookieMemberSession();
  const isAdminWorkspace = canAccessAdminArea(currentSession?.user.role);
  const dogsWithMedia = await enrichDogsWithMedia(dogs);
  const copy = supportCopy[locale] ?? supportCopy.en;

  const adminNote = {
    en: {
      eyebrow: 'Admin note',
      title: 'Your published Cane Corso stay here too',
      body: 'This page is still your owner view. Admin review and publication stay in the admin routes.',
    },
    bg: {
      eyebrow: 'Админ бележка',
      title: 'Публикуваните ти Cane Corso също остават тук',
      body: 'Тази страница остава твоят изглед като собственик. Прегледът и публикуването са в админ маршрутите.',
    },
    it: {
      eyebrow: 'Nota amministratore',
      title: 'I tuoi Cane Corso pubblicati restano anche qui',
      body: 'Questa pagina resta la tua vista da proprietario. Revisione e pubblicazione restano nelle rotte amministratore.',
    },
  }[locale] ?? {
    eyebrow: 'Admin note',
    title: 'Your published Cane Corso stay here too',
    body: 'This page is still your owner view. Admin review and publication stay in the admin routes.',
  };

  const totalDogs = dogsWithMedia.length;
  const published = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'published').length;
  const inReview = dogsWithMedia.filter((dog) => ['submitted', 'approved'].includes(dog.lifecycleStatus)).length;
  const needsChanges = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'needs_changes').length;
  const drafts = dogsWithMedia.filter((dog) => dog.lifecycleStatus === 'draft').length;

  const featuredDog =
    dogsWithMedia.find((dog) => ['draft', 'needs_changes', 'submitted', 'approved'].includes(dog.lifecycleStatus)) ??
    dogsWithMedia.find((dog) => dog.publication) ??
    dogsWithMedia[0] ??
    null;
  const featuredRegistryDocument = featuredDog?.publication
    ? await getPublishedRegistryProfileDocument(featuredDog.publication.publicSlug, currentSession?.user.profileId ?? null)
    : null;
  const featuredGalleryImageCount = featuredDog
    ? Array.from(new Set([
        featuredDog.mainImageUrl,
        ...((featuredDog.media ?? [])
          .filter((item) => item.mediaType === 'image' && item.url)
          .map((item) => item.url)),
      ].filter(Boolean))).length
    : 0;
  const featuredPedigreeFilledCount = featuredDog ? getPedigreeFilledCount(featuredDog.pedigree) : 0;
  const featuredPedigreePhotoCount = featuredDog ? getPedigreePhotoCount(featuredDog.pedigree) : 0;
  const featuredPublicHref = featuredDog?.publication ? `/registry/${featuredDog.publication.publicSlug}` : '/registry';
  const featuredVerifyHref = featuredDog?.publication?.certificateCode
    ? `/verify/${featuredDog.publication.certificateCode}`
    : featuredDog?.publication?.verificationSlug
      ? `/verify/${featuredDog.publication.verificationSlug}`
      : '/verify';
  const secondaryDogs = featuredDog ? dogsWithMedia.filter((dog) => dog.id !== featuredDog.id) : dogsWithMedia;

  return (
    <div className="member-route-stack">
      <section className="route-hero-card route-hero-card--member">
        <div>
          <span className="eyebrow-label">{t.pages.myDogs.eyebrow}</span>
          <h1 className="route-title">{t.pages.myDogs.title}</h1>
          <p className="route-copy">{t.pages.myDogs.description}</p>
          <div className="route-hero-pills route-hero-pills--member">
            <span className="route-pill route-pill--glow">{totalDogs} {t.pages.myDogs.labels.totalProfiles.toLowerCase()}</span>
            <span className="route-pill">{published} {t.pages.myDogs.labels.published.toLowerCase()}</span>
            <span className="route-pill subtle">{inReview} {t.pages.myDogs.labels.inReview.toLowerCase()}</span>
          </div>
        </div>
        <div className="route-hero-actions">
          <Link href="/my-dogs/new" className="button-primary">
            {t.common.addNewDog}
          </Link>
          <Link href="/profile" className="button-secondary">
            {t.navigation.profile}
          </Link>
          <Link href="/guide?topic=member-workspace#member-workspace" className="button-ghost small">
            {t.common.help}
          </Link>
        </div>
      </section>

      <RoleAwareActionPanel locale={locale} surface="myDogs" role={currentSession?.user.role ?? null} />

      <AskMarkIPanel locale={locale} variant="myDogs" className="my-dogs-ask-mark-i" />

      <UsgOwnerPathTimeline
        locale={locale}
        dogs={dogsWithMedia}
        surface="myDogs"
        className="my-dogs-owner-path"
      />

      <div className="stats-grid five-up">
        <OverviewStatCard label={t.pages.myDogs.labels.totalProfiles} value={String(totalDogs)} tone="gold" />
        <OverviewStatCard label={t.pages.myDogs.labels.published} value={String(published)} tone="ivory" />
        <OverviewStatCard label={t.pages.myDogs.labels.inReview} value={String(inReview)} tone="gold" />
        <OverviewStatCard label={t.pages.myDogs.labels.needsChanges} value={String(needsChanges)} tone="ivory" />
        <OverviewStatCard label={t.pages.myDogs.labels.drafts} value={String(drafts)} tone="gold" />
      </div>

      {dogsWithMedia.length > 0 ? (
        <div className="content-grid two-columns-wide-right my-dogs-command-layout my-dogs-command-layout--simplified">
          <div className="stack-blocks">
            <OwnerCaneCorsoSpotlight
              locale={locale}
              dog={featuredDog}
              registryEntry={featuredRegistryDocument?.entry ?? null}
              variant="workspace"
              editHref={featuredDog ? `/my-dogs/${featuredDog.id}/edit` : undefined}
              mediaHref={featuredDog ? `/my-dogs/${featuredDog.id}/media` : undefined}
              publicHref={featuredPublicHref}
              verifyHref={featuredVerifyHref}
            />

            {featuredDog ? (
              <OwnerCaneCorsoSectionWorkspace
                locale={locale}
                dog={featuredDog}
                registryEntry={featuredRegistryDocument?.entry ?? null}
              />
            ) : null}

            {featuredDog ? (
              <div className="my-dogs-compact-readiness">
                <OwnerReviewReadinessPanel
                  locale={locale}
                  context="overview"
                  dogName={featuredDog.name}
                  slug={featuredDog.slug}
                  lifecycleStatus={featuredDog.lifecycleStatus}
                  visibility={featuredDog.visibility}
                  hasPublication={Boolean(featuredDog.publication)}
                  hasCertificate={Boolean(featuredDog.publication?.certificateCode)}
                  hasDateOfBirth={Boolean(featuredDog.dateOfBirth)}
                  hasColor={Boolean(featuredDog.color?.trim())}
                  hasShortDescription={Boolean(featuredDog.shortDescription?.trim())}
                  hasPrimaryImage={featuredGalleryImageCount > 0}
                  galleryImageCount={featuredGalleryImageCount}
                  pedigreeFilledCount={featuredPedigreeFilledCount}
                  pedigreePhotoCount={featuredPedigreePhotoCount}
                  editHref={`/my-dogs/${featuredDog.id}/edit`}
                  mediaHref={`/my-dogs/${featuredDog.id}/media`}
                  publicHref={featuredPublicHref}
                  verifyHref={featuredVerifyHref}
                  compact
                />
              </div>
            ) : null}

            {secondaryDogs.length > 0 ? (
              <section className="content-card my-dogs-directory-card my-dogs-directory-card--secondary">
                <div className="section-head-row">
                  <div>
                    <span className="eyebrow-label">{copy.otherProfilesEyebrow}</span>
                    <h2>{copy.otherProfilesTitle}</h2>
                    <p className="section-support-copy">{copy.otherProfilesDescription}</p>
                  </div>
                  <Link href="/my-dogs/new" className="inline-link-action">
                    {t.common.createProfile}
                  </Link>
                </div>
                <div className="dog-card-grid dog-card-grid--single-column">
                  {secondaryDogs.map((dog) => (
                    <MyDogCard key={dog.id} dog={dog} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="side-stack">
            <OwnerPhotoGuidePanel locale={locale} />

            <section className="side-info-card">
              <span className="eyebrow-label">{copy.privateEyebrow}</span>
              <h3>{copy.privateTitle}</h3>
              <ul className="side-bullet-list">
                {copy.privateBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>

            <section className="side-info-card compact">
              <span className="eyebrow-label">{copy.nextEyebrow}</span>
              <h3>{copy.nextTitle}</h3>
              <ul className="side-bullet-list side-bullet-list--compact">
                {copy.nextBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>

            {isAdminWorkspace ? (
              <section className="side-info-card compact">
                <span className="eyebrow-label">{adminNote.eyebrow}</span>
                <h3>{adminNote.title}</h3>
                <p>{adminNote.body}</p>
              </section>
            ) : null}
          </aside>
        </div>
      ) : (
        <div className="content-grid two-columns-wide-right my-dogs-command-layout my-dogs-command-layout--simplified">
          <div className="stack-blocks">
            <OwnerCaneCorsoSpotlight locale={locale} dog={null} variant="workspace" />
            <UsgJourneyCarousel locale={locale} variant="myDogsEmpty" className="my-dogs-empty-journey" />
            <EmptyStatePanel
              title={t.pages.myDogs.noDogsTitle}
              description={t.pages.myDogs.noDogsDescription}
              actionHref="/my-dogs/new"
              actionLabel={t.common.addNewDog}
            />
          </div>
          <aside className="side-stack">
            <OwnerPhotoGuidePanel locale={locale} />
            <section className="side-info-card compact">
              <span className="eyebrow-label">{copy.nextEyebrow}</span>
              <h3>{copy.nextTitle}</h3>
              <ul className="side-bullet-list side-bullet-list--compact">
                {copy.nextBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      )}
      <details className="owner-secondary-help" id="owner-photo-review-guidance">
        <summary>{locale === 'bg' ? 'Снимки и насоки за преглед' : locale === 'it' ? 'Foto e guida per revisione' : 'Photos and review guidance'}</summary>
        <UsgOwnerPhotoChecklistPanel locale={locale} />
      </details>
    </div>
  );
}
