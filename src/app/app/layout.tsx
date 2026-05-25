import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HorizontalLogo } from "@/components/brand/horizontal-logo";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { SignOutButton } from "@/components/app/signout-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.display_name ?? user.email?.split("@")[0] ?? "você";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex bg-bg">
      {/* ─── Sidebar ─── */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-border bg-surface/40">
        <div className="h-16 px-6 flex items-center border-b border-border">
          <Link href="/app" className="block">
            <HorizontalLogo markSize={24} textSize="text-2xl" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <SidebarNav />
        </div>
        <div className="px-6 py-4 border-t border-border">
          <span className="caption">v0 · fase 0</span>
        </div>
      </aside>

      {/* ─── Conteúdo ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 px-6 md:px-8 border-b border-border bg-bg/85 backdrop-blur-sm flex items-center justify-between">
          <Link
            href="/app"
            className="md:hidden inline-flex items-center"
            aria-label="pouso"
          >
            <HorizontalLogo markSize={22} textSize="text-xl" />
          </Link>
          <div className="hidden md:block" aria-hidden />
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-fg-muted">olá,</span>
              <span className="text-sm font-medium text-fg">
                {displayName}
              </span>
            </span>
            <span
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-primary-soft text-fg font-medium text-sm"
              aria-hidden
            >
              {initial}
            </span>
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
