import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public browser client (automatically handles cookies for Next.js SSR & Middleware)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side client (admin operations, only used in Route Handlers / Server Actions)
export function createServerClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Helper: generate public URL for a file in Supabase Storage
export function getPublicUrl(bucket: string, path: string): string {
  if (!path) return "";
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Type definitions matching our schema
export interface Page {
  id: string;
  position: number;
  template: "text-only" | "text-photo" | "full-photo" | "thank-you";
  title: string | null;
  subtitle: string | null;
  body: string | null;
  polaroid_caption: string | null;
  typing_effect: boolean;
  created_at: string;
  updated_at: string;
  // Joined media
  media?: Media[];
}

export interface Media {
  id: string;
  page_id: string | null;
  type: "photo" | "video" | "audio";
  storage_path: string;
  bucket_name: string;
  display_order: number;
  is_global: boolean;
  alt_text: string | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string | null;
  updated_at: string;
}

export type SettingsMap = Record<string, string>;
