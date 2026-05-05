import { redirect } from 'next/navigation';
import { MyDogFormWorkspace } from '../../../../../components/my-dog-form-workspace';
import { getMemberDogFormInitialValues } from '../../../../../lib/my-dogs.server';
import { getDictionary } from '../../../../../lib/i18n';
import { getCurrentLocale } from '../../../../../lib/locale.server';
import { buildAccessPath } from '@/lib/access-control';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface EditDogPageProps {
  params: Promise<{
    dogId: string;
  }>;
}

export default async function EditDogPage({ params }: EditDogPageProps) {
  const { dogId } = await params;

  try {
    const draft = await getMemberDogFormInitialValues('edit', dogId, { allowDevFallback: false });
    const locale = await getCurrentLocale();
    const t = getDictionary(locale);

    return (
      <div className="member-route-stack">
        <section className="route-hero-card route-hero-card--member">
          <div>
            <span className="eyebrow-label">{t.pages.editDog.eyebrow}</span>
            <h1 className="route-title">{t.pages.editDog.title}</h1>
            <p className="route-copy">{t.pages.editDog.description}</p>
          </div>
          <div className="route-hero-pills route-hero-pills--member">
            <a href="/guide?topic=member-workspace#member-workspace" className="route-pill subtle">{t.common.help}</a>
            <span className="route-pill">{t.pages.editDog.pillA}</span>
            <span className="route-pill">{t.pages.editDog.pillB}</span>
            <span className="route-pill">{t.pages.editDog.pillC}</span>
          </div>
        </section>

        <MyDogFormWorkspace mode="edit" initialValues={draft} dogId={dogId} />
      </div>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: `/my-dogs/${dogId}/edit` }));
    }

    throw error;
  }
}
