import type { Metadata } from 'next';

import AuthCallbackPageClient from '@/features/admin/auth/components/pages/AuthCallbackPage';

export const metadata: Metadata = {
  title: 'Auth Callback',
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return <AuthCallbackPageClient />;
}
