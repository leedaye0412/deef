import type { Metadata } from 'next';

import AdminForgotPasswordPageClient from '@/features/admin/auth/components/pages/AdminForgotPasswordPage';

export const metadata: Metadata = {
  title: 'Forgot Password',
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return <AdminForgotPasswordPageClient />;
}
