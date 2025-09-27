// 브라우저 전용
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@lib/supabase/types";

export const supabaseBrowser = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: true, autoRefreshToken: true } }
  );
