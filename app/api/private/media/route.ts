import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isEnvironmentConfigurationError, requirePublicSupabaseConfig } from "@/lib/env/public";
import { requirePrivateArchiveConfig } from "@/lib/env/server";
import { privateCookieName, verifyPrivateAccessToken } from "@/lib/site-logic";

export async function GET(request: NextRequest) {
  let privateArchive;
  let publicSupabase;

  try {
    privateArchive = requirePrivateArchiveConfig();
    publicSupabase = requirePublicSupabaseConfig();
  } catch (error) {
    if (isEnvironmentConfigurationError(error)) {
      return new NextResponse("Private media service is unavailable.", { status: 503 });
    }
    throw error;
  }

  const token = request.cookies.get(privateCookieName)?.value;
  if (!verifyPrivateAccessToken(token, privateArchive.password)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path");
  if (!path || path.includes("..")) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const admin = createClient(publicSupabase.url, privateArchive.serviceRoleKey);

  try {
    const { data, error } = await admin.storage.from("private-archive").createSignedUrl(path, 60);
    if (error) return new NextResponse("Unable to access private media.", { status: error.status === 404 ? 404 : 500 });
    if (!data) return new NextResponse("Not found", { status: 404 });
    return NextResponse.redirect(data.signedUrl);
  } catch {
    return new NextResponse("Unable to access private media.", { status: 500 });
  }
}
