import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { privateCookieName, verifyPrivateAccessToken } from "@/lib/site-logic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(privateCookieName)?.value;
  if (!verifyPrivateAccessToken(token, process.env.PRIVATE_ARCHIVE_PASSWORD)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path");
  if (!path || path.includes("..")) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const { data, error } = await admin.storage.from("private-archive").createSignedUrl(path, 60);
  if (error || !data) return new NextResponse("Not found", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
