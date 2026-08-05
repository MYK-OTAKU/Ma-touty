import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// SSR-compatible Supabase client (for Server Components and Route Handlers)
// Uses cookie-based session management
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component - can be ignored
          }
        },
      },
    }
  );
}
