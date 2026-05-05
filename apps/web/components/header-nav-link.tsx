'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface HeaderNavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  title?: string;
  exact?: boolean;
}

function normalizeHrefPath(href: string) {
  return href.split('#')[0]?.split('?')[0] || href;
}

function resolveActive(pathname: string, href: string, exact: boolean) {
  const hrefPath = normalizeHrefPath(href);

  if (exact) {
    return pathname === hrefPath;
  }

  if (hrefPath === '/platform') {
    return pathname === hrefPath;
  }

  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

export function HeaderNavLink({ href, className, children, title, exact = false }: HeaderNavLinkProps) {
  const pathname = usePathname();
  const isActive = resolveActive(pathname, href, exact);

  return (
    <Link
      href={href}
      className={[className, isActive ? 'is-active' : ''].filter(Boolean).join(' ')}
      aria-current={isActive ? 'page' : undefined}
      title={title}
    >
      {children}
    </Link>
  );
}
