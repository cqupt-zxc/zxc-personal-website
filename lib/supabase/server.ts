import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePublicSupabaseConfig } from "@/lib/env/public";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = requirePublicSupabaseConfig();
  return createServerClient(url, anonKey, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: (items: Array<{ name: string; value: string; options: CookieOptions }>) => { try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} } }
  });
}
