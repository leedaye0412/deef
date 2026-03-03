import type { Metadata } from 'next';

import ResetPasswordPageClient from '@/features/admin/auth/components/pages/ResetPasswordPage';

export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
};

export default function AdminResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
