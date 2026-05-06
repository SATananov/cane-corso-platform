import { redirect } from 'next/navigation';
import { MyDogFormWorkspace } from '../../../../components/my-dog-form-workspace';
import { getMemberDogFormInitialValues } from '../../../../lib/my-dogs.server';
import { getDictionary } from '../../../../lib/i18n';
import { getCurrentLocale } from '../../../../lib/locale.server';
import { buildAccessPath } from '@/lib/access-control';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

export default async function NewDogPage() {
  try {
    const draft = await getMemberDogFormInitialValues('create', undefined, { allowDevFallback: false });
    const locale = await getCurrentLocale();
    const t = getDictionary(locale);

    return (
      <div className="member-route-stack">
        <section className="route-hero-card route-hero-card--member route-hero-card--form-first">
          <div>
            <span className="eyebrow-label">{t.pages.newDog.eyebrow}</span>
            <h1 className="route-title">{t.pages.newDog.title}</h1>
            <p className="route-copy">{t.pages.newDog.description}</p>
          </div>
          <div className="route-hero-pills route-hero-pills--member">
            <a href="/guide?topic=member-workspace#member-workspace" className="route-pill subtle">{t.common.help}</a>
            <span className="route-pill">{t.pages.newDog.pillA}</span>
            <span className="route-pill">{t.pages.newDog.pillB}</span>
            <span className="route-pill">{t.pages.newDog.pillC}</span>
          </div>
        </section>

        <MyDogFormWorkspace mode="create" initialValues={draft} />
      </div>
    );
  } catch (error) {
    if (error instanceof SessionUnavailableError) {
      redirect(buildAccessPath({ intent: 'member', notice: 'member_required', next: '/my-dogs/new' }));
    }

    throw error;
  }
}
