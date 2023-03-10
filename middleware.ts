import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { checkIfUserIsAdminById } from "./supabase/services/auth-service";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/p")) {
    // This logic is only applied to /p routes
    const supabase = createMiddlewareSupabaseClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check auth condition
    if (session?.user.email?.endsWith("@gmail.com")) {
      // Authentication successful, forward request to protected route.
      return res;
    }

    // Check if user is admin
    const { isAdmin } = await checkIfUserIsAdminById(supabase, session?.user.id);
    if (isAdmin) return res;
  }

  // Auth condition not met, redirect to home page.
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.searchParams.set(`ALISIN-MOTO-PAG-PRODUCTION-NA-redirectedFrom`, req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/p/:path*"],
};
