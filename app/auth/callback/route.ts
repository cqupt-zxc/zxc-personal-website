import { NextResponse } from "next/server";
import { isEnvironmentConfigurationError, requirePublicSupabaseConfig } from "@/lib/env/public";
import { requireAdminEmailAllowlist } from "@/lib/env/server";
import { isAdminEmail } from "@/lib/site-logic";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;
  if (!code) return NextResponse.redirect(`${origin}/admin/login`);

  let adminEmails: string[];

  try {
    requirePublicSupabaseConfig();
    adminEmails = requireAdminEmailAllowlist();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) {
      return NextResponse.redirect(`${origin}/admin/login?error=configuration`);
    }
    throw error;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.exchangeCodeForSession(code);
  if (!isAdminEmail(data.user?.email, adminEmails)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`);
  }
  return NextResponse.redirect(`${origin}/admin`);
}
