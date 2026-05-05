"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function closeHeaderMenus() {
  document.querySelectorAll<HTMLDetailsElement>('.header-menu[open]').forEach((menu) => {
    menu.open = false;
  });
}

export function HeaderProfileMenuBehavior() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? '';

  useEffect(() => {
    closeHeaderMenus();
  }, [pathname, searchKey]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const clickedMenuItem = target.closest('.header-menu__item');
      if (clickedMenuItem) {
        closeHeaderMenus();
        return;
      }

      const anyMenuContainsTarget = Array.from(document.querySelectorAll<HTMLElement>('.header-menu')).some((menu) =>
        menu.contains(target),
      );

      if (!anyMenuContainsTarget) {
        closeHeaderMenus();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeHeaderMenus();
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return null;
}
