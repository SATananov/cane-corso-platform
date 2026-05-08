import { PageShell } from '@/components/page-shell';
import { PublicRegistryOverview } from '@/components/public-registry-overview';
import { RegistryCertificateReleaseFlowPanel } from '@/components/registry-certificate-release-flow-panel';
import { RoleAwareActionPanel } from '@/components/role-aware-action-panel';
import { canAccessAdminArea } from '@/lib/access-control';
import { getDictionary } from '@/lib/i18n';
import { getCurrentLocale } from '@/lib/locale.server';
import { getPublishedRegistryDocument } from '@/lib/registry.server';
import { getOptionalCookieMemberSession } from '@/lib/session.server';
import { SectionContentGuidePanel } from '@/components/section-content-guide-panel';

export const dynamic = 'force-dynamic';

export default async function RegistryPage() {
  const locale = await getCurrentLocale();
  const t = getDictionary(locale);
  const document = await getPublishedRegistryDocument();
  const currentSession = await getOptionalCookieMemberSession();
  const isAdminViewer = canAccessAdminArea(currentSession?.user.role ?? null);
  const certifiedCount = document.entries.filter((entry) => Boolean(entry.certificate)).length;

  return (
    <PageShell
      eyebrow={t.pages.registry.eyebrow}
      title={t.pages.registry.title}
      description={t.pages.registry.description}
      accentLabel={t.pageShell.accentLabel}
      helpHref="/guide?topic=registry#registry"
      helpLabel={t.common.help}
      visualSrc="/brand/seal/usg-seal-wide.png"
      visualAlt="USG registry seal"
      visualFit="contain"
      heroChips={[t.pages.registry.heroChipPublished, t.pages.registry.heroChipCertificate, t.pages.registry.heroChipVerify]}
      heroNote={t.pages.registry.heroNote}
    >
      <RoleAwareActionPanel locale={locale} surface="registry" role={currentSession?.user.role ?? null} />
      <SectionContentGuidePanel locale={locale} surface="registry" />
      <PublicRegistryOverview
        document={document}
        locale={locale}
        hasMemberAccess={Boolean(currentSession)}
        isAdminViewer={isAdminViewer}
      />
      <RegistryCertificateReleaseFlowPanel
        locale={locale}
        variant="public"
        publishedCount={document.entries.length}
        certifiedCount={certifiedCount}
      />
    </PageShell>
  );
}
