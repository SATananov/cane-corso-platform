import { redirect } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { PartnerApplicationWorkspace } from '@/components/partner-application-workspace';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPartnerUiCopy } from '@/lib/partner-copy';
import { getCurrentPartnerWorkspaceDocument } from '@/lib/partners.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

interface PartnerApplyPageProps {
  searchParams?: Promise<{
    onboarding?: string;
  }> | {
    onboarding?: string;
  };
}

export default async function PartnerApplyPage({ searchParams }: PartnerApplyPageProps) {
  const currentSession = await getOptionalCookieMemberSession();

  if (!currentSession) {
    redirect('/access?intent=partner');
  }

  const locale = await getCurrentLocale();
  const copy = getPartnerUiCopy(locale);
  const document = await getCurrentPartnerWorkspaceDocument();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const showOnboardingNotice = resolvedSearchParams?.onboarding === 'partner';

  return (
    <PageShell
      eyebrow={copy.workspace.eyebrow}
      title={copy.workspace.title}
      description={copy.workspace.description}
      accentLabel={copy.labels.workspace}
      helpHref="/guide?topic=partners#partners"
      helpLabel={copy.labels.help ?? (locale === 'bg' ? 'Помощ' : locale === 'it' ? 'Aiuto' : 'Help')}
    >
      <RoleAwareActionPanel locale={locale} surface="partnerApply" role={currentSession.user.role} />
      <PartnerApplicationWorkspace document={document} locale={locale} showOnboardingNotice={showOnboardingNotice} />
      <SectionContentGuidePanel locale={locale} surface="partnerApply" />
    </PageShell>
  );
}
