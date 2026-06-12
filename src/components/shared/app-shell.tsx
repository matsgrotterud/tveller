"use client";

import type { LucideIcon } from "lucide-react";
import { Menu, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CommandMenu } from "@/components/shared/command-menu";
import { Logo } from "@/components/shared/logo";
import { NotificationCenter } from "@/components/shared/notification-center";
import { RoleSwitcher } from "@/components/shared/role-switcher";
import { Select } from "@/components/ui/input";
import { PROJECTS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { PortalKey } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export function AppShell({
  portal,
  navItems,
  portalLabel,
  userName,
  orgName,
  showProjectSwitcher,
  children,
}: {
  portal: PortalKey;
  navItems: NavItem[];
  portalLabel: string;
  userName: string;
  orgName: string;
  showProjectSwitcher?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resetDemo } = useStore();

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="Hovednavigasjon">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== `/${portal}` && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-evergreen-50 text-evergreen-800" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon className={cn("h-4 w-4", active && "text-evergreen-600")} aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-evergreen-600 px-1.5 text-[11px] font-semibold text-white">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link href="/" aria-label="Til forsiden">
            <Logo />
          </Link>
        </div>
        <div className="border-b border-border px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-evergreen-700">{portalLabel}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{orgName}</p>
        </div>
        {nav}
        <div className="border-t border-border p-3">
          <button
            onClick={resetDemo}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Tilbakestill demodata
          </button>
          <div className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-evergreen-100 text-xs font-bold text-evergreen-800">
              {initials(userName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{orgName}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-evergreen-950/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 hover:bg-muted cursor-pointer" aria-label="Lukk meny">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur md:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden cursor-pointer" aria-label="Åpne meny">
            <Menu className="h-5 w-5" />
          </button>
          {showProjectSwitcher && (
            <div className="hidden items-center gap-2 md:flex">
              <Select defaultValue="p-middelthunet" className="w-44" aria-label="Velg prosjekt">
                {PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <div className="flex-1" />
          <CommandMenu />
          <NotificationCenter portal={portal} />
          <RoleSwitcher />
        </header>
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
