import { supabaseServer } from '@lib/supabase/server';
import { ApiError } from '@shared/errors/ApiError';
import { ErrorCode } from '@shared/types';

import { AuthContextSchema, type AuthContext } from '../model/schemas';

export async function requireAuthenticated(): Promise<AuthContext> {
  const sb = await supabaseServer();
  const { data, error } = await sb.auth.getUser();

  if (error || !data.user) {
    throw new ApiError('Authentication required', ErrorCode.UNAUTHORIZED, 401, error);
  }

  return AuthContextSchema.parse({
    userId: data.user.id,
    email: data.user.email ?? null,
  });
}
