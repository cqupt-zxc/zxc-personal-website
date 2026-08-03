import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/site-logic";
export async function GET(request: Request) { const url = new URL(request.url); const code = url.searchParams.get("code"); const origin = url.origin; if (!code) return NextResponse.redirect(`${origin}/admin/login`); const supabase = await createSupabaseServerClient(); const { data } = await supabase.auth.exchangeCodeForSession(code); if (!isAdminEmail(data.user?.email, process.env.ADMIN_EMAILS)) { await supabase.auth.signOut(); return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`); } return NextResponse.redirect(`${origin}/admin`); }
