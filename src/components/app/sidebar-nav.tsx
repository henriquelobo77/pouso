"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Feather,
  Home,
  Inbox,
  ListTodo,
  Sparkles,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  status: "live" | "soon";
};

const items: NavItem[] = [
  { href: "/app", label: "Hoje", icon: Home, status: "live" },
  { href: "/app/inbox", label: "Inbox", icon: Inbox, status: "soon" },
  { href: "/app/tarefas", label: "Tarefas", icon: ListTodo, status: "soon" },
  { href: "/app/agenda", label: "Agenda", icon: Calendar, status: "soon" },
  { href: "/app/financas", label: "Finanças", icon: Wallet, status: "soon" },
  { href: "/app/habitos", label: "Hábitos", icon: Sparkles, status: "soon" },
  { href: "/app/diario", label: "Diário", icon: Feather, status: "soon" },
  { href: "/app/notas", label: "Notas", icon: BookOpen, status: "soon" },
  { href: "/app/projetos", label: "Projetos", icon: Target, status: "soon" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {items.map(({ href, label, icon: Icon, status }) => {
        const active = pathname === href;
        const isSoon = status === "soon";
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-3 px-3 py-2 rounded-md text-[15px] transition-colors duration-200",
              active
                ? "bg-primary-soft text-fg font-medium"
                : "text-fg-muted hover:bg-surface-2 hover:text-fg",
              isSoon && !active && "opacity-70"
            )}
          >
            <Icon
              size={18}
              strokeWidth={1.5}
              className={cn(active ? "text-primary" : "")}
            />
            <span className="flex-1">{label}</span>
            {isSoon && (
              <Badge variant="outline" className="text-[10px] py-0">
                em breve
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
