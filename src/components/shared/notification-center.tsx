"use client";

import * as Popover from "@radix-ui/react-popover";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { formatRelative } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { PortalKey } from "@/lib/types";
import { cn } from "@/lib/utils";

function entityHref(portal: PortalKey, entityType: string | null, entityId: string | null): string | null {
  if (!entityType || !entityId) return null;
  if (entityType === "claim") {
    if (portal === "beboer") return `/beboer/reklamasjoner/${entityId}`;
    if (portal === "utbygger") return `/utbygger/reklamasjoner/${entityId}`;
  }
  if (entityType === "work_order" && portal === "leverandor") return `/leverandor/arbeidsordre/${entityId}`;
  return null;
}

export function NotificationCenter({ portal }: { portal: PortalKey }) {
  const { notifications, markNotificationsRead } = useStore();
  const mine = notifications.filter((n) => n.user_role === portal).slice(0, 12);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface shadow-sm hover:bg-muted cursor-pointer"
          aria-label={`Varsler${unread > 0 ? `, ${unread} uleste` : ""}`}
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} className="z-50 w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface shadow-[var(--shadow-pop)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Varsler</p>
            <button
              onClick={() => markNotificationsRead(portal)}
              className="inline-flex items-center gap-1 text-xs font-medium text-evergreen-700 hover:underline cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden />
              Merk alle som lest
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {mine.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted-foreground">Ingen varsler ennå.</p>}
            {mine.map((n) => {
              const href = entityHref(portal, n.entity_type, n.entity_id);
              const inner = (
                <div className={cn("flex gap-3 px-4 py-3 transition-colors hover:bg-evergreen-50/50", !n.read && "bg-fjord-50/40")}>
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-sand-300" : "bg-fjord-500")} aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{formatRelative(n.created_at)}</p>
                  </div>
                </div>
              );
              return href ? (
                <Link key={n.id} href={href} className="block border-b border-border last:border-0">
                  {inner}
                </Link>
              ) : (
                <div key={n.id} className="border-b border-border last:border-0">
                  {inner}
                </div>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
