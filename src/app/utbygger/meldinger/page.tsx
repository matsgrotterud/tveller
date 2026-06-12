"use client";

import { MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { formatRelative } from "@/lib/format";
import { getUnit, getUser } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/utils";

export default function UtbyggerMeldingerPage() {
  const { claims } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("alle");

  const threads = claims
    .map((c) => {
      const last = c.comments[c.comments.length - 1];
      return { claim: c, last, count: c.comments.length, unanswered: last?.author_role === "beboer" };
    })
    .filter((t) => t.count > 0)
    .filter((t) => filter !== "ubesvarte" || t.unanswered)
    .filter((t) => !query || t.claim.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (b.last?.created_at ?? "").localeCompare(a.last?.created_at ?? ""));

  return (
    <div className="max-w-4xl space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meldinger</h1>
        <p className="text-sm text-muted-foreground">Alle samtaler er knyttet til en sak – alltid sporbart</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input placeholder="Søk i samtaler …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i samtaler" />
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-44" aria-label="Filtrer">
          <option value="alle">Alle samtaler</option>
          <option value="ubesvarte">Venter på svar</option>
        </Select>
      </div>

      {threads.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Ingen samtaler" description="Meldinger fra beboere og leverandører vises her, gruppert per sak." />
      ) : (
        <div className="space-y-2">
          {threads.map(({ claim, last, unanswered }) => {
            const resident = getUser(claim.resident_user_id);
            const unit = getUnit(claim.unit_id);
            return (
              <Link key={claim.id} href={`/utbygger/reklamasjoner/${claim.id}`}>
                <Card className="mb-2 flex items-center gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-evergreen-100 text-xs font-bold text-evergreen-800">
                    {initials(resident?.name ?? "B")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{claim.title}</p>
                      {unanswered && <Badge className="shrink-0 bg-amber-50 text-amber-800">Venter på svar</Badge>}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {resident?.name} · {unit?.unit_number} · {last ? `${last.author_name.split(" ")[0]}: ${last.body}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <StatusPill status={claim.status} />
                    {last && <span className="text-[11px] text-muted-foreground">{formatRelative(last.created_at)}</span>}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
