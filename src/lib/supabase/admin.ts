import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from '@lib/supabase/types';

// 서버 전용: Admin(service_role) 클라이언트 (RLS 우회)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
