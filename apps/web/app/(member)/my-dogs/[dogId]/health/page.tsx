import Link from 'next/link';
import { redirect } from 'next/navigation';
import { OwnerHealthGrowthTracker } from '@/components/owner-health-growth-tracker';
import { buildAccessPath } from '@/lib/access-control';
import { getCurrentLocale } from '@/lib/locale.server';
import { getCurrentMemberDogProfileDocument, listMemberDogs } from '@/lib/my-dogs.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface DogHealthPageProps {
  params: Promise<{
    dogId: string;
  }>;
}

const copy = {
  en: {
    back: 'Back to My Cane Corso',
    eyebrow: 'Private owner tool',
    title: 'Health and growth diary',
    description: 'A practical owner workspace for monthly weight, vaccine history, parasite care and veterinary notes.',
    editProfile: 'Edit profile',
    media: 'Photos',
    notFoundTitle: 'Cane Corso not found',
    notFoundBody: 'This private tracker opens only for Cane Corso profiles that belong to the current member.',
  },
  bg: {
    back: 'Назад към Моите Cane Corso',
    eyebrow: 'Личен инструмент за собственика',
    title: 'Здравен дневник и растеж',
    description: 'Практично място за тегло по месеци, история на ваксините, обезпаразитяване и ветеринарни бележки.',
    editProfile: 'Редактирай профила',
    media: 'Снимки',
    notFoundTitle: 'Cane Corso профилът не е намерен',
    notFoundBody: 'Този личен дневник се отваря само за Cane Corso профили на текущия член.',
  },
  it: {
    back: 'Indietro a I miei Cane Corso',
    eyebrow: 'Strumento privato proprietario',
    title: 'Diario salute e crescita',
    description: 'Uno spazio pratico per peso mensile, storia vaccini, antiparassitari e note veterinarie.',
    editProfile: 'Modifica profilo',
    media: 'Foto',
    notFoundTitle: 'Profilo Cane Corso non trovato',
    notFoundBody: 'Questo diario privato si apre solo per profili Cane Corso del membro corrente.',
  },
} as const;

export default async function DogHealthPage({ params }: DogHealthPageProps) {
  const { dogId } = await params;

  try {
    const locale = await getCurrentLocale();
    const t = copy[locale] ?? copy.en;
    const document = await getCurrentMemberDogProfileDocument(dogId, { allowDevFallback: false });

    if (!document) {
      return (
        <div className="member-route-stack">
          <section className="route-hero-card route-hero-card--member">
            <div>
              <span className="eyebrow-label">{t.eyebrow}</span>
              <h1 className="route-title">{t.notFoundTitle}</h1>
              <p className="route-copy">{t.notFoundBody}</p>
            </div>
            <div className="route-hero-actions">
              <Link href="/my-dogs" className="button-secondary">{t.back}</Link>
            </div>
          </section>
        </div>
      );
    }

    const dogs = await listMemberDogs({ allowDevFallback: false });
    const dog = dogs.find((item) => item.id === document.dogId);
    const dogName = dog?.name ?? document.profile.name ?? 'Cane Corso';

    return (
      <div className="member-route-stack">
        <section className="route-hero-card route-hero-card--member">
          <div>
            <span className="eyebrow-label">{t.eyebrow}</span>
            <h1 className="route-title">{t.title}</h1>
            <p className="route-copy">{t.description}</p>
            <div className="route-hero-pills route-hero-pills--member">
              <span className="route-pill route-pill--glow">{dogName}</span>
              <span className="route-pill">{t.title}</span>
            </div>
          </div>
          <div className="route-hero-actions">
            <Link href="/my-dogs" className="button-secondary">{t.back}</Link>
            <Link href={`/my-dogs/${document.dogId}/edit`} className="button-ghost">{t.editProfile}</Link>
            <Link href={`/my-dogs/${document.dogId}/media`} className="button-ghost">{t.media}</Link>
          </div>
        </section>

        <OwnerHealthGrowthTracker
          locale={locale}
          dogId={document.dogId}
          dogName={dogName}
          dateOfBirth={document.profile.dateOfBirth}
        />
      </div>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: `/my-dogs/${dogId}/health` }));
    }

    throw error;
  }
}
