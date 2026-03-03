import type { Metadata } from 'next';

import AdminLoginPageClient from '@/features/admin/auth/components/pages/AdminLoginPage';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginPageClient />;
}
