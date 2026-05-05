import Link from 'next/link';
import type { ReactNode } from 'react';
import { getCurrentLocale } from '@/lib/locale.server';
import { requireReviewAdminSession } from '@/lib/review.server';

type LocaleKey = 'en' | 'bg' | 'it';

interface AdminLayoutProps {
  children: ReactNode;
}

export const dynamic = 'force-dynamic';

const copyByLocale = {
  en: {
    label: 'Admin workflow',
    hint: 'Approve Cane Corso profiles in Review first.',
    review: 'Review',
    members: 'Members',
    registry: 'Registry',
    partners: 'Partners',
    ecosystem: 'Ecosystem',
    knowledge: 'Knowledge',
    center: 'Center',
  },
  bg: {
    label: 'Админ работа',
    hint: 'Одобряването на Cane Corso започва от Преглед.',
    review: 'Преглед',
    members: 'Потребители',
    registry: 'Registry',
    partners: 'Партньори',
    ecosystem: 'Екосистема',
    knowledge: 'Знания',
    center: 'Център',
  },
  it: {
    label: 'Flusso admin',
    hint: 'L’approvazione Cane Corso inizia da Review.',
    review: 'Review',
    members: 'Membri',
    registry: 'Registro',
    partners: 'Partner',
    ecosystem: 'Ecosystem',
    knowledge: 'Knowledge',
    center: 'Centro',
  },
} as const;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireReviewAdminSession();
  const locale = await getCurrentLocale();
  const copy = copyByLocale[(locale as LocaleKey) ?? 'en'] ?? copyByLocale.en;

  const links = [
    { href: '/review', label: copy.review, primary: true },
    { href: '/admin/members', label: copy.members },
    { href: '/admin/registry', label: copy.registry },
    { href: '/admin/partners', label: copy.partners },
    { href: '/admin/ecosystem', label: copy.ecosystem },
    { href: '/admin/knowledge', label: copy.knowledge },
    { href: '/admin', label: copy.center },
  ];

  return (
    <>
      <nav className="admin-workflow-strip" aria-label={copy.label}>
        <div className="admin-workflow-strip__copy">
          <span>{copy.label}</span>
          <strong>{copy.hint}</strong>
        </div>
        <div className="admin-workflow-strip__links">
          {links.map((link) => (
            <Link className={`admin-workflow-strip__link${link.primary ? ' admin-workflow-strip__link--primary' : ''}`} href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      {children}
    </>
  );
}
