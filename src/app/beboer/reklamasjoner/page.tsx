"use client";

import { ChevronRight, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusPill } from "@/components/shared/pills";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRelative } from "@/lib/format";
import { OPEN_STATUSES, RESIDENT_STATUS_EXPLANATION, ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Filter = "alle" | "åpne" | "avsluttede";

export default function BeboerReklamasjonerPage() {
  const { claims } = useStore();
  const [filter, setFilter] = useState<Filter>("alle");

  const myClaims = claims
    .filter((c) => c.resident_user_id === "u-lise")
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  const filtered = myClaims.filter((c) => {
    if (filter === "åpne") return OPEN_STATUSES.includes(c.status);
    if (filter === "avsluttede") return !OPEN_STATUSES.includes(c.status);
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reklamasjoner</h1>
          <p className="text-sm text-muted-foreground">Sakene dine for leilighet C103</p>
        </div>
        <Link href="/beboer/reklamasjoner/ny">
          <Button>
            <Plus aria-hidden />
            Ny sak
          </Button>
        </Link>
      </div>

      <div className="flex gap-1.5" role="tablist" aria-label="Filtrer saker">
        {(["alle", "åpne", "avsluttede"] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors cursor-pointer",
              filter === f ? "bg-evergreen-700 text-white" : "bg-surface border border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Ingen saker her"
          description="Når du melder en reklamasjon, dukker den opp her med full historikk og status."
          action={
            <Link href="/beboer/reklamasjoner/ny">
              <Button>Meld ny reklamasjon</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((c) => (
            <Link key={c.id} href={`/beboer/reklamasjoner/${c.id}`}>
              <Card className="mb-2.5 p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      {c.case_number} · {ROOM_LABEL[c.room_type]}
                    </p>
                    <p className="mt-0.5 font-medium leading-snug">{c.title}</p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <StatusPill status={c.status} />
                  <span className="text-xs text-muted-foreground">Oppdatert {formatRelative(c.updated_at)}</span>
                </div>
                {RESIDENT_STATUS_EXPLANATION[c.status] && (
                  <p className="mt-2 text-xs text-muted-foreground">{RESIDENT_STATUS_EXPLANATION[c.status]}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
