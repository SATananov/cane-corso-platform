'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function closeHeaderUtilityMenus() {
  if (typeof document === 'undefined') {
    return;
  }

  document.querySelectorAll<HTMLDetailsElement>('details[name="header-utility"][open]').forEach((item) => {
    item.open = false;
  });
}

export function HeaderUtilityAutoClose() {
  const pathname = usePathname();

  useEffect(() => {
    closeHeaderUtilityMenus();
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest('.utility-menu__link')) {
        window.requestAnimationFrame(closeHeaderUtilityMenus);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
