import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next assets)
     * - favicon.ico, icon.*, apple-icon (favicons)
     * - imagens em public/ (svg, png, jpg, etc)
     * - manifest.json
     */
    "/((?!_next/static|_next/image|favicon.ico|icon\\.svg|icon1|icon2|apple-icon|manifest.json|brand/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
