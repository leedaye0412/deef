'use client';

import { useEffect } from 'react';

export default function AuthHashRedirector() {
  useEffect(() => {
    const { pathname, search, hash } = window.location;

    if (!hash) return;
    if (pathname.startsWith('/auth/callback')) return;

    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const hasAuthPayload =
      !!params.get('access_token') ||
      !!params.get('refresh_token') ||
      !!params.get('error') ||
      !!params.get('error_description');

    if (!hasAuthPayload) return;

    window.location.replace(`/auth/callback${search}${hash}`);
  }, []);

  return null;
}
