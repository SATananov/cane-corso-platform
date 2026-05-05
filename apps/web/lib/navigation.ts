import type { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n';

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

const publicNavigationLabels: Record<Locale, { gallery: string; community: string }> = {
  en: {
    gallery: 'Gallery',
    community: 'Community',
  },
  bg: {
    gallery: 'Галерия',
    community: 'Общност',
  },
  it: {
    gallery: 'Galleria',
    community: 'Comunità',
  },
};

export function getPublicNavigation(locale: Locale): NavItem[] {
  const t = getDictionary(locale);
  const labels = publicNavigationLabels[locale] ?? publicNavigationLabels.en;

  return [
    { label: t.navigation.home, href: '/platform' },
    { label: t.navigation.registry, href: '/registry' },
    { label: labels.gallery, href: '/gallery' },
    { label: t.navigation.knowledge, href: '/knowledge' },
    { label: t.navigation.partners, href: '/partners' },
    { label: labels.community, href: '/community' },
  ];
}

export function getMemberNavigation(locale: Locale): NavItem[] {
  const t = getDictionary(locale);
  return [
    { label: t.navigation.myDogs, href: '/my-dogs' },
    { label: t.navigation.ecosystem, href: '/ecosystem' },
    { label: t.navigation.profile, href: '/profile' },
  ];
}

export function getAdminNavigation(locale: Locale): NavItem[] {
  const t = getDictionary(locale);
  return [
    { label: t.navigation.reviewQueue, href: '/review' },
    { label: t.navigation.adminRegistry, href: '/admin/registry' },
    { label: t.navigation.adminMembers, href: '/admin/members' },
    { label: t.navigation.adminPartners, href: '/admin/partners' },
    { label: t.navigation.adminEcosystem, href: '/admin/ecosystem' },
  ];
}
