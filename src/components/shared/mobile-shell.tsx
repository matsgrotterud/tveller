"use client";

import { CalendarDays, FileText, Home, MessageSquare, MoreHorizontal, ShieldCheck, ShoppingBag, Sparkles, Users, Wrench, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CommandMenu } from "@/components/shared/command-menu";
import { Logo } from "@/components/shared/logo";
import { NotificationCenter } from "@/components/shared/notification-center";
import { RoleSwitcher } from "@/components/shared/role-switcher";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { label: "Mitt hjem", href: "/beboer", icon: Home },
  { label: "Saker", href: "/beboer/reklamasjoner", icon: Wrench },
  { label: "Kalender", href: "/beboer/kalender", icon: CalendarDays },
  { label: "Meldinger", href: "/beboer/meldinger", icon: MessageSquare },
];

const MORE_NAV = [
  { label: "Dokumenter", href: "/beboer/dokumenter", icon: FileText, desc: "FDV, garantier og tegninger" },
  { label: "Markedsplass", href: "/beboer/markedsplass", icon: ShoppingBag, desc: "Tjenester til boligen din" },
  { label: "Tilvalg", href: "/beboer/tilvalg", icon: Sparkles, desc: "Personliggjør boligen" },
  { label: "Sameie", href: "/beboer/sameie", icon: Users, desc: "Fellesarealer og styret" },
  { label: "Personvern", href: "/beboer/personvern", icon: ShieldCheck, desc: "Dine data og samtykker" },
];

export function MobileShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { notifications } = useStore();
  const unread = notifications.filter((n) => n.user_role === "beboer" && !n.read).length;

  const moreActive = MORE_NAV.some((i) => pathname.startsWith(i.href));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-surface/90 px-4 backdrop-blur">
        <Link href="/beboer" aria-label="Til Mitt hjem">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <CommandMenu />
          <NotificationCenter portal="beboer" />
          <RoleSwitcher compact />
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

      {/* «Mer»-skuff */}
      {moreOpen && (
        <div className="fixed inset-0 z-40" role="dialog" aria-label="Flere valg">
          <div className="absolute inset-0 bg-evergreen-950/40" onClick={() => setMoreOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface p-4 pb-24 shadow-[var(--shadow-pop)] animate-fade-up">
            <div className="flex items-center justify-between px-2 pb-2">
              <p className="text-sm font-semibold">Mer</p>
              <button onClick={() => setMoreOpen(false)} className="rounded-lg p-1.5 hover:bg-muted cursor-pointer" aria-label="Lukk">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-1">
              {MORE_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-evergreen-50"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-evergreen-50 text-evergreen-700">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-muted-foreground">{item.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bunnavigasjon */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur" aria-label="Bunnmeny">
        <div className="mx-auto grid max-w-3xl grid-cols-5">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/beboer" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
                  active ? "text-evergreen-700" : "text-muted-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="relative">
                  <item.icon className="h-5 w-5" aria-hidden />
                  {item.href === "/beboer" && unread > 0 && (
                    <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-red-500" aria-hidden />
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium cursor-pointer",
              moreActive || moreOpen ? "text-evergreen-700" : "text-muted-foreground",
            )}
            aria-expanded={moreOpen}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden />
            Mer
          </button>
        </div>
      </nav>
    </div>
  );
}
