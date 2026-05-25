"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      aria-label="Sair"
      className={cn(
        "inline-flex items-center justify-center h-9 w-9 rounded-md text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors duration-200 disabled:opacity-50",
        className
      )}
    >
      <LogOut size={16} strokeWidth={1.5} />
    </button>
  );
}
