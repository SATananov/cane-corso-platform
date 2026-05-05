'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function closeHeaderUtilityMenus() {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll<HTMLDetailsElement>('details[name="header-utility"]').forEach((item) => {
    item.removeAttribute('open');
  });
}

export function HeaderUtilityBehavior() {
  const pathname = usePathname();

  useEffect(() => {
    closeHeaderUtilityMenus();
  }, [pathname]);

  return null;
}
