'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

type AdminTaskItem = {
  href: string;
  label: string;
  description: string;
  primary?: boolean;
};

const copyByLocale: Record<Locale, { label: string; eyebrow: string; title: string; closeHint: string; items: AdminTaskItem[]; center: string }> = {
  en: {
    label: 'Admin',
    eyebrow: 'Admin tasks',
    title: 'Choose what you need to do',
    closeHint: 'Work by task, not by guessing pages.',
    center: 'Admin center',
    items: [
      { href: '/review', label: 'Review pending', description: 'Approve, return, publish, or decide certificate flow.', primary: true },
      { href: '/admin/members', label: 'Members', description: 'See owners and the private Cane Corso data they saved.' },
      { href: '/admin/registry', label: 'Registry control', description: 'Manage already public Registry profiles and certificates.' },
      { href: '/admin/partners', label: 'Partners', description: 'Review and manage trusted partner applications.' },
      { href: '/admin/ecosystem', label: 'Ecosystem', description: 'Moderate services, places, and community submissions.' },
      { href: '/admin/knowledge', label: 'Knowledge', description: 'Manage educational articles and breed guidance.' },
    ],
  },
  bg: {
    label: 'Админ',
    eyebrow: 'Админ задачи',
    title: 'Избери какво искаш да направиш',
    closeHint: 'Работи по задача, не по търсене на страници.',
    center: 'Админ център',
    items: [
      { href: '/review', label: 'Преглед на чакащи', description: 'Одобри, върни, публикувай или реши сертификатния поток.', primary: true },
      { href: '/admin/members', label: 'Потребители', description: 'Виж owners и личните Cane Corso данни, които са запазили.' },
      { href: '/admin/registry', label: 'Registry контрол', description: 'Управлявай вече публични Registry профили и сертификати.' },
      { href: '/admin/partners', label: 'Партньори', description: 'Преглеждай и управлявай trusted partner кандидатури.' },
      { href: '/admin/ecosystem', label: 'Екосистема', description: 'Модерирай услуги, места и community предложения.' },
      { href: '/admin/knowledge', label: 'Знания', description: 'Управлявай образователни статии и breed guidance.' },
    ],
  },
  it: {
    label: 'Admin',
    eyebrow: 'Attività admin',
    title: 'Scegli cosa vuoi fare',
    closeHint: 'Lavora per attività, non cercando pagine.',
    center: 'Centro admin',
    items: [
      { href: '/review', label: 'Review in attesa', description: 'Approva, rimanda, pubblica o decidi il certificato.', primary: true },
      { href: '/admin/members', label: 'Membri', description: 'Vedi owner e dati Cane Corso privati salvati.' },
      { href: '/admin/registry', label: 'Controllo Registro', description: 'Gestisci profili Registro già pubblici e certificati.' },
      { href: '/admin/partners', label: 'Partner', description: 'Rivedi e gestisci candidature partner trusted.' },
      { href: '/admin/ecosystem', label: 'Ecosystem', description: 'Modera servizi, luoghi e proposte community.' },
      { href: '/admin/knowledge', label: 'Knowledge', description: 'Gestisci articoli educativi e guida breed.' },
    ],
  },
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminTaskMenu({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const isAdminActive = pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/review');

  return (
    <details className="admin-task-menu">
      <summary className={`admin-task-menu__trigger${isAdminActive ? ' is-active' : ''}`} aria-label={copy.title}>
        <span>{copy.label}</span>
        <span className="admin-task-menu__chevron" aria-hidden="true">▾</span>
      </summary>

      <div className="admin-task-menu__panel" role="menu" aria-label={copy.title}>
        <div className="admin-task-menu__head">
          <span className="eyebrow-label">{copy.eyebrow}</span>
          <strong>{copy.title}</strong>
          <p>{copy.closeHint}</p>
        </div>

        <div className="admin-task-menu__list">
          {copy.items.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                href={item.href}
                className={`admin-task-menu__item${item.primary ? ' admin-task-menu__item--primary' : ''}${active ? ' is-active' : ''}`}
                key={item.href}
                role="menuitem"
                aria-current={active ? 'page' : undefined}
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </Link>
            );
          })}
        </div>

        <Link href="/admin" className="admin-task-menu__center" role="menuitem">
          {copy.center}
        </Link>
      </div>
    </details>
  );
}
