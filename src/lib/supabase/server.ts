// 서버 전용: RSC/Route/서버액션
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@lib/supabase/types";

export const supabaseServer = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {

          }
        },
      },
    }
  );
};

