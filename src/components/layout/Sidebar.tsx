"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Folder,
  Lightbulb,
  GitBranch,
  Link2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReleaseToolUser } from "@/lib/auth/session";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "Ideas", href: "/ideas", icon: Lightbulb },
];

export function Sidebar({ user }: { user: ReleaseToolUser }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      className="sticky top-0 flex h-screen flex-col border-r border-[var(--bc-border)] bg-white p-5 px-4"
    >
      <div className="flex items-center gap-2.5 px-2 pb-6">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-base font-extrabold tracking-tight"
          style={{ color: "var(--bc-brand-500)" }}
        >
          B
        </div>
        <div className="text-[15px] font-bold leading-none tracking-tight">
          BuildCore
          <span className="mt-0.5 block text-[11px] font-medium leading-none text-slate-400">
            Release v2
          </span>
        </div>
      </div>

      <div className="px-2 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon size={16} className={active ? "text-brand-600" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Connected
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-slate-600">
          <GitBranch size={16} />
          GitHub: bid-sheet-v2
        </div>
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-slate-600">
          <Link2 size={16} />
          BuildCore portal
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2.5 border-t border-[var(--bc-border)] p-2.5 pt-4">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ background: "var(--bc-brand-600)" }}
        >
          {user.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-[13px] font-semibold">{user.displayName}</div>
          <div className="truncate text-[11px] text-slate-400">{user.roleLabel}</div>
        </div>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Sign out"
          >
            <Settings size={14} />
          </button>
        </form>
      </div>
    </aside>
  );
}
