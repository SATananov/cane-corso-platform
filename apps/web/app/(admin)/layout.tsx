import type { ReactNode } from 'react';
import { requireReviewAdminSession } from '@/lib/review.server';

interface AdminLayoutProps {
  children: ReactNode;
}

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireReviewAdminSession();
  return children;
}
