"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Building2, Check, ChevronsUpDown, HardHat, Home, ShieldCheck, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROLE_LABEL } from "@/lib/permissions";
import { useStore } from "@/lib/store";
import type { RoleKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAIN_ROLES: { role: RoleKey; label: string; href: string; icon: typeof Home; sub: string }[] = [
  { role: "beboer", label: "Beboer", href: "/beboer", icon: Home, sub: "Lise Frankum · C103" },
  { role: "utbygger_admin", label: "Utbygger", href: "/utbygger", icon: Building2, sub: "Kari Nordheim · Nordheim Bolig" },
  { role: "leverandor_admin", label: "Underleverandør", href: "/leverandor", icon: HardHat, sub: "Thomas Bakke · Bare Rør AS" },
  { role: "superadmin", label: "Superadmin", href: "/admin", icon: ShieldCheck, sub: "Mats Tveller · Tveller AS" },
];

const SUB_ROLES: { role: RoleKey; href: string }[] = [
  { role: "sameiestyre", href: "/beboer/sameie" },
  { role: "prosjektleder", href: "/utbygger" },
  { role: "kundebehandler", href: "/utbygger/reklamasjoner" },
  { role: "juridisk", href: "/utbygger/juridisk" },
  { role: "tekniker", href: "/leverandor/arbeidsordre" },
  { role: "auditor", href: "/admin/audit" },
];

export function RoleSwitcher({ compact }: { compact?: boolean }) {
  const { role, setRole } = useStore();
  const router = useRouter();

  const active = MAIN_ROLES.find((r) => r.role === role);

  function switchTo(r: RoleKey, href: string) {
    setRole(r);
    router.push(href);
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm font-medium shadow-sm hover:bg-muted cursor-pointer",
            compact && "px-2",
          )}
          aria-label="Bytt demorolle"
        >
          <UserCog className="h-4 w-4 text-evergreen-600" aria-hidden />
          {!compact && <span className="hidden sm:inline">{active?.label ?? ROLE_LABEL[role]}</span>}
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className="z-50 w-72 rounded-xl border border-border bg-surface p-1.5 shadow-[var(--shadow-pop)]">
          <p className="px-2.5 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo: bytt portal</p>
          {MAIN_ROLES.map((r) => (
            <DropdownMenu.Item
              key={r.role}
              onSelect={() => switchTo(r.role, r.href)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm outline-none data-[highlighted]:bg-evergreen-50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-evergreen-50 text-evergreen-700">
                <r.icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{r.label}</span>
                <span className="block text-xs text-muted-foreground">{r.sub}</span>
              </span>
              {role === r.role && <Check className="h-4 w-4 text-evergreen-600" aria-hidden />}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1.5 h-px bg-border" />
          <p className="px-2.5 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Underroller</p>
          <div className="grid grid-cols-2 gap-0.5">
            {SUB_ROLES.map((r) => (
              <DropdownMenu.Item
                key={r.role}
                onSelect={() => switchTo(r.role, r.href)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs outline-none data-[highlighted]:bg-evergreen-50"
              >
                {role === r.role ? <Check className="h-3 w-3 text-evergreen-600" aria-hidden /> : <span className="h-3 w-3" />}
                {ROLE_LABEL[r.role]}
              </DropdownMenu.Item>
            ))}
          </div>
          <DropdownMenu.Separator className="my-1.5 h-px bg-border" />
          <p className="px-2.5 pb-1.5 text-[11px] text-muted-foreground">
            Rollebytteren er kun tilgjengelig i demo-modus (DEMO_MODE=true).
          </p>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
