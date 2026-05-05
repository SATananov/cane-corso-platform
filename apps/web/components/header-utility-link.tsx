'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

function closeHeaderUtilityMenus() {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll<HTMLDetailsElement>('details[name="header-utility"]').forEach((item) => {
    item.removeAttribute('open');
  });
}

interface HeaderUtilityLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function HeaderUtilityLink({ href, className, children }: HeaderUtilityLinkProps) {
  return (
    <Link href={href} className={className} onClick={closeHeaderUtilityMenus}>
      {children}
    </Link>
  );
}
