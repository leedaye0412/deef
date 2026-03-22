import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import AdminProjectDetailPreviewPage from '@/features/admin/projects/components/pages/AdminProjectDetailPreviewPage';
import { supabaseServer } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Admin Project Preview',
  robots: { index: false, follow: false },
};

export default async function AdminProjectPreviewRoutePage() {
  const sb = await supabaseServer();
  const { data, error } = await sb.auth.getUser();

  if (error || !data.user) {
    redirect('/admin/login');
  }

  return <AdminProjectDetailPreviewPage />;
}
